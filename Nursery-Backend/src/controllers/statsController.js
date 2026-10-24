const Product = require("../models/Productsmodel");
const Category = require("../models/Categories");
const Order = require("../models/ordermodels");
const User = require("../models/User");
const Sale = require("../models/salemodel");
const Lead = require("../models/Lead");
const asyncHandler = require("../utils/asyncHandler");

const dashboardStats = asyncHandler(async (_req, res) => {
  const [
    totalProducts,
    categories,
    totalOrders,
    users,
    revenueAgg,
    salesCount,
    salesRevenueAgg,
    inquiryLeads,
    pendingOrders,
    recentOrderDocuments,
  ] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Category.countDocuments(),
    Order.countDocuments(),
    User.countDocuments(),
    Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),
    Sale.countDocuments(),
    Sale.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
    Lead.countDocuments(),
    Order.countDocuments({ orderStatus: { $in: ["Pending", "Processing"] } }),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name firstName"),
  ]);

  const orderRevenue = Number(revenueAgg[0]?.total) || 0;
  const salesRevenue = Number(salesRevenueAgg[0]?.total) || 0;
  const recentOrders = recentOrderDocuments.map((order) => ({
    _id: order._id,
    customerName: order.user?.name || order.user?.firstName || "Customer",
    totalAmount: order.totalPrice,
    status: order.orderStatus,
  }));

  res.json({
    totalRevenue: orderRevenue + salesRevenue,
    totalOrders,
    totalProducts,
    inquiryLeads,
    pendingOrders,
    recentOrders,
    products: totalProducts,
    categories,
    orders: totalOrders,
    users,
    salesCount,
    salesRevenue,
  });
});

module.exports = { dashboardStats };
