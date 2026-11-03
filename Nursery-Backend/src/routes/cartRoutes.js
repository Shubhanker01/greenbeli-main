const express = require("express");
const router = express.Router();
const { requireUser } = require("../middleware/authMiddleware");
const {
  getCart,
  addOrUpdateItem,
  setItemQuantity,
  removeItem,
  clearCart,
} = require("../controllers/cartController");

router.use(requireUser);

router.get("/", getCart);
router.post("/items", addOrUpdateItem);
router.patch("/items/:productId", setItemQuantity);
router.delete("/items/:productId", removeItem);
router.delete("/", clearCart);

module.exports = router;
