 import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// ✅ GET all posts for a user
export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const posts = await Post.find({ userId: decoded.id }).sort({ createdAt: -1 });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// ✅ CREATE new post
export async function POST(req) {
  try {
    await connectDB();

    // 🔎 Debug: see exactly what body is sent
    const rawBody = await req.text();
    console.log("Raw body:", rawBody);

    // ✅ Parse JSON body
    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { title, content, image } = parsedBody;
    console.log("Parsed body:", { title, content, image });

    if (!title || !content || !image) {
      return NextResponse.json(
        { error: "Title, content, and image are required" },
        { status: 400 }
      );
    }

    // ✅ Verify Authorization
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Save post to MongoDB
    const post = await Post.create({
      title,
      content,
      image, // Cloudinary URL
      userId: decoded.id,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { error: "Server error while creating post" },
      { status: 500 }
    );
  }
}
