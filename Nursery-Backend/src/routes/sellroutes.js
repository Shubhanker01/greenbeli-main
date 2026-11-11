const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/authMiddleware");

const { createSale, listSales, getSale, salesSummary, salesProductSummary } = require("../controllers/salesController");

// Superadmin only (POS / sales reporting)
router.get("/", requireAuth, listSales);
router.get("/summary", requireAuth, salesSummary);
router.get("/product-summary", requireAuth, salesProductSummary);
router.get("/:id", requireAuth, getSale);
router.post("/", requireAuth, createSale);

module.exports = router;