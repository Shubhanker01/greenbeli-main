const mongoose = require("mongoose");

const plantCareGuideSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tip: {
        type: String,
        required: true,
        trim: true
    }
})

const PlantCareGuide = mongoose.model("PlantCareGuide", plantCareGuideSchema);

module.exports = PlantCareGuide;