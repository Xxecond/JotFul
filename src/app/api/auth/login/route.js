 import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // ✅ Basic validation
    if (!email || !password)
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );

    // ✅ Find user
    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );

    // ✅ Check email verification
    if (!user.isVerified)
      return NextResponse.json(
        { success: false, message: "Please verify your email first" },
        { status: 403 }
      );

    // ✅ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );

    // ✅ Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Send response
    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
