 "use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BlogCard({ blog, onDelete }) {
  if (!blog || !blog.content) return null;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (contentRef.current) {
      const el = contentRef.current;
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [blog.content]);

  const handleToggle = () => {
    if (isOverflowing) setIsExpanded((prev) => !prev);
  };

  const handleDelete = () => {
    if (window.confirm("Delete this blog?")) {
      const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
      const updatedBlogs = blogs.filter((b) => b.id !== blog.id);
      localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
      onDelete(blog.id);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-5 mb-6 transition hover:shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-3">{blog.title}</h2>

      {blog.image && (
        <div className="mb-3">
          <img
            src={blog.image}
            alt={blog.title}
            className="rounded-lg w-full h-64 object-cover"
          />
        </div>
      )}

      <div
        ref={contentRef}
        onClick={handleToggle}
        className={`text-gray-700 leading-relaxed overflow-hidden ${
          isExpanded ? "max-h-none" : "max-h-24"
        } cursor-${isOverflowing ? "pointer" : "default"} transition-all`}
      >
        <p>{blog.content}</p>
        {isOverflowing && (
          <span className="text-blue-600 text-sm block mt-2">
            {isExpanded ? "View less" : "... View more"}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 text-sm">
        <Link
          href={`/edit/${blog.id}`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>
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
