// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Removed password since we're pure magic link now
    // password: { type: String },  // commented out – no need

    isVerified: {
      type: Boolean,
      default: false,  // Only verified after clicking "Yes, it's me"
    },

    // New fields for magic link
    magicToken: {
      type: String,
    },
    magicTokenExpiry: {
      type: Number,  // timestamp in ms
    },

    // Old verification fields – can delete later but keep for now if you want
    verificationToken: String,
    verificationTokenExpiry: Date,

    // Optional reset fields – keep if you ever add password later
    resetToken: String,
    tokenExpiry: Date,

    // OAuth fields
    provider: {
      type: String,
      enum: ['google', 'twitter', 'apple'],
    },
    providerId: String,
    name: String,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;