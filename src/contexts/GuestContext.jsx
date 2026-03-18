"use client";

import { createContext, useContext, useState, useEffect } from "react";

const GuestContext = createContext();

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (!context) throw new Error("useGuest must be used within GuestProvider");
  return context;
};

export const GuestProvider = ({ children }) => {
  const [isGuest, setIsGuest] = useState(false);
  const [guestPosts, setGuestPosts] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const guest = sessionStorage.getItem("jotful-guest");
    const posts = sessionStorage.getItem("jotful-guest-posts");
    if (guest === "true") setIsGuest(true);
    if (posts) setGuestPosts(JSON.parse(posts));
    setHydrated(true);
  }, []);

  const enterGuestMode = () => {
    sessionStorage.setItem("jotful-guest", "true");
    setIsGuest(true);
  };

  const exitGuestMode = () => {
    sessionStorage.removeItem("jotful-guest");
    sessionStorage.removeItem("jotful-guest-posts");
    setIsGuest(false);
    setGuestPosts([]);
  };

  const addGuestPost = (post) => {
    const newPost = { ...post, _id: `guest-${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [newPost, ...guestPosts];
    setGuestPosts(updated);
    sessionStorage.setItem("jotful-guest-posts", JSON.stringify(updated));
    return newPost;
  };

  const updateGuestPost = (id, data) => {
    const updated = guestPosts.map(p => p._id === id ? { ...p, ...data } : p);
    setGuestPosts(updated);
    sessionStorage.setItem("jotful-guest-posts", JSON.stringify(updated));
  };

  const deleteGuestPost = (id) => {
    const updated = guestPosts.filter(p => p._id !== id);
    setGuestPosts(updated);
    sessionStorage.setItem("jotful-guest-posts", JSON.stringify(updated));
  };

  const getGuestPost = (id) => guestPosts.find(p => p._id === id);

  return (
    <GuestContext.Provider value={{ isGuest, guestPosts, hydrated, enterGuestMode, exitGuestMode, addGuestPost, updateGuestPost, deleteGuestPost, getGuestPost }}>
      {children}
    </GuestContext.Provider>
  );
};
