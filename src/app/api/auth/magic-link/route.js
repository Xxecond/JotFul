// app/api/auth/magic-link/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { sendMagicLinkEmail } from "@/lib/sendEmail";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { email, sessionId } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.magicToken = token;
    user.magicTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_BASE_URL 
      : 'http://localhost:3000';
    const magicLink = `${baseUrl}/api/auth/magic-callback?token=${token}`;

    await sendMagicLinkEmail(email, magicLink, sessionId);

    return NextResponse.json({ 
      message: "Magic link sent",
      waitingUrl: `${baseUrl}/auth/waiting`
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}