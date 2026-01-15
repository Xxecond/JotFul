import { connectDB } from "@/lib/db";
import AuthSession from "@/models/AuthSession";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const session = await AuthSession.findOne({ sessionId });

    if (!session) {
      return NextResponse.json({ authenticated: false, denied: false });
    }

    if (session.denied) {
      return NextResponse.json({ authenticated: false, denied: true });
    }

    if (session.authenticated && session.jwtToken) {
      const response = NextResponse.json({ authenticated: true });
      response.cookies.set("access_token", session.jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/"
      });
      
      await AuthSession.deleteOne({ sessionId });
      return response;
    }

    return NextResponse.json({ authenticated: false, denied: false });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
