"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content, image }), // ✅ fixed here
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to create post");
      } else {
        alert("Post created successfully!");
        router.push("/home");
      }
    } catch (err) {
      console.error("Create error:", err);
      alert("Network or server error");
    }
  };

  return (<>
  <Header />
    <section className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create New Blog
        </h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {!image && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            required
            className="block w-full mb-4 text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500"
          />
        )}

        {image && (
          <div className="mb-4 text-center">
            <div className="relative w-full h-64 mb-3">
              <Image
                src={image}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <button
              type="button"
              onClick={() => setImage(null)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              Remove Image
            </button>
          </div>
        )}

        <textarea
          placeholder="Write your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="8"
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        ></textarea>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all"
        >
          Add Blog
        </button>
      </form>
    </section>
</>  );
}
