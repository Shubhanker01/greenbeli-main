const express = require("express");
const router = express.Router();
const { requireUser } = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require("../controllers/orderController");

router.use(requireUser);

router.post("/", createOrder);
router.get("/", getMyOrders);
router.get("/:id", getOrderById);

module.exports = router;
