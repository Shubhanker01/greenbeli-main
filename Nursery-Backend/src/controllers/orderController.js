const mongoose = require("mongoose");
const Order = require("../models/ordermodels");
const Cart = require("../models/cartmodel");
const Product = require("../models/Productsmodel");
const Setting = require("../models/setting");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { sendOrderConfirmationEmail } = require("../utils/email");
const { effectiveSellingUnit } = require("../utils/productPricing");

const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { paymentInfo } = req.body || {};
  const shippingInfo = req.body?.shippingInfo || req.body?.shippingAddress;
  if (!shippingInfo || typeof shippingInfo !== "object") {
    const err = new Error("shippingInfo is required");
    err.statusCode = 400;
    throw err;
  }
  const {
    address,
    city,
    state,
    country = "India",
    pincode,
    phoneNo = shippingInfo.phone,
  } = shippingInfo;
  if (!address || !city || !state || !country || pincode == null || phoneNo == null) {
    const err = new Error(
      "shippingInfo must include address, city, state, country, pincode, phoneNo"
    );
    err.statusCode = 400;
    throw err;
  }

  const normalizedPayment = {
    id: String(paymentInfo?.id || ""),
    status: String(paymentInfo?.status || "pending"),
    method: String(paymentInfo?.method || req.body?.paymentMethod || "UPI"),
    upiId: String(paymentInfo?.upiId || ""),
    phoneNo: String(paymentInfo?.phoneNo || ""),
    scannerRef: String(paymentInfo?.scannerRef || ""),
  };

  // Calculate tax and shipping dynamically from database settings
  const storeSettings = await Setting.getStore().catch(() => null);
  const shippingFee = Number(storeSettings?.shippingFee ?? 0);
  const freeThreshold = Number(storeSettings?.freeShippingThreshold ?? 999);
  const taxRate = Number(storeSettings?.taxPercent ?? 0);

  const session = await mongoose.startSession();
  let order;
  try {
    await session.withTransaction(async () => {
      const cart = await Cart.findOne({ userId }).session(session);
      if (!cart || !cart.Products || cart.Products.length === 0) {
        const err = new Error("Cart is empty");
        err.statusCode = 400;
        throw err;
      }

      const orderItems = [];
      let itemPrice = 0;

      for (const line of cart.Products) {
        const product = await Product.findById(line.productId).session(session);
        if (!product || product.isActive === false) {
          const err = new Error(`Product unavailable: ${line.productId}`);
          err.statusCode = 400;
          throw err;
        }
        if (product.stock < line.quantity) {
          const err = new Error(`Insufficient stock for ${product.name}`);
          err.statusCode = 400;
          throw err;
        }
        const unit = effectiveSellingUnit(product);
        itemPrice += unit * line.quantity;
        const img =
          Array.isArray(product.image) && product.image.length
            ? product.image[0]
            : "";
        orderItems.push({
          name: product.name,
          price: unit,
          quantity: line.quantity,
          image: img,
          product: product._id,
        });
      }

      const shippingPrice = itemPrice >= freeThreshold ? 0 : shippingFee;
      const taxPrice = taxRate > 0 ? Math.round((itemPrice * taxRate) / 100) : 0;

      // Validate promo code & compute discount on server
      const rawCoupon = String(req.body?.couponCode || "").trim().toUpperCase();
      let discountAmount = 0;
      let couponCode = "";

      if (rawCoupon === "GREEN20") {
        couponCode = "GREEN20";
        discountAmount = Math.round((itemPrice * 20) / 100);
      } else if (Number(req.body?.discountAmount) > 0 && !rawCoupon) {
        // Fallback for requests that already sent discountAmount directly
        discountAmount = Math.min(Number(req.body.discountAmount), itemPrice);
      }

      const totalPrice = Math.max(0, itemPrice - discountAmount + taxPrice + shippingPrice);

      const [createdOrder] = await Order.create([{
        shippingInfo: {
          address: String(address),
          city: String(city),
          state: String(state),
          country: String(country),
          pincode: Number(pincode),
          phoneNo: Number(phoneNo),
        },
        orderItems,
        user: userId,
        itemPrice,
        taxPrice,
        shippingPrice,
        discountAmount,
        couponCode,
        totalPrice,
        orderStatus: "Processing",
        paymentInfo: normalizedPayment,
      }], { session });

      // Conditional updates keep stock from going negative if inventory changed.
      for (const line of cart.Products) {
        const updated = await Product.findOneAndUpdate(
          { _id: line.productId, stock: { $gte: line.quantity } },
          { $inc: { stock: -line.quantity } },
          { new: true, session }
        );
        if (!updated) {
          const err = new Error("An item in your cart just went out of stock. Please check your cart.");
          err.statusCode = 409;
          throw err;
        }
      }

      cart.Products = [];
      cart.totalPrice = 0;
      await cart.save({ session });
      order = createdOrder;
    });
  } finally {
    await session.endSession();
  }

  try {
    const user = await User.findById(userId).select("name email");
    if (user?.email) {
      await sendOrderConfirmationEmail({
        toEmail: user.email,
        customerName: user.name,
        order,
      });
    } else {
      console.error(`Could not send order confirmation for order ${order._id}: user email not found`);
    }
  } catch (error) {
    console.error(`Could not send order confirmation for order ${order._id}:`, error);
  }

  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  res.json({ items: orders });
});

const getOrderById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid order id");
    err.statusCode = 400;
    throw err;
  }
  const order = await Order.findById(id);
  if (!order) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }
  if (String(order.user) !== String(userId)) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }
  res.json(order);
});

const listAllOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(String(req.query.page || "1"), 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || "20"), 10) || 20));
  const skip = (page - 1) * limit;
  const status = req.query.status;
  const filter = {};
  if (status) filter.orderStatus = String(status);

  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name firstName email"),
    Order.countDocuments(filter),
  ]);

  res.json({ items, page, limit, total });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body || {};
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid order id");
    err.statusCode = 400;
    throw err;
  }
  const allowed = ["Processing", "Shipped", "Delivered", "Cancelled"];
  if (!orderStatus || !allowed.includes(String(orderStatus))) {
    const err = new Error(`orderStatus must be one of: ${allowed.join(", ")}`);
    err.statusCode = 400;
    throw err;
  }
  const order = await Order.findById(id);
  if (!order) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }
  order.orderStatus = orderStatus;
  if (orderStatus === "Delivered") {
    order.deliveredAt = new Date();
  }
  await order.save();
  res.json(order);
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  listAllOrders,
  updateOrderStatus,
};
