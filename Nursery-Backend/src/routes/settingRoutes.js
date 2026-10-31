const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { getSettings, updateSettings } = require("../controllers/settingsController");

router.get("/", getSettings);
router.put("/", requireAuth, updateSettings);       

module.exports = router;
