 "use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";

export default function EditBlog() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load blog");

        setTitle(data.title || "");
        setContent(data.content || "");
        if (data.image) {
          setImagePreview(data.image);
          setExistingImage(data.image);
        }
      } catch (err) {
        alert(err.message);
        router.push("/home");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file)); // For preview
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    fileInputRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);
      let imageUrl = existingImage; // default to old image

      // ✅ Upload new image to Cloudinary if changed
      if (fileInputRef.current?.files[0]) {
        const data = new FormData();
        data.append("file", fileInputRef.current.files[0]);
        data.append("upload_preset", "blog_upload"); // 👈 from Cloudinary settings

        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dgylk90yt/image/upload", // 👈 replace with your Cloud name
          {
            method: "POST",
            body: data,
          }
        );

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error("Image upload failed");
        imageUrl = uploadData.secure_url; // ✅ Cloudinary URL
      } else if (imagePreview === null) {
        // If user removed image
        imageUrl = "";
      }

      // ✅ Send update request with Cloudinary image URL
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title,
          content,
          image: imageUrl,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update post");

      alert("✅ Blog updated successfully!");
      router.push("/home");
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading blog...
      </div>
    );

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Edit Blog
          </h2>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {!imagePreview && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="block w-full mb-4 text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500"
            />
          )}

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
                onClick={handleRemoveImage}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                Remove Image
              </button>
            </div>
          )}

          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="8"
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>

          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-3 text-white font-medium rounded-lg transition-all ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "Updating..." : "Update Blog"}
          </button>
        </form>
      </div>
    </>
  );
}
