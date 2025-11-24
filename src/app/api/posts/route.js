import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// GET all posts for logged-in user
export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // Debug
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id; // ← use id from JWT payload

    if (!userId) {
      return NextResponse.json({ error: "Invalid token: missing userId" }, { status: 401 });
    }

    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// POST a new post
export async function POST(req) {
  try {
    await connectDB();

    const rawBody = await req.text();
    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { title, content, image } = parsedBody;
    if (!title || !content || !image) {
      return NextResponse.json({ error: "Title, content, and image are required" }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // Debug
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id; // ← use id from JWT payload
    if (!userId) {
      return NextResponse.json({ error: "Invalid token: missing userId" }, { status: 401 });
    }

    const post = await Post.create({
      title,
      content,
      image,
      userId, // ← correctly attach userId
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ error: "Server error while creating post" }, { status: 500 });
  }
}
