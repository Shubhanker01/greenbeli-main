const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");

const {
  listPlantCareGuides,
  getPlantCareGuideById,
  createPlantCareGuide,
  updatePlantCareGuide,
  deletePlantCareGuide,
} = require("../controllers/plantCareController");

router.get("/", listPlantCareGuides);
router.get("/:id", getPlantCareGuideById);
router.post("/", requireAuth, createPlantCareGuide);
router.put("/:id", requireAuth, updatePlantCareGuide);
router.delete("/:id", requireAuth, deletePlantCareGuide);

module.exports = router;
