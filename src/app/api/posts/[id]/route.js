 import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import formidable from "formidable";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = { api: { bodyParser: false } };

// Parse incoming form data
const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

// ✅ GET one post
export async function GET(req, { params }) {
  try {
    await connectDB();
    const post = await Post.findById(params.id);
    if (!post)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load post" }, { status: 500 });
  }
}

// ✅ UPDATE post
export async function PUT(req, { params }) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { fields, files } = await parseForm(req);
    const { title, content, removeImage } = fields;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    let post = await Post.findOne({ _id: params.id, userId: decoded.id });
    if (!post)
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 }
      );

    let imageUrl = post.image; // keep existing image by default

    // If new image is uploaded
    if (files.image) {
      const uploadResult = await cloudinary.uploader.upload(
        files.image.filepath,
        { folder: "blog_images" }
      );
      imageUrl = uploadResult.secure_url;
    }

    // If removeImage is true, clear it
    if (removeImage === "true") imageUrl = "";

    post.title = title;
    post.content = content;
    post.image = imageUrl;

    await post.save();
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("PUT /api/posts/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// ✅ DELETE post
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer "))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const deleted = await Post.findOneAndDelete({
      _id: params.id,
      userId: decoded.id,
    });

    if (!deleted)
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 }
      );

    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
