"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import { updatePost, getPostById } from "@/lib/postService";
import { Spinner, Button } from "@/components/ui";
import { useSettings } from "@/contexts/SettingsContext";
import { useNotifications } from "@/contexts/NotificationContext";

export default function EditBlog({ params }) {
  const router = useRouter();
  const postId = React.use(params).id;
  const { settings } = useSettings();
  const { addNotification } = useNotifications();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Fetch existing post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPostById(postId);
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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = imagePreview;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const error = await uploadRes.json();
          throw new Error(error.error || "Upload failed");
        }

        const uploadData = await uploadRes.json();
        if (!uploadData.url) throw new Error("Upload failed - no URL returned");

        imageUrl = uploadData.url;
      }

      await updatePost(postId, {
        title,
        content,
        image: imageUrl,
      });

      router.push("/home");
    } catch (err) {
      addNotification(`Error: ${err.message}`, "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <Header />
        <section className="flex items-center justify-center h- bg-white dark:bg-gray-900 py-5 pt-20 ">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-200 dark:bg-gray-800 shadow-xl rounded-lg p-8 w-[90%] max-w-4xl"
          >
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-base w-full px-3 py-1 md:p-2 xl:p-3 mb-5 border border-cyan-700 dark:border-cyan-500 dark:bg-gray-700 dark:text-white rounded-lg outline-none"
            />

            <label
              className="inline-block w-auto max-w-max ring ring-cyan-700 px-2 rounded-lg text-black dark:text-white mb-4 text-sm xl:text-base"
            >
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Drag and Drop Box - only show when no image is selected */}
            {!imagePreview && (
              <div
                className={`w-full h-32 border-2 border-dashed rounded-lg mb-4 flex items-center justify-center cursor-pointer transition-colors ${
                  dragActive 
                    ? 'border-cyan-500 bg-cyan-50' 
                    : 'border-gray-400 bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.querySelector('input[type="file"]').click()}
              >
                <p className="text-gray-600 text-center">
                  {dragActive ? 'Drop image here' : 'Drag image here to upload'}
                </p>
              </div>
            )}
            
            {imagePreview && (
              <div className="mb-4 text-base xl:text-lg text-center">
                <div className="relative w-[95%] max-w-4xl mx-auto h-80 md:h-95 xl:h-120 mb-3 text-sm md:text-base xl:text-lg">
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
              rows="5"
              className="text-base dark:text-white w-full p-3 mb-6 border-2 border-cyan-700 dark:bg-gray-700 rounded-lg outline-none"
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
      </div>
    </>
  );
}