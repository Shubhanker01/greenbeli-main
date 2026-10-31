const express = require("express");
const router = express.Router();

const {
  loginAdmin,
  adminSession,
  resetPassword,
  logout
} = require("../controllers/admin");
const { listAllOrders, updateOrderStatus } = require("../controllers/orderController");
const { dashboardStats } = require("../controllers/statsController");
const { requireAuth } = require("../middleware/authMiddleware");
const { loginLimiter } = require("../middleware/rateLimit");

router.get("/session", adminSession);
router.post("/login", loginLimiter, loginAdmin);
router.post("/reset-password", resetPassword);
router.get("/stats", requireAuth, dashboardStats);
router.get("/orders", requireAuth, listAllOrders);
router.patch("/orders/:id/status", requireAuth, updateOrderStatus);
router.get("/logout", requireAuth, logout);

module.exports = router;