import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ canResend: true });
    }

    const now = Date.now();
    const timeSinceLastEmail = now - (user.lastEmailSent || 0);
    const canResend = timeSinceLastEmail >= 60000;

    return NextResponse.json({ 
      canResend,
      waitTime: canResend ? 0 : Math.ceil((60000 - timeSinceLastEmail) / 1000)
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
