const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const Sale = require("../models/salemodel");
const Product = require("../models/Productsmodel");
const Admin = require("../models/admin");
const { randomUUID } = require("node:crypto");
const { effectiveSellingUnit } = require("../utils/productPricing");

// POST /sales  (admin)
// body: { items: [{ productId, quantity }], customerName, customerPhone, paymentMethod }
const createSale = asyncHandler(async (req, res) => {
  const {
    items: submittedItems,
    productId: legacyProductId,
    quantity: legacyQuantity,
    customerName = "Walk-in Customer",
    customerPhone = "",
    paymentMethod = "Cash",
  } = req.body || {};
  const items = Array.isArray(submittedItems)
    ? submittedItems
    : [{ productId: legacyProductId, quantity: legacyQuantity }];

  if (items.length === 0) {
    const err = new Error("At least one product is required");
    err.statusCode = 400;
    throw err;
  }

  const quantitiesByProduct = new Map();
  for (const item of items) {
    const id = String(item?.productId || "");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error("Each item must have a valid productId");
      err.statusCode = 400;
      throw err;
    }
    const quantity = Number(item.quantity);
    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
      const err = new Error("Each item quantity must be a positive integer");
      err.statusCode = 400;
      throw err;
    }
    const combinedQuantity = (quantitiesByProduct.get(id) || 0) + quantity;
    if (!Number.isSafeInteger(combinedQuantity)) {
      const err = new Error("Combined item quantity is too large");
      err.statusCode = 400;
      throw err;
    }
    quantitiesByProduct.set(id, combinedQuantity);
  }

  const allowedPaymentMethods = ["Cash", "UPI", "Card"];
  if (!allowedPaymentMethods.includes(String(paymentMethod))) {
    const err = new Error(`paymentMethod must be one of: ${allowedPaymentMethods.join(", ")}`);
    err.statusCode = 400;
    throw err;
  }

  const productIds = [...quantitiesByProduct.keys()];
  const products = await Product.find({ _id: { $in: productIds } });
  const productsById = new Map(products.map((product) => [String(product._id), product]));

  for (const [id, quantity] of quantitiesByProduct) {
    const product = productsById.get(id);
    if (!product) {
      const err = new Error(`Product not found: ${id}`);
      err.statusCode = 404;
      throw err;
    }
    if (product.isActive === false) {
      const err = new Error(`${product.name} is inactive and cannot be sold`);
      err.statusCode = 400;
      throw err;
    }
    if (product.stock < quantity) {
      const err = new Error(`Insufficient stock for ${product.name}`);
      err.statusCode = 400;
      throw err;
    }
  }

  const adminEmail = String(req.user?.email || "").toLowerCase();
  const admin = adminEmail ? await Admin.findOne({ email: adminEmail }).select("_id") : null;
  const receiptNo = `REC-${randomUUID().slice(0, 8).toUpperCase()}`;
  const saleRecords = [];
  const updatedStock = [];

  try {
    for (const [id, quantity] of quantitiesByProduct) {
      const result = await Product.updateOne(
        { _id: id, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } }
      );
      if (result.matchedCount !== 1) {
        const err = new Error(`Insufficient stock for ${productsById.get(id).name}`);
        err.statusCode = 409;
        throw err;
      }
      updatedStock.push({ id, quantity });
    }

    const saleDocuments = [...quantitiesByProduct].map(([id, quantity]) => {
      const product = productsById.get(id);
      const unitPrice = effectiveSellingUnit(product);
      return {
        productId: id,
        adminId: admin?._id || null,
        receiptNo,
        customerName: String(customerName || "Walk-in Customer").trim(),
        customerPhone: String(customerPhone || "").trim(),
        paymentMethod: String(paymentMethod),
        quantity,
        unitPrice,
        totalAmount: unitPrice * quantity,
      };
    });
    saleRecords.push(...await Sale.create(saleDocuments));
  } catch (error) {
    const rollbackResults = await Promise.allSettled([
      Sale.deleteMany({ receiptNo }),
      ...updatedStock.map(({ id, quantity }) =>
        Product.updateOne({ _id: id }, { $inc: { stock: quantity } })
      ),
    ]);
    rollbackResults
      .filter((result) => result.status === "rejected")
      .forEach((result) => console.error("POS sale rollback failed:", result.reason));
    throw error;
  }

  const totalAmount = saleRecords.reduce((total, sale) => total + sale.totalAmount, 0);
  res.status(201).json({
    _id: saleRecords[0]._id,
    receiptNo,
    customerName: saleRecords[0].customerName,
    customerPhone: saleRecords[0].customerPhone,
    paymentMethod: saleRecords[0].paymentMethod,
    createdAt: saleRecords[0].createdAt,
    totalAmount,
  });
});

function buildSalesFilter(query = {}, user = {}) {
  const {
    from,
    to,
    productId,
    adminId,
  } = query || {};

  const filter = {};

  if (productId) {
    if (!mongoose.Types.ObjectId.isValid(String(productId))) {
      const err = new Error("productId is invalid");
      err.statusCode = 400;
      throw err;
    }
    filter.productId = String(productId);
  }

  if (adminId) {
    if (!mongoose.Types.ObjectId.isValid(String(adminId))) {
      const err = new Error("adminId is invalid");
      err.statusCode = 400;
      throw err;
    }
    filter.adminId = String(adminId);
  }

  const isSuperAdmin = user?.role === "superadmin";
  if (!isSuperAdmin && user?.id && mongoose.Types.ObjectId.isValid(String(user.id))) {
    filter.adminId = String(user.id);
  }

  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(String(from));
    if (to) filter.createdAt.$lte = new Date(String(to));
  }
  return filter;
}

// GET /sales?page=&limit=&from=&to=&productId=&adminId=
const listSales = asyncHandler(async (req, res) => {
  const {
    page = "1",
    limit = "20",
  } = req.query || {};

  const filter = buildSalesFilter(req.query, req.user);

  const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Sale.find(filter)
      .populate("productId")
      .populate("adminId", "name email role isSuperAdmin")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Sale.countDocuments(filter),
  ]);

  res.json({ items, page: pageNum, limit: limitNum, total });
});

// GET /sales/summary?from=&to=&productId=&adminId=
const salesSummary = asyncHandler(async (req, res) => {
  const filter = buildSalesFilter(req.query, req.user);

  const grouped = await Sale.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$adminId",
        totalQuantity: { $sum: { $ifNull: ["$quantity", 0] } },
        totalAmount: { $sum: { $ifNull: ["$totalAmount", 0] } },
        saleCount: { $sum: 1 },
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  const adminIds = grouped.map((row) => row._id).filter(Boolean);
  const admins = await Admin.find({ _id: { $in: adminIds } }).select("name email role");
  const adminById = new Map(admins.map((a) => [String(a._id), a]));

  const byAdmin = grouped.map((row) => {
    const admin = adminById.get(String(row._id));
    return {
      adminId: row._id,
      name: admin?.name || "",
      email: admin?.email || "Unknown",
      role: admin?.role || "",
      totalQuantity: Number(row.totalQuantity || 0),
      totalAmount: Number(row.totalAmount || 0),
      saleCount: Number(row.saleCount || 0),
    };
  });

  const totals = byAdmin.reduce(
    (acc, row) => {
      acc.totalQuantity += row.totalQuantity;
      acc.totalAmount += row.totalAmount;
      acc.saleCount += row.saleCount;
      return acc;
    },
    { totalQuantity: 0, totalAmount: 0, saleCount: 0 }
  );

  res.json({
    totals,
    byAdmin,
  });
});

// GET /sales/product-summary?from=&to=&productId=&adminId=
const salesProductSummary = asyncHandler(async (req, res) => {
  const filter = buildSalesFilter(req.query, req.user);
  const grouped = await Sale.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$productId",
        soldQuantity: { $sum: { $ifNull: ["$quantity", 0] } },
        totalAmount: { $sum: { $ifNull: ["$totalAmount", 0] } },
        saleCount: { $sum: 1 },
        lastSoldAt: { $max: "$createdAt" },
      },
    },
    { $sort: { soldQuantity: -1 } },
  ]);

  const productIds = grouped.map((row) => row._id).filter(Boolean);
  const products = await Product.find({ _id: { $in: productIds } })
    .select("name sku stock createdAt");
  const productById = new Map(products.map((p) => [String(p._id), p]));

  const items = grouped.map((row) => {
    const product = productById.get(String(row._id));
    return {
      productId: row._id,
      name: product?.name || "Unknown Product",
      sku: product?.sku || "—",
      currentStock: Number(product?.stock ?? 0),
      soldQuantity: Number(row.soldQuantity || 0),
      totalAmount: Number(row.totalAmount || 0),
      saleCount: Number(row.saleCount || 0),
      lastSoldAt: row.lastSoldAt || null,
      productCreatedAt: product?.createdAt || null,
    };
  });

  const totals = items.reduce(
    (acc, row) => {
      acc.products += 1;
      acc.saleCount += row.saleCount;
      acc.soldQuantity += row.soldQuantity;
      acc.totalAmount += row.totalAmount;
      acc.remainingStock += row.currentStock;
      return acc;
    },
    { products: 0, saleCount: 0, soldQuantity: 0, totalAmount: 0, remainingStock: 0 }
  );

  res.json({ totals, items });
});

// GET /sales/:id
const getSale = asyncHandler(async (req, res) => {
  const { id } = req.params || {};
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid sale id");
    err.statusCode = 400;
    throw err;
  }

  const sale = await Sale.findById(id)
    .populate("productId")
    .populate("adminId", "name email role isSuperAdmin");

  if (!sale) {
    const err = new Error("Sale not found");
    err.statusCode = 404;
    throw err;
  }

  const receiptSales = sale.receiptNo
    ? await Sale.find({ receiptNo: sale.receiptNo }).populate("productId").sort({ createdAt: 1 })
    : [sale];
  const items = receiptSales.map((receiptSale) => ({
    productId: receiptSale.productId?._id || receiptSale.productId,
    name: receiptSale.productId?.name || "Product no longer available",
    quantity: receiptSale.quantity,
    price: Number(receiptSale.unitPrice ?? (receiptSale.totalAmount / receiptSale.quantity)),
    totalAmount: receiptSale.totalAmount,
  }));

  res.json({
    _id: sale._id,
    receiptNo: sale.receiptNo || String(sale._id),
    customerName: sale.customerName || "Walk-in Customer",
    customerPhone: sale.customerPhone || "",
    paymentMethod: sale.paymentMethod || "Cash",
    createdAt: sale.createdAt,
    totalAmount: receiptSales.reduce((total, receiptSale) => total + Number(receiptSale.totalAmount || 0), 0),
    items,
  });
});

module.exports = { createSale, listSales, getSale, salesSummary, salesProductSummary };