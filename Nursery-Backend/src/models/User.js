const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      // required: true,
      unique: true,
      lowercase: true
    },
    supabaseId: { type: String, unique: true, sparse: true, index: true },

    profilePicture: {
      type: Array,
      default: ['https://w7.pngwing.com/pngs/910/606/png-transparent-head-the-dummy-avatar-man-tie-jacket-user-thumbnail.png'] // Replace with your default image URL
    },

    phone: {
      type: String,
      match: [/^\d{10}$/, 'Phone number must be 10 digits'],
      default: null
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: null
    },
    dateOfBirth: {
      type: String,
      required: false,
      default: null
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },


    token: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

