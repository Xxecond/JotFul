import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const token = req.cookies.get("access_token")?.value;
  
  return NextResponse.json({
    hasCookie: !!token,
    token: token ? "exists" : "missing",
    decoded: token ? jwt.decode(token) : null
  });
}