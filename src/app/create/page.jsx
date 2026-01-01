"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import { createPost } from "@/lib/postService";
import {Spinner, Button} from "@/components/ui";
import { useSettings } from "@/contexts/SettingsContext";
import { useNotifications } from "@/contexts/NotificationContext";

export default function CreateBlog() {
 const router = useRouter();
 const { settings } = useSettings();
 const { addNotification } = useNotifications();
 
 // Removed the authentication check and redirect
 // const {user, loading:authLoading } =useAuth();
 // useEffect(()=>{
 //     if (authLoading) return; // wait for auth check
 //     if (!user){ 
 //       router.push("/auth/login");}
 //     }, [authLoading, user, router])

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  // Auto-save functionality
  useEffect(() => {
    if (settings.autoSave && (title || content)) {
      const timer = setTimeout(() => {
        localStorage.setItem('draft', JSON.stringify({ title, content }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [title, content, settings.autoSave]);

  // Load draft on mount
  useEffect(() => {
    if (settings.autoSave) {
      const draft = localStorage.getItem('draft');
      if (draft) {
        const { title: draftTitle, content: draftContent } = JSON.parse(draft);
        if (draftTitle) setTitle(draftTitle);
        if (draftContent) setContent(draftContent);
      }
    }
  }, [settings.autoSave]);

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
      if (!selectedFile) throw new Error("No image selected");

      // Upload image via your auth-protected API
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

      // Create the post using postService.js
      await createPost({
        title,
        content,
        image: uploadData.url,
      });

      // Clear draft after successful post
      if (settings.autoSave) {
        localStorage.removeItem('draft');
      }

      router.push("/home");
      addNotification("Post created successfully!", "success");
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
            className="text-base  w-full px-3 py-1 md:p-2 xl:p-3 mb-5 border border-cyan-700 dark:border-cyan-500 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-700 outline-none"
          />

          <label
          className="inline-block w-auto max-w-max ring ring-cyan-700 px-2  rounded-lg text-black mb-4 text-sm xl:text-base"
          >Choose Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="hidden"
          /></label>

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
                variant ="destructive"
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
            className="text-base w-full p-3 mb-6 border border-cyan-700 rounded-lg focus:ring-2 focus:ring-cyan-700 outline-none"
          ></textarea> 

          <Button
            type="submit"
            disabled={loading}
            variant="special"
            className="w-full"
          >
            {loading ? (<span className="flex  items-center justify-center gap-3">Uploading...<Spinner size="sm"/></span>) : (<>Add Jot</>)}
          </Button>
        </form>
      </section>
 </div>
    </>
  );
}