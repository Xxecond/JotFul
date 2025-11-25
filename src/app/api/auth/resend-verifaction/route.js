import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/sendEmail";

export async function POST(req) {
  try {
    await connectDB();

    const { email } = await req.json();
    if (!email) return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    if (user.isVerified) return NextResponse.json({ success: true, message: "Already verified" });

    // Generate new token if expired or missing
    const token = user.verificationToken || crypto.randomUUID();
    const expiry = Date.now() + 1000 * 60 * 60 * 24; // 24h

    user.verificationToken = token;
    user.verificationTokenExpiry = expiry;
    await user.save();

    await sendVerificationEmail(email, token);

    return NextResponse.json({ success: true, message: "Verification email sent" });
  } catch (err) {
    console.error("Resend verification error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
