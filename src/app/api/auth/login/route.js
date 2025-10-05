import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/User";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });

  if (!user.isVerified)
    return NextResponse.json({ success: false, message: "Please verify your email" }, { status: 403 });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

  return NextResponse.json({
    success: true,
    message: "Login successful",
    token,
    user: { id: user._id, email: user.email },
  });
}
