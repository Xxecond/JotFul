"use client";

import { useState } from "react";

export default function FolderModal({ open, onConfirm, onCancel }) {
  const [name, setName] = useState("");

  if (!open) return null;

  const handleConfirm = () => {
    if (!name.trim()) return;
    onConfirm(name.trim());
    setName("");
  };

  const handleCancel = () => {
    setName("");
    onCancel();
  };

  return (
    <section>
      <div className="fixed bg-black/60 inset-0 z-[100]" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[68%] max-w-sm rounded-xl bg-cyan-700 z-[110] space-y-4">
        <p className="text-white text-center pt-4 font-medium">New Folder</p>
        <div className="px-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
            placeholder="Enter folder name"
            autoFocus
            className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/50 outline-none ring-1 ring-white focus:ring-2"
          />
        </div>
        <div className="flex">
          <button
            onClick={handleConfirm}
            className="text-white p-2 w-1/2 hover:bg-black/20 border-t-2 border-white"
          >
            OK
          </button>
          <button
            onClick={handleCancel}
            className="text-white p-2 w-1/2 hover:bg-black/20 border-l-2 border-t-2 border-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
}
