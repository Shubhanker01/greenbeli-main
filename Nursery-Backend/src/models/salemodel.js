const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null
  },

  receiptNo: { type: String, index: true, sparse: true },
  customerName: { type: String, trim: true, default: "Walk-in Customer" },
  customerPhone: { type: String, trim: true, default: "" },
  paymentMethod: { type: String, trim: true, default: "Cash" },
  quantity: Number,
  unitPrice: Number,
  totalAmount: Number,

}, { timestamps: true });

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;