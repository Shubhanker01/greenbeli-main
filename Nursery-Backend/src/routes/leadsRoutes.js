const express = require("express");
const router = express.Router();
const { createLead, listLeadsForAdmin, updateLeadStatus, deleteLead } = require("../controllers/customerLeadController");
const { requireAuth } = require("../middleware/authMiddleware");
const { standardLimit, burstLimit, publicSubmitLimit } = require("../middleware/rateLimit");

router.post("/submit", burstLimit, publicSubmitLimit, createLead);
router.get("/", standardLimit, requireAuth, listLeadsForAdmin);
router.put("/:id", standardLimit, requireAuth, updateLeadStatus);
router.delete("/:id", standardLimit, requireAuth, deleteLead);

module.exports = router;
