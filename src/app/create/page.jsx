"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import { createPost } from "@/lib/postService";
import {Spinner, Button} from "@/components/ui";

export default function CreateBlog() {
 const router = useRouter();
 
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
      if (!selectedFile) throw new Error("No image selected");

      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);

      const uploadRes = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.secure_url) throw new Error("Cloudinary upload failed");

      // Create the post using postService.js
      await createPost({
        title,
        content,
        image: uploadData.secure_url,
      });

      router.push("/home");
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }; // <-- close handleSubmit

  return (
      <>
      <div className="bg-white min-h-screen">
      <Header />
      <section className="flex items-center justify-center h-170 bg-white px-10 md:px-5">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-200 shadow-xl rounded-lg p-8 w-full max-w-2xl"
        >
          <h2 className="md:text-xl xl:text-2xl font-bold mb-6 text-center text-black">
            Create New Jot
          </h2>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="text-sm md:text-base md:text-lg w-full p-1 md:p-2 xl:p-3 mb-5 border border-cyan-700 rounded-lg focus:ring-2 focus:ring-cyan-700 outline-none"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="block  mb-4 text-sm xl:text-base text-black border border-cyan-700 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500"
          />

          {imagePreview && (
            <div className="mb-4 text-sm md:text-base md:text-lg text-center">
              <div className="relative w-full h-40 md:55 xl:64 mb-3 text-sm md:text-base md:text-lg">
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
            className="text-sm md:text-base md:text-lg w-full md:p-3 mb-6 border border-cyan-700 rounded-lg focus:ring-2 focus:ring-cyan-700 outline-none"
          ></textarea>

          <Button
            type="submit"
            disabled={loading}
            variant="special"
            className="w-full"
          >
            {loading ? (<span className="flex  items-center justify-center gap-3">Uploading...<Spinner size="small"/></span>) : (<>Add Jot</>)}
          </Button>
        </form>
      </section>
 </div>
    </>
  );
}