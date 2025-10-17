 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // ✅ store file
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file); // ✅ store selected file
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      if (selectedFile) {
        const data = new FormData();
        data.append("file", selectedFile);
        data.append("upload_preset", "blog_upload");

        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dgylk90yt/image/upload",
          { method: "POST", body: data }
        );

        const uploadData = await uploadRes.json();
        console.log("Cloudinary upload result:", uploadData);

        if (!uploadData.secure_url) throw new Error("Cloudinary upload failed");

        imageUrl = uploadData.secure_url;
      } else {
        throw new Error("No image selected");
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, content, image: imageUrl }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to create post");

      alert("✅ Post created successfully!");
      router.push("/home");
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="block w-full mb-4 text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500"
          />

          {imagePreview && (
            <div className="mb-4 text-center">
              <div className="relative w-full h-64 mb-3">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setSelectedFile(null); // ✅ reset selected file
                }}
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
            disabled={loading}
            className={`w-full py-3 text-white font-medium rounded-lg transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Uploading..." : "Add Blog"}
          </button>
        </form>
      </section>
    </>
  );
}
