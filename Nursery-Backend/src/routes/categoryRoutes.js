const express = require("express");
const router = express.Router();
const multer = require("multer");
const { requireAuth } = require("../middleware/authMiddleware");
const { MAX_IMAGE_BYTES } = require("../utils/supabaseStorage");

const {
  listCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const categoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
});

router.get("/", listCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategoryById);

router.post("/", requireAuth, categoryUpload.single("image"), createCategory);
router.put("/:id", requireAuth, updateCategory);
router.delete("/:id", requireAuth, deleteCategory);

module.exports = router;
