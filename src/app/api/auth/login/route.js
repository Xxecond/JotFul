import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );

    if (!user.isVerified)
      return NextResponse.json(
        { success: false, message: "Please verify your email first" },
        { status: 403 }
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Build Set-Cookie header for HttpOnly access_token so middleware can detect auth
    const maxAge = 60 * 60 * 24 // 1 day in seconds
    const isProd = process.env.NODE_ENV === 'production'
    let cookie = `access_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`
    if (isProd) cookie += '; Secure'

    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email
      },
    }, { status: 200, headers: { 'Set-Cookie': cookie } });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
