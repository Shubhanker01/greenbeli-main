const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");

const {
  getJournalArticles,
  getJournalArticleBySlug,
  createJournalArticle,
  getFaqs,
  createFaq,
  deleteJournalArticle,
  updateJournalArticle,
  deleteFaq,
  updateFaq
} = require("../controllers/contentController");

// Public routes
router.get("/journal", getJournalArticles);
router.get("/journal/:slug", getJournalArticleBySlug);
router.get("/faqs", getFaqs);

// Admin routes
router.post("/journal", requireAuth, createJournalArticle);
router.post("/faqs", requireAuth, createFaq);
router.delete("/journal/:id", requireAuth, deleteJournalArticle);
router.put("/journal/:id", requireAuth, updateJournalArticle);

router.put("/faqs/:id", requireAuth, updateFaq);
router.delete("/faqs/:id", requireAuth, deleteFaq);

module.exports = router;

