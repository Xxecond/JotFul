import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/User";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 12);
  const token = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

  const newUser = new User({
    email,
    password: hashedPassword,
    verificationToken: token,
    verificationTokenExpiry: tokenExpiry,
  });
  await newUser.save();

  const verifyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Blogger App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: `
      <h2>Welcome to Blogger App!</h2>
      <p>Click below to verify your email:</p>
      <a href="${verifyLink}" style="background:#2563eb;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">Verify Email</a>
    `,
  });

  return NextResponse.json({
    success: true,
    message: "Signup successful! Please check your email to verify.",
  });
}
