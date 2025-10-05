"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPostById, updatePost } from "@/lib/postService"; // adjust path as needed
import Image from "next/image";

export default function EditBlog() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      const data = await getPostById(id);
      if (!data?.error) {
        setTitle(data.title || "");
        setContent(data.body || "");
        if (data.image) setImage(data.image);
      } else {
        alert(data.error);
        router.push("/home");
      }
      setLoading(false);
    };
    fetchBlog();
  }, [id, router]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updatePost(id, { title, body: content, image });
    if (!result?.error) router.push("/home");
    else alert(result.error);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading blog...
      </div>
    );

  return (
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

        {!image ? (
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full mb-4 text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500"
          />
        ) : (
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
          placeholder="Content"
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
          Update Blog
        </button>
      </form>
    </div>
  );
}
