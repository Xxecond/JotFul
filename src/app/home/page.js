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

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("blogs") || "[]");
    setBlogs(stored);
  }, []);

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    const updated = blogs.filter((blog) => blog.id !== id);
    localStorage.setItem("blogs", JSON.stringify(updated));
    setBlogs(updated);
  };

  const filtered = blogs.filter((blog) =>
    blog?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Header /> 
     <SearchBar  setSearchTerm={setSearchTerm} />
    <Navbar />
    <section className="home">
      {filtered.length > 0 ? (
        filtered.map(
          (blog) =>
            blog && (
              <BlogCard key={blog.id} blog={blog} onDelete={handleDelete} />
            )
        )
      ) : (
        <div className="blogdirect text-center mt-30">
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
