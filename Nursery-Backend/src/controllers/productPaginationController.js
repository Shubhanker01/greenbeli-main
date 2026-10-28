const mongoose = require("mongoose");
const Product = require("../models/Productsmodel");
const Category = require("../models/Categories");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Controller to return paginated and searchable products catalog for Admin
 */
const getPaginatedProducts = asyncHandler(async (req, res) => {
  const {
    page = "1",
    limit = "10",
    search = "",
    categoryId,
    active,
    stockStatus,
  } = req.query || {};

  const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};

  if (search && String(search).trim()) {
    const q = String(search).trim();
    const searchRegex = { $regex: q, $options: "i" };

    // Find category IDs matching search term so searching "Indoor Plants" works
    const matchedCategories = await Category.find({ name: searchRegex }).select("_id").lean();
    const matchedCategoryIds = matchedCategories.map((c) => c._id);

    const orConditions = [
      { name: searchRegex },
      { sku: searchRegex },
      { commonName: searchRegex },
      { botanicalName: searchRegex },
    ];

    if (matchedCategoryIds.length > 0) {
      orConditions.push({ categoryId: { $in: matchedCategoryIds } });
    }

    filter.$or = orConditions;
  }

  if (categoryId) {
    if (mongoose.Types.ObjectId.isValid(String(categoryId))) {
      filter.categoryId = String(categoryId);
    }
  }

  if (active !== undefined) {
    const v = String(active).toLowerCase();
    if (v === "true" || v === "1") filter.isActive = true;
    else if (v === "false" || v === "0") filter.isActive = false;
  }

  if (stockStatus) {
    filter.stockStatus = String(stockStatus);
  }

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("categoryId", "name slug kind plantSegment coverImage description isActive")
      .lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limitNum));

  res.json({
    items,
    page: pageNum,
    limit: limitNum,
    total,
    totalPages,
  });
});

module.exports = {
  getPaginatedProducts,
};

