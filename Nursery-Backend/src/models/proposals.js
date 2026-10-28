const mongoose = require("mongoose");

const PROPOSAL_STATUSES = ["Pending", "Proposal Sent", "Approved", "Rejected"];

const proposalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    projectType: {
      type: String,
      required: true,
      enum: ["Residential Balcony", "Villa Garden", "Corporate Office"],
    },
    estimatedBudget: {
      type: String,
      required: true,
      enum: [
        "Under ₹10,000",
        "₹10,000 - ₹25,000",
        "₹25,000 - ₹50,000",
        "₹50,000+",
      ],
    },
    spaceSize: { type: String, trim: true, default: "" },
    requirements: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: PROPOSAL_STATUSES,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Proposal", proposalSchema);
module.exports.PROPOSAL_STATUSES = PROPOSAL_STATUSES;
