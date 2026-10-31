const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/authMiddleware");
const { standardLimit, burstLimit, publicSubmitLimit } = require("../middleware/rateLimit");

const {
  listPublicTestimonials,
  createTestimonial,
  listAdminTestimonials,
  setApproval,
  deleteTestimonial,
} = require("../controllers/testimonialController");
const upload = require("../../multer");

router.get("/", listPublicTestimonials);
router.post("/", burstLimit, publicSubmitLimit, createTestimonial);
router.get("/admin", requireAuth, listAdminTestimonials);
router.patch("/admin/:id/approval", standardLimit, requireAuth, setApproval);
router.delete("/admin/:id", standardLimit, requireAuth, deleteTestimonial);

module.exports = router;
