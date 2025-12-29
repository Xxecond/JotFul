import mongoose from "mongoose";

const AuthSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  authenticated: { type: Boolean, default: false },
  denied: { type: Boolean, default: false },
  jwtToken: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 900 } // 15 minutes
});

export default mongoose.models.AuthSession || mongoose.model("AuthSession", AuthSessionSchema);