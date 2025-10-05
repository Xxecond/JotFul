   "use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPostById } from "@/lib/postService"; // adjust import path as needed
import Image from "next/image";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadPost = async () => {
      const data = await getPostById(id);
      if (!data?.error) setBlog(data);
      setLoading(false);
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
        <div className="relative w-full h-64 mb-6">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      <p className="text-gray-700 leading-relaxed">
        {blog.body || blog.content}
      </p>
    </div>
  );
}
