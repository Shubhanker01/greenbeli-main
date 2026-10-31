const express = require('express');
const router = express.Router();
const multer = require("multer");
const { authMiddleware, requireAuth } = require("../middleware/authMiddleware");
const { MAX_IMAGE_BYTES } = require("../utils/supabaseStorage");
const { standardLimit } = require("../middleware/rateLimit");

const {
  productadd,
  listProducts,
  getProduct,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  addOrUpdateMyReview,
  updateReview,
  fetchProductReviews
} = require("../controllers/productController");
const { getPaginatedProducts } = require("../controllers/productPaginationController");
const productUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES, files: 8 },
});




// public read (slug before :id so "slug" is not parsed as id)
router.get("/paginated", getPaginatedProducts);
router.get("/", listProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProduct);
router.post("/:id/reviews", standardLimit, authMiddleware, addOrUpdateMyReview);
router.put("/:id/reviews/:reviewId", standardLimit, authMiddleware, updateReview);
router.get("/:id/reviews", fetchProductReviews);

// admin write
router.post('/add', standardLimit, requireAuth, productUpload.array("images", 8), productadd);
router.put("/:id", requireAuth, updateProduct);
router.delete(
  "/:id",
  standardLimit,
  requireAuth,
  deleteProduct
);

module.exports = router;