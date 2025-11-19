"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getPostById } from "@/lib/postService";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadPost = async () => {
      try {
        const data = await getPostById(id); // ✅ use postService
        setBlog(data);
      } catch (err) {
        console.error(err);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading blog...</p>
      </div>
    );

  if (!blog)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">Blog not found</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-md rounded-xl">
      <h2 className="text-3xl font-semibold mb-4 text-gray-800">{blog.title}</h2>

      {blog.image && (
        <div className="mb-6">
          <Image
            src={
              blog.image.startsWith("http") || blog.image.startsWith("/")
                ? blog.image
                : `/assets/${blog.image}`
            }
            alt={blog.title}
            width={600}
            height={400}
            className="rounded-lg object-cover w-full h-80"
          />
        </div>
      )}

      <p className="text-gray-700 leading-relaxed">
        {blog.body || blog.content}
      </p>
    </div>
  );
}
