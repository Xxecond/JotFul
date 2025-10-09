"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import BlogCard from "@/components/BlogCard";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import LoginMock from "@/components/LoginMock";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch blogs from MongoDB backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch blogs");

        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Error loading blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // ✅ Delete blog from backend
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ✅ Filter blogs by title
  const filtered = blogs.filter((blog) =>
    blog?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading blogs...
      </div>
    );
  }

  return (
    <>
      <Header />
      <SearchBar setSearchTerm={setSearchTerm} />
      <Navbar />

      <section className="home px-4 py-6">
        {filtered.length > 0 ? (
          filtered.map(
            (blog) =>
              blog && (
                <BlogCard key={blog._id} blog={blog} onDelete={handleDelete} />
              )
          )
        ) : (
          <div className="text-center mt-20">
            <p className="mb-4 text-gray-600">No blogs found.</p>
            <Link
              href="/create"
              className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              CREATE NEW BLOG
            </Link>
          </div>
        )}

        <LoginMock />
      </section>
    </>
  );
}
