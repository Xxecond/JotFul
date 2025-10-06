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
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpiry: Date,

    // Optional fields for password reset
    resetToken: String,
    tokenExpiry: Date,
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite on hot reloads (Next.js fix)
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
