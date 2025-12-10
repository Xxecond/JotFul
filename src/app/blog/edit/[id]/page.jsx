"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import { updatePost, getPostById } from "@/lib/postService"; // your post service functions
import { Spinner, Button } from "@/components/ui";

export default function EditBlog({ params }) {
  const router = useRouter();
  // `params` may be a Promise in this Next.js version; unwrap with React.use()
  const postId = React.use(params).id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing post
  useEffect(() => {
    // Removed protected-route check; always fetch the post
    const fetchPost = async () => {
      try {
        const post = await getPostById(postId); // fetch from your backend
        setTitle(post.title);
        setContent(post.content);
        setImagePreview(post.image || null);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
  }, [postId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = imagePreview; // keep existing if no new file

      if (selectedFile) {
        // Upload new image to Cloudinary
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);

        const uploadRes = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadData.secure_url) throw new Error("Cloudinary upload failed");

        imageUrl = uploadData.secure_url;
      }

      await updatePost(postId, {
        title,
        content,
        image: imageUrl,
      });

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
      <section className="flex items-center justify-center h-auto bg-white px-10 md:px-5 py-5">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-200 shadow-xl rounded-lg p-8 w-full max-w-2xl"
        >
          <h2 className="md:text-xl xl:text-2xl font-bold mb-6 text-center text-black">
            Edit Jot
          </h2>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="text-sm md:text-base xl:text-lg w-full p-2 mb-5 border border-cyan-700 rounded-lg focus:ring-2 focus:ring-cyan-700 outline-none"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-auto p-1 mb-4 text-sm xl:text-base text-black ring-1 ring-cyan-700 inline-block rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500"
          />

          {imagePreview && (
            <div className="mb-4 text-center">
              <div className="relative w-full h-40 md:h-55 xl:h-64 mb-3">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                className="bg-red-700"
                onClick={() => {
                  setImagePreview(null);
                  setSelectedFile(null);
                }}
              >
                Remove Image
              </Button>
            </div>
          )}

          <textarea
            placeholder="Write your content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="8"
            className="text-sm md:text-base w-full p-3 mb-6 border border-cyan-700 rounded-lg focus:ring-2 focus:ring-cyan-700 outline-none"
          ></textarea>

          <Button type="submit" disabled={loading} variant="special" className="w-full">
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                Updating... <Spinner size="sm" />
              </span>
            ) : (
              <>Update Jot</>
            )}
          </Button>
        </form>
      </section>
    </>
  );
}
