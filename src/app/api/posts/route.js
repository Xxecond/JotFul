 import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

// ✅ CREATE post
export async function POST(req) {
  try {
    await connectDB();

    // Verify user token
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Use formData() instead of formidable
    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const image = formData.get("image");

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    let imageUrl = "";

    // If user uploaded an image
    if (image && typeof image === "object") {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blog_images" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    // Save post in MongoDB
    const post = await Post.create({
      title,
      content,
      image: imageUrl,
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
