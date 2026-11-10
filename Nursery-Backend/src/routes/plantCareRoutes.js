const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { standardLimit } = require("../middleware/rateLimit");

const {
  listPlantCareGuides,
  getPlantCareGuideById,
  createPlantCareGuide,
  updatePlantCareGuide,
  deletePlantCareGuide,
} = require("../controllers/plantCareController");

router.get("/", listPlantCareGuides);
router.get("/:id", getPlantCareGuideById);
router.post("/", standardLimit, requireAuth, createPlantCareGuide);
router.put("/:id", standardLimit, requireAuth, updatePlantCareGuide);
router.delete("/:id", standardLimit, requireAuth, deletePlantCareGuide);

module.exports = router;
