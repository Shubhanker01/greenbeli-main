const Product = require("../models/Productsmodel");
const Category = require("../models/Categories");
const Order = require("../models/ordermodels");
const User = require("../models/User");
const Sale = require("../models/salemodel");
const Lead = require("../models/Lead");
const asyncHandler = require("../utils/asyncHandler");
const Testimonial = require("../models/Testimonial");
const Proposal = require("../models/proposals");
const Journal = require("../models/Journal");
const Faq = require("../models/Faq");

// Sum of one numeric field across a collection (0 when the collection is empty)
const sumOf = async (Model, field, match = {}) => {
  const [row] = await Model.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: `$${field}` } } },
  ]);
  return Number(row?.total) || 0;
};

const dashboardStats = asyncHandler(async (_req, res) => {
  // Results are matched to names by key, so adding or reordering queries can't misalign them
  const queries = {
    totalProducts: Product.countDocuments({ isActive: true }),
    categories: Category.countDocuments(),
    totalCustomers: User.countDocuments(),
    inquiryLeads: Lead.countDocuments(),
    totalProposals: Proposal.countDocuments(),
    totalTestimonials: Testimonial.countDocuments(),
    totalOrders: Order.countDocuments(),
    totalJournals: Journal.countDocuments(),
    totalFaqs: Faq.countDocuments(),
    salesCount: Sale.countDocuments(),
    salesRevenue: sumOf(Sale, "totalAmount"),
    // Revenue from delivered orders only
    orderRevenue: sumOf(Order, "totalPrice", { orderStatus: "Delivered" }),
  };

  const keys = Object.keys(queries);
  const values = await Promise.all(Object.values(queries));
  const r = Object.fromEntries(keys.map((k, i) => [k, values[i]]));

  res.json({
    // used by the new dashboard cards
    totalProducts: r.totalProducts,
    totalCustomers: r.totalCustomers,
    inquiryLeads: r.inquiryLeads,
    totalProposals: r.totalProposals,
    totalTestimonials: r.totalTestimonials,
    totalOrders: r.totalOrders,
    totalJournals: r.totalJournals,
    totalFaqs: r.totalFaqs,

    // kept for anything else that still reads them
    totalRevenue: r.orderRevenue + r.salesRevenue,
    products: r.totalProducts,
    categories: r.categories,
    users: r.totalCustomers,
    salesCount: r.salesCount,
    salesRevenue: r.salesRevenue,
    orderRevenue: r.orderRevenue,
  });
});

// GET /api/admin/sales-analytics
// Returns monthly aggregated revenue from both Orders (Delivered) and POS Sales
// for the last N months (default 12)
const salesAnalytics = asyncHandler(async (req, res) => {
  const months = Math.min(24, Math.max(1, parseInt(String(req.query.months || "12"), 10) || 12));

  // Build date range: start of (months) months ago → now
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

  // Helper: aggregate monthly totals for a model
  const monthlyAgg = (Model, amountField, matchExtra = {}) =>
    Model.aggregate([
      { $match: { ...matchExtra, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: `$${amountField}` },
          count: { $sum: 1 },
        },
      },
    ]);

  const [orderRows, salesRows, deliveredCount, totalOrderCount, totalSalesCount] =
    await Promise.all([
      monthlyAgg(Order, "totalPrice", { orderStatus: "Delivered" }),
      monthlyAgg(Sale, "totalAmount"),
      Order.countDocuments({ orderStatus: "Delivered" }),
      Order.countDocuments(),
      Sale.countDocuments(),
    ]);

  // Build a lookup map keyed by "YYYY-MM"
  const orderMap = new Map(orderRows.map((r) => [`${r._id.year}-${r._id.month}`, r]));
  const salesMap = new Map(salesRows.map((r) => [`${r._id.year}-${r._id.month}`, r]));

  const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const chart = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1) + i, 1);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    const orderRow = orderMap.get(key);
    const salesRow = salesMap.get(key);
    chart.push({
      month: `${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`,
      orderRevenue: Number(orderRow?.total || 0),
      posRevenue: Number(salesRow?.total || 0),
      totalRevenue: Number(orderRow?.total || 0) + Number(salesRow?.total || 0),
      orderCount: Number(orderRow?.count || 0),
      posCount: Number(salesRow?.count || 0),
    });
  }

  // Overall totals
  const totalOrderRevenue = orderRows.reduce((s, r) => s + Number(r.total || 0), 0);
  const totalPosRevenue = salesRows.reduce((s, r) => s + Number(r.total || 0), 0);

  res.json({
    chart,
    summary: {
      deliveredOrders: deliveredCount,
      totalOrders: totalOrderCount,
      posSales: totalSalesCount,
      totalSalesAll: totalOrderCount + totalSalesCount,
      orderRevenue: totalOrderRevenue,
      posRevenue: totalPosRevenue,
      totalRevenue: totalOrderRevenue + totalPosRevenue,
    },
  });
});

module.exports = { dashboardStats, salesAnalytics };