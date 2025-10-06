import { connectDB } from "@/lib/db";
import Post from "@/models/Post";

export async function GET(req, { params }) {
  await connectDB();
  const post = await Post.findById(params.id);
  if (!post)
    return new Response(JSON.stringify({ error: "Post not found" }), { status: 404 });

  return new Response(JSON.stringify(post), { status: 200 });
}
