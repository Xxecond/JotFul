// app/api/posts/[id]/route.js
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const JWT_SECRET = process.env.JWT_SECRET;

// Helper: get userId from httpOnly cookie
async function getUserId(req) {
  const token = req.cookies.get("access_token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId || decoded.id;
  } catch {
    return null;
  }
}

// GET one post (public – no auth needed)
export async function GET(req, { params }) {
  const { id } = params;

  try {
    await connectDB();
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("GET post error:", error);
    return NextResponse.json({ error: "Failed to load post" }, { status: 500 });
  }
}

// PUT – update post
export async function PUT(req, { params }) {
  const { id } = params;

  try {
    await connectDB();

    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const removeImage = formData.get("removeImage");
    const image = formData.get("image"); // new file
    const imageUrl = formData.get("imageUrl"); // existing URL from frontend

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });
    }

    const post = await Post.findOne({ _id: id, userId });
    if (!post) {
      return NextResponse.json({ error: "Post not found or unauthorized" }, { status: 404 });
    }

    let finalImageUrl = post.image;

    // Use existing URL if sent
    if (imageUrl && typeof imageUrl === "string" && imageUrl.trim()) {
      finalImageUrl = imageUrl;
    }
    // Upload new image if file provided
    else if (image && typeof image === "object") {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "blog_images" },
          (err, res) => (err ? reject(err) : resolve(res))
        ).end(buffer);
      });

      finalImageUrl = result.secure_url;
    }
    // Remove image if requested
    else if (removeImage === "true") {
      finalImageUrl = "";
    }

    post.title = title;
    post.content = content;
    post.image = finalImageUrl;
    await post.save();

    return NextResponse.json(post);
  } catch (error) {
    console.error("PUT post error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// DELETE post
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await connectDB();

    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await Post.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return NextResponse.json({ error: "Post not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    console.error("DELETE post error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}