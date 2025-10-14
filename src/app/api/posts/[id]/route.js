 import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import formidable from "formidable";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: { bodyParser: false }, // disable Next.js default parser
};

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const postId = params.id;
    const post = await Post.findOne({ _id: postId, userId: decoded.id });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    // Parse form data
    const form = new formidable.IncomingForm();
    const data = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { title, content, removeImage } = data.fields;
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    let imageUrl = post.image; // keep current image by default

    // Handle new image upload
    if (data.files.image) {
      const file = data.files.image;
      const fileData = fs.readFileSync(file.filepath);
      const uploadResult = await cloudinary.uploader.upload(file.filepath, {
        folder: "blog_images",
      });
      imageUrl = uploadResult.secure_url;
    }

    // Handle remove image
    if (removeImage === "true") {
      imageUrl = "";
    }

    post.title = title;
    post.content = content;
    post.image = imageUrl;

    await post.save();

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("PUT /api/posts/[id] error:", error);
    return NextResponse.json({ error: "Server error while updating post" }, { status: 500 });
  }
}
