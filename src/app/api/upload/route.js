// app/api/upload/route.js (or whatever the path is)
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    console.log('Upload API called');
    
    // Auth check – verify cookie token
    const token = req.cookies.get("access_token")?.value;
    console.log('Token exists:', !!token);
    
    if (!token) {
      console.log('No token found in cookies');
      return NextResponse.json({ error: "Unauthorized – no token" }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Token valid for user:', decoded.userId);
    } catch (err) {
      console.log('Token verification failed:', err.message);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get file from formData
    const data = await req.formData();
    const file = data.get("file");
    console.log('File received:', !!file, file?.name, file?.size);

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Basic validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    console.log('Starting Cloudinary upload...');
    
    // Upload to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "blog_images" },
        (err, result) => {
          if (err) {
            console.log('Cloudinary error:', err);
            reject(err);
          } else {
            console.log('Cloudinary success:', result.secure_url);
            resolve(result);
          }
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: `Upload failed: ${err.message}` }, { status: 500 });
  }
}