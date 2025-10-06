"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function BlogCard({ blog, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);
  const router = useRouter();

  // ✅ Prevent hooks from being conditional
  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > 120);
    }
  }, [blog?.body]);

  // ✅ Return after hooks
  if (!blog || !blog.body) return null;

  const handleReadMore = () => setIsExpanded(!isExpanded);
  const handleView = () => router.push(`/blog/${blog._id}`);
  const handleDelete = () => onDelete(blog._id);

  return (
    <div className="bg-white shadow-md rounded-xl p-5 mb-6 border border-gray-100">
      {/* Blog Image */}
      {blog.image && (
        <div className="relative w-full h-60 mb-4">
          <Image
            src={blog.image}
            alt={blog.title || "Blog image"}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {blog.title}
      </h2>

      {/* Content */}
      <p
        ref={contentRef}
        className="text-gray-700 leading-relaxed mb-3"
      >
        {isExpanded
          ? blog.body
          : blog.body.slice(0, 150) + (blog.body.length > 150 ? "..." : "")}
      </p>

      {/* Buttons */}
      <div className="flex gap-3 mt-2">
        {isOverflowing && (
          <button
            onClick={handleReadMore}
            className="text-blue-600 hover:underline"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}
        <button
          onClick={handleView}
          className="text-green-600 hover:underline"
        >
          View
        </button>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
