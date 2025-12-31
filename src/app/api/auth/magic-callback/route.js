import { connectDB } from "@/lib/db";
import User from "@/models/User";
import AuthSession from "@/models/AuthSession";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const sessionId = searchParams.get("sessionId");
    const action = searchParams.get("action");

    if (!token) {
      return redirect("/login?error=invalid-token");
    }

    const user = await User.findOne({
      magicToken: token,
      magicTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return redirect("/login?error=expired-token");
    }

    // Clear the magic token and verify user
    user.magicToken = undefined;
    user.magicTokenExpiry = undefined;
    user.isVerified = true; // Only verify when they approve
    await user.save();

    // Handle deny action
    if (action === "deny") {
      if (sessionId) {
        await AuthSession.create({
          sessionId,
          authenticated: false,
          denied: true
        });
      }
      return new Response(`
        <html><body style="font-family:Arial;text-align:center;padding:50px;">
          <h2>❌ Request Denied</h2>
          <p>Login request has been denied. You can close this tab.</p>
          <script>setTimeout(() => window.close(), 2000);</script>
        </body></html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    // Handle approve action (default)
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // If sessionId provided, mark session as authenticated for cross-device
    if (sessionId) {
      await AuthSession.create({
        sessionId,
        authenticated: true,
        jwtToken
      });
      
      return new Response(`
        <html><body style="font-family:Arial;text-align:center;padding:50px;">
          <h2>✅ Authentication Successful!</h2>
          <p>You can close this tab now.</p>
          <script>setTimeout(() => window.close(), 2000);</script>
        </body></html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    // Normal flow - set cookie and redirect
    const response = NextResponse.redirect(new URL("/home", req.url));
    response.cookies.set("access_token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/"
    });

    return response;
  } catch (err) {
    console.error(err);
    return redirect("/login?error=server-error");
  }
}