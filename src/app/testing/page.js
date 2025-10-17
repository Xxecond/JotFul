"use client";

import { useState, useRef } from "react";

export default function TestUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");
    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "blog_upload"); // your preset

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dgylk90yt/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();
      console.log("Cloudinary result:", result);

      if (result.secure_url) {
        setUrl(result.secure_url);
        alert("✅ Upload successful!");
      } else {
        alert("❌ Upload failed. Check console for details.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Upload error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Cloudinary Upload Test</h1>

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="mb-4"
      />

      {preview && (
        <div className="mb-4">
          <img src={preview} alt="Preview" className="w-64 h-64 object-cover rounded-lg" />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`px-6 py-2 rounded-lg text-white font-medium ${
          uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {uploading ? "Uploading..." : "Upload to Cloudinary"}
      </button>

      {url && (
        <div className="mt-6">
          <p className="mb-2 font-semibold">Uploaded Image URL:</p>
          <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
            {url}
          </a>
        </div>
      )}
    </div>
  );
}
