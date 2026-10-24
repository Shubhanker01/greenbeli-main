const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/authMiddleware");

const {
  listPublicTestimonials,
  createTestimonial,
  listAdminTestimonials,
  setApproval,
  deleteTestimonial,
} = require("../controllers/testimonialController");
const upload = require("../../multer");

router.get("/", listPublicTestimonials);
router.post("/", requireAuth, createTestimonial);
router.get("/admin", requireAuth, listAdminTestimonials);
router.patch("/admin/:id/approval", requireAuth, setApproval);
router.delete("/admin/:id", requireAuth, deleteTestimonial);

module.exports = router;
