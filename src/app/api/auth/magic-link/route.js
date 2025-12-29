// app/api/auth/magic-link/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { sendMagicLinkEmail } from "@/lib/sendEmail";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { email, sessionId, action } = await req.json(); // action: 'signup' or 'login'

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    
    // Handle signup
    if (action === 'signup') {
      if (existingUser) {
        return NextResponse.json({ error: "User already exists. Please login instead." }, { status: 400 });
      }
      // Create new user
      const user = await User.create({ 
        email,
        isVerified: false // Not verified until they click "Yes, it's me"
      });
      
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
        message: "Account created! Check your email to verify.",
        waitingUrl: `${baseUrl}/auth/waiting`
      });
    }
    
    // Handle login
    if (action === 'login') {
      if (!existingUser) {
        return NextResponse.json({ error: "No account found. Please signup first." }, { status: 400 });
      }
      
      const token = crypto.randomBytes(32).toString("hex");
      existingUser.magicToken = token;
      existingUser.magicTokenExpiry = Date.now() + 15 * 60 * 1000;
      await existingUser.save();

      const baseUrl = process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_BASE_URL 
        : 'http://localhost:3000';
      const magicLink = `${baseUrl}/api/auth/magic-callback?token=${token}`;

      await sendMagicLinkEmail(email, magicLink, sessionId);

      return NextResponse.json({ 
        message: "Magic link sent! Check your email.",
        waitingUrl: `${baseUrl}/auth/waiting`
      });
    }
    
    // Fallback - treat as login if no action specified
    let user = existingUser;
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