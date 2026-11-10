const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const PlantCareGuide = require("../models/plantCareGuides");

const GUIDE_FIELDS = ["title", "description", "tip"];

function createHttpError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function validateGuideFields(body, { requireAll = false } = {}) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw createHttpError("Request body must be an object", 400);
  }

  const values = {};
  for (const field of GUIDE_FIELDS) {
    if (body[field] === undefined) {
      if (requireAll) {
        throw createHttpError(`${field} is required`, 400);
      }
      continue;
    }

    if (typeof body[field] !== "string" || !body[field].trim()) {
      throw createHttpError(`${field} must be a non-empty string`, 400);
    }
    values[field] = body[field].trim();
  }

  if (Object.keys(values).length === 0) {
    throw createHttpError("At least one guide field is required", 400);
  }

  return values;
}

const listPlantCareGuides = asyncHandler(async (_req, res) => {
  const items = await PlantCareGuide.find().sort({ _id: -1 }).lean();
  res.json({ items });
});

const getPlantCareGuideById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError("Invalid plant care guide id", 400);
  }

  const item = await PlantCareGuide.findById(id).lean();
  if (!item) {
    throw createHttpError("Plant care guide not found", 404);
  }
  res.json(item);
});

const createPlantCareGuide = asyncHandler(async (req, res) => {
  const values = validateGuideFields(req.body, { requireAll: true });
  const item = await PlantCareGuide.create(values);
  res.status(201).json(item);
});

const updatePlantCareGuide = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError("Invalid plant care guide id", 400);
  }

  const values = validateGuideFields(req.body);
  const item = await PlantCareGuide.findByIdAndUpdate(id, values, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    throw createHttpError("Plant care guide not found", 404);
  }
  res.json(item);
});

const deletePlantCareGuide = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError("Invalid plant care guide id", 400);
  }

  const item = await PlantCareGuide.findByIdAndDelete(id);
  if (!item) {
    throw createHttpError("Plant care guide not found", 404);
  }
  res.json({ ok: true });
});

module.exports = {
  listPlantCareGuides,
  getPlantCareGuideById,
  createPlantCareGuide,
  updatePlantCareGuide,
  deletePlantCareGuide,
};