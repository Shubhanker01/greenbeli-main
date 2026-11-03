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
    // Adjust the field name / filter to your Order schema (e.g. exclude cancelled orders)
    orderRevenue: sumOf(Order, "totalAmount", { status: { $ne: "cancelled" } }),
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
  });
});

module.exports = { dashboardStats };