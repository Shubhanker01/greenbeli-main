const express = require("express");
const router = express.Router();
const { createLead, listLeadsForAdmin, updateLeadStatus, deleteLead } = require("../controllers/customerLeadController");
const { requireAuth } = require("../middleware/authMiddleware");
router.post("/submit", createLead);
router.get("/", requireAuth, listLeadsForAdmin);
router.put("/:id", requireAuth, updateLeadStatus);
router.delete("/:id", requireAuth, deleteLead);

module.exports = router;
