// app/api/auth/magic-callback/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return new NextResponse("No token provided", { status: 400 });
    }

    // Find user by magic token (not old verificationToken)
    const user = await User.findOne({
      magicToken: token,
      magicTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return new NextResponse("Invalid or expired magic link", { status: 400 });
    }

    // Clear the used token
    user.magicToken = undefined;
    user.magicTokenExpiry = undefined;
    user.isVerified = true;
    await user.save();

    if (!JWT_SECRET) {
      return new NextResponse("Server missing JWT_SECRET", { status: 500 });
    }

    // Create real session token
    const authToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Redirect to success page with token
    const redirectUrl = `/magic-success?token=${authToken}&user=${encodeURIComponent(
      JSON.stringify({ id: user._id, email: user.email })
    )}`;

    return NextResponse.redirect(new URL(redirectUrl, req.url));
  } catch (err) {
    console.error("Magic callback error:", err);
    return new NextResponse(`Error: ${err.message}`, { status: 500 });
  }
}