import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User"; // ✅ default import, not named

// GET request — for when user clicks the email verification link
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return new Response(
        "<h2>❌ Missing token</h2>",
        { headers: { "Content-Type": "text/html" } }
      );
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return new Response(
        "<h2>❌ Invalid or expired token</h2>",
        { headers: { "Content-Type": "text/html" } }
      );
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    // Redirect the user to the login page after successful verification
    // Build absolute URL using the request's host header for cross-device compatibility
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const loginUrl = new URL(`${protocol}://${host}/auth/login`);
    return NextResponse.redirect(loginUrl);
  } catch (err) {
    console.error("Email verification error:", err);
    return new Response(
      "<h2>❌ Something went wrong</h2>",
      { headers: { "Content-Type": "text/html" } }
    );
  }
}

// POST request — optional, if you want to verify via API call
export async function POST(req) {
  try {
    await connectDB();
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      email: user.email,
    });
  } catch (err) {
    console.error("Email verification POST error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
