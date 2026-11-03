const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { standardLimit } = require("../middleware/rateLimit");

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
router.post("/journal", standardLimit, requireAuth, createJournalArticle);
router.post("/faqs", standardLimit, requireAuth, createFaq);
router.delete("/journal/:id", standardLimit, requireAuth,deleteJournalArticle);
router.put("/journal/:id", standardLimit, requireAuth, updateJournalArticle);

router.put("/faqs/:id", standardLimit, requireAuth, updateFaq);
router.delete("/faqs/:id", standardLimit, requireAuth, deleteFaq);

module.exports = router;

