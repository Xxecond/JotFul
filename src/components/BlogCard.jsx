'use client'

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BlogCard({ blog, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > contentRef.current.clientHeight);
    }
  }, [blog?.content]);

  if (!blog || !blog.content) return null;

  const handleToggle = () => {
    if (isOverflowing) setIsExpanded(prev => !prev);
  };

  const handleEdit = () => {
    router.push(`/blog/edit/${blog._id}`);
  };

  return (
    <div className="w-5/6 max-w-4xl bg-cyan-600 rounded-lg overflow-hidden my-12 mx-auto wrap-break-word whitespace-normal">
      {/* Title */}
      <h2 className="text-center p-2 text-xl md:text-2xl xl:3xl font-semibold text-white tracking-wide  bg-cyan-700 ">
        {blog.title}
      </h2>

      {/* Image */}
      {blog.image && (
        <div className="w-full h-[80vh] relative z-0">
          <Image
            src={blog.image}
            alt={blog.title || "Blog image"}
            fill
            className="object-cover absolute"
          />
        </div>
      )}

      {/* Content */}
      {/* Content */}
<div className="relative text-white p-2 text-xl tracking-wide leading-snug font-light mx-auto">
  <div
    ref={contentRef}
    onClick={handleToggle}
    className={`cursor-${isOverflowing ? "pointer" : "default"} ${
      isExpanded ? "" : "line-clamp-2"
    } pr-14 whitespace-pre-line`} // adds space on the right for "View more"
  >
    <p>{blog.content}</p>
  </div>

  {/* View more / View less - positioned at the bottom right of the clamped text */}
  {isOverflowing && !isExpanded && (
    <span
      onClick={handleToggle}
      className="absolute bottom-2 right-6 text-[#4fc3f7] font-bold text-[1rem] cursor-pointer"
    >
     ... View more
    </span>
  )}
  {isOverflowing && isExpanded && (
    <span
      onClick={handleToggle}
      className="block text-[#4fc3f7] font-bold text-[1rem] cursor-pointer mt-2"
    >
      View less
    </span>
  )}
</div>

      {/* Actions */}
      <div className="flex flex-row justify-around items-center my-2  ">
        <button
          onClick={handleEdit}
          className="text-[2rem] bg-green-600 text-white px-3  rounded hover:font-bold"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(blog._id)}
          className="text-[2rem] bg-red-600 text-white px-3 rounded hover:font-bold"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
