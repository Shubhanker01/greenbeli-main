const Journal = require("../models/Journal");
const Faq = require("../models/Faq");
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");

// Public: Get all published journal articles
const getJournalArticles = asyncHandler(async (req, res) => {
  const articles = await Journal.find({ isPublished: true }).sort({ createdAt: -1 });
  res.json({ items: articles });
});

// Public: Get single journal article by slug
const getJournalArticleBySlug = asyncHandler(async (req, res) => {
  const article = await Journal.findOne({ slug: req.params.slug, isPublished: true });
  if (!article) {
    const err = new Error("Article not found");
    err.statusCode = 404;
    throw err;
  }
  res.json(article);
});

// Admin: Create journal article
const createJournalArticle = asyncHandler(async (req, res) => {
  const { title, slug, category, description, content, image, imageAlt, isPublished } = req.body;
  if (!title || !slug) {
    const err = new Error("Title and slug are required");
    err.statusCode = 400;
    throw err;
  }
  const article = await Journal.create({
    title,
    slug: String(slug).toLowerCase().trim(),
    category,
    description,
    content,
    image,
    imageAlt,
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
  });
  res.status(201).json(article);
});

// Public: Get all active FAQs grouped or listed
const getFaqs = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = String(category);
  const faqs = await Faq.find(filter).sort({ sortOrder: 1, createdAt: 1 });
  res.json({ items: faqs });
});

// Admin: Create FAQ
const createFaq = asyncHandler(async (req, res) => {
  const { question, answer, category, sortOrder, isActive } = req.body;
  if (!question || !answer) {
    const err = new Error("Question and answer are required");
    err.statusCode = 400;
    throw err;
  }
  const faq = await Faq.create({
    question,
    answer,
    category: category || "General",
    sortOrder: Number(sortOrder) || 0,
    isActive: isActive !== undefined ? Boolean(isActive) : true,
  });
  res.status(201).json(faq);
});


const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const assertValidId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw httpError("Invalid id", 400);
};

// Admin: Update journal article (only the fields sent are changed)
const updateJournalArticle = asyncHandler(async (req, res) => {
  assertValidId(req.params.id);

  const allowed = ["title", "slug", "category", "description", "content", "image", "imageAlt", "isPublished"];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  if (updates.title !== undefined && !String(updates.title).trim()) {
    throw httpError("Title cannot be empty", 400);
  }
  if (updates.slug !== undefined) {
    updates.slug = String(updates.slug).toLowerCase().trim();
    if (!updates.slug) throw httpError("Slug cannot be empty", 400);
  }
  if (updates.isPublished !== undefined) updates.isPublished = Boolean(updates.isPublished);

  if (Object.keys(updates).length === 0) throw httpError("No valid fields to update", 400);

  let article;
  try {
    article = await Journal.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
  } catch (e) {
    if (e.code === 11000) throw httpError("An article with this slug already exists", 409);
    throw e;
  }
  if (!article) throw httpError("Article not found", 404);

  res.json(article);
});

// Admin: Delete journal article
const deleteJournalArticle = asyncHandler(async (req, res) => {
  assertValidId(req.params.id);

  const article = await Journal.findByIdAndDelete(req.params.id);
  if (!article) throw httpError("Article not found", 404);

  res.json({ success: true, message: "Article deleted" });
});

// Admin: Update FAQ (only the fields sent are changed)
const updateFaq = asyncHandler(async (req, res) => {
  assertValidId(req.params.id);

  const allowed = ["question", "answer", "category", "sortOrder", "isActive"];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  if (updates.question !== undefined && !String(updates.question).trim()) {
    throw httpError("Question cannot be empty", 400);
  }
  if (updates.answer !== undefined && !String(updates.answer).trim()) {
    throw httpError("Answer cannot be empty", 400);
  }
  if (updates.category !== undefined) updates.category = String(updates.category).trim() || "General";
  if (updates.sortOrder !== undefined) {
    updates.sortOrder = Number(updates.sortOrder);
    if (!Number.isFinite(updates.sortOrder)) throw httpError("Sort order must be a number", 400);
  }
  if (updates.isActive !== undefined) updates.isActive = Boolean(updates.isActive);

  if (Object.keys(updates).length === 0) throw httpError("No valid fields to update", 400);

  const faq = await Faq.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!faq) throw httpError("FAQ not found", 404);

  res.json(faq);
});

// Admin: Delete FAQ
const deleteFaq = asyncHandler(async (req, res) => {
  assertValidId(req.params.id);

  const faq = await Faq.findByIdAndDelete(req.params.id);
  if (!faq) throw httpError("FAQ not found", 404);

  res.json({ success: true, message: "FAQ deleted" });
});

// Add these four to your module.exports:
//   updateJournalArticle, deleteJournalArticle, updateFaq, deleteFaq

module.exports = {
  getJournalArticles,
  getJournalArticleBySlug,
  createJournalArticle,
  getFaqs,
  createFaq,
  updateJournalArticle,
  deleteJournalArticle,
  updateFaq,
  deleteFaq
};

