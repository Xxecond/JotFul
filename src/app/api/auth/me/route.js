import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    const token = req.cookies.get("access_token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    await connectDB();
    const user = await User.findById(decoded.userId).select("email");
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ email: user.email });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}