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

    const user = await User.findOne({
      magicToken: token,
      magicTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return new NextResponse("Invalid or expired link", { status: 400 });
    }

    // Clear the one-time magic token
    user.magicToken = undefined;
    user.magicTokenExpiry = undefined;
    user.isVerified = true;
    await user.save();

    if (!JWT_SECRET) {
      return new NextResponse("Missing JWT_SECRET", { status: 500 });
    }

    // Generate long-lived JWT
    const authToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Create response that redirects straight to /home
    const response = NextResponse.redirect(new URL("/home", req.url));

    // Set httpOnly cookie – this is what middleware checks
    response.cookies.set("access_token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Magic callback error:", err);
    return new NextResponse(`Error: ${err.message}`, { status: 500 });
  }
}