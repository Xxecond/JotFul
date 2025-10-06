import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // ✅ Validate input
    if (!email || !password)
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );

    // ✅ Hash password & generate verification token
    const hashedPassword = await bcrypt.hash(password, 12);
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // ✅ Create user
    const newUser = new User({
      email,
      password: hashedPassword,
      verificationToken: token,
      verificationTokenExpiry: tokenExpiry,
    });

    await newUser.save();

    // ✅ Construct verification link
    const verifyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${token}`;

    // ✅ Configure email sender
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Send verification email
    await transporter.sendMail({
      from: `"Blogger App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>Welcome to Blogger App!</h2>
          <p>Click below to verify your email:</p>
          <a href="${verifyLink}"
             style="display:inline-block;background:#2563eb;color:#fff;
                    padding:10px 20px;border-radius:6px;text-decoration:none">
             Verify Email
          </a>
          <p>This link expires in 24 hours.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Signup successful! Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
