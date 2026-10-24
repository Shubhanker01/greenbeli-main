const express = require('express');
const router = express.Router();
const multer = require("multer");
const { authMiddleware, requireAuth } = require("../middleware/authMiddleware");
const { MAX_IMAGE_BYTES } = require("../utils/supabaseStorage");
const {
  productadd,
  listProducts,
  getProduct,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  addOrUpdateMyReview,
  updateReview,
} = require("../controllers/productController");
const productUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES, files: 8 },
});




// public read (slug before :id so "slug" is not parsed as id)
router.get("/", listProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProduct);
router.post("/:id/reviews", authMiddleware, addOrUpdateMyReview);
router.put("/:id/reviews/:reviewId", authMiddleware, updateReview);

// admin write
router.post('/add', requireAuth, productUpload.array("images", 8), productadd);
router.put("/:id", requireAuth, updateProduct);
router.delete(
  "/:id",
  requireAuth,
  deleteProduct
);

module.exports = router;