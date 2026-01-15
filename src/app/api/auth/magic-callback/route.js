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
      return redirect("/auth/login?error=invalid-token");
    }

    const user = await User.findOne({
      magicToken: token,
      magicTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return redirect("/auth/login?error=expired-token");
    }

    // Clear the magic token and verify user
    user.magicToken = undefined;
    user.magicTokenExpiry = undefined;
    user.isVerified = true;
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
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family:Arial;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f3f4f6;">
            <div style="text-align:center;">
              <h2 style="font-size:2rem;font-weight:bold;color:#ef4444;margin-bottom:1rem;">❌ Request Denied</h2>
              <p style="font-size:1.125rem;color:#6b7280;">Login request has been denied. You can close this tab.</p>
            </div>
            <script>setTimeout(() => window.close(), 2000);</script>
          </body>
        </html>
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
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family:Arial;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f3f4f6;">
            <div style="text-align:center;">
              <h2 style="font-size:2rem;font-weight:bold;color:#22c55e;margin-bottom:1rem;">✅ Authentication Successful!</h2>
      <p>Redirecting...</p>
            </div>
            <script>setTimeout(() => window.close(), 2000);</script>
          </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    // Normal flow - set cookie and redirect
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = NextResponse.redirect(new URL("/home", baseUrl));
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