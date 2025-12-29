import { connectDB } from "@/lib/db";
import AuthSession from "@/models/AuthSession";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const session = await AuthSession.findOne({ sessionId });
    
    if (session && session.denied) {
      // Clean up the session
      await AuthSession.deleteOne({ sessionId });
      return NextResponse.json({ authenticated: false, denied: true });
    }
    
    if (session && session.authenticated) {
      // Transfer the JWT cookie to this response
      const response = NextResponse.json({ authenticated: true });
      response.cookies.set("access_token", session.jwtToken, {
        httpOnly: true,
        secure: true, // Always secure in production
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/" // Ensure cookie is available site-wide
      });
      
      // Clean up the session
      await AuthSession.deleteOne({ sessionId });
      
      return response;
    }

    return NextResponse.json({ authenticated: false });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}