'use client'

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSettings } from "@/contexts/SettingsContext";

export default function BlogCard({ blog, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);
  const router = useRouter();
  const { settings } = useSettings();

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > contentRef.current.clientHeight);
    }
  }, [blog?.content]);

  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'small': return 'text-lg';
      case 'large': return 'text-2xl';
      default: return 'text-xl';
    }
  };

  const getThemeClass = () => {
    return 'bg-cyan-600 dark:bg-cyan-900 text-white';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffMs = now - posted;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleToggle = () => {
    if (isOverflowing) setIsExpanded(prev => !prev);
  };

  const handleEdit = () => {
    router.push(`/blog/edit/${blog._id}`);
  };

  return (
    <div className={`w-[95%] max-w-4xl rounded-lg overflow-hidden mx-auto wrap-break-word whitespace-normal ${
      settings.compactView ? 'my-6' : 'my-12'
    } ${getThemeClass()}`}>
      {/* Title */}
      <div className="text-center p-2 relative bg-cyan-700 dark:bg-cyan-950">
        <h2 className="text-xl md:text-2xl xl:3xl font-semibold text-white tracking-wide">
          {blog.title}
        </h2>
        {blog.createdAt && settings.showTimestamps && (
          <p className="absolute -translate-y-1/2 top-1/2 right-2 text-xs xl:text-sm text-cyan-100 dark:text-cyan-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {getTimeAgo(blog.createdAt)}
          </p>
        )}
      </div>

      {/* Image */}
      {blog.image && (
        <div className={`w-full relative z-0 ${
          settings.compactView ? 'h-[50vh]' : 'h-[80vh]'
        }`}>
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
<div className={`relative text-white p-2 tracking-wide leading-snug font-light mx-auto ${getFontSizeClass()}`}>
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
      <div className="flex flex-row justify-between mx-9 items-center my-2  ">
        <button
          onClick={handleEdit}
          className="text-xl md:2xl bg-green-600 dark:bg-green-800 text-white px-3 rounded hover:font-bold"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(blog._id)}
          className="text-xl md:2xl  bg-red-600 dark:bg-red-800 text-white px-3 rounded hover:font-bold"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
