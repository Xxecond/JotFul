"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header, BlogCard, SearchBar } from "@/components";
import { getUserPosts, deletePost } from "@/lib/api";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getUserPosts(); // ✅ auto-token handled in api.js
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading blogs:", err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deletePost(id); // ✅ token handled automatically
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete post");
    }
  };

  const filtered = blogs.filter((blog) =>
    blog?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        Loading blogs...
      </div>
    );
  }

  return (
    <>
      <Header className="z-90" />
      <SearchBar setSearchTerm={setSearchTerm} />
      <section className="home px-4 py-6">
        {filtered.length > 0 ? (
          filtered.map(
            (blog) =>
              blog && (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  onDelete={handleDelete}
                />
              )
          )
        ) : (
          <div className="text-center mt-40">
            <Link
              href="/create"
              className="px-5 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all"
            >
              CREATE NEW BLOG
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
