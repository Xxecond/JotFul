import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { title, body, image } = await req.json();
    if (!title || !body)
      return NextResponse.json({ error: "Title and body are required" }, { status: 400 });

    const post = await Post.create({
      title,
      body,
      image,
      userId: decoded.userId,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ error: "Server error while creating post" }, { status: 500 });
  }
}
