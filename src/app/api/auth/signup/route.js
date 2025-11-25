import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with `isVerified: false` by default
    const newUser = await User.create({
      email,
      password: hashedPassword,
      isVerified: false
    });

    // Optionally, generate a verification token
    const verificationToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || "change_this_secret",
      { expiresIn: "1d" } // Token valid for 1 day
    );

    // TODO: Send verification email with this token
    // e.g., `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
    return NextResponse.json(
      { message: "User created. Please verify your email.", verificationToken },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
