import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token)
    return new Response("<h2>❌ Missing token</h2>", { headers: { "Content-Type": "text/html" } });

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpiry: { $gt: Date.now() },
  });

  if (!user)
    return new Response("<h2>❌ Invalid or expired token</h2>", { headers: { "Content-Type": "text/html" } });

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save();

  return new Response(`
    <h2>✅ Email Verified Successfully!</h2>
    <a href="${process.env.NEXT_PUBLIC_CLIENT_URL}/login">Go to Login</a>
  `, { headers: { "Content-Type": "text/html" } });
}

export async function POST(req) {
  await connectDB();
  const { token } = await req.json();

  if (!token)
    return NextResponse.json({ success: false, message: "Token required" }, { status: 400 });

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpiry: { $gt: Date.now() },
  });

  if (!user)
    return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save();

  return NextResponse.json({ success: true, message: "Email verified", email: user.email });
}
