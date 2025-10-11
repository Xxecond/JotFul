 // src/lib/api.js

export const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://blogger-seven-virid.vercel.app"
    : "http://localhost:3000";

export async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${baseURL}/api/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Request failed");
  }

  return res.json();
}

// ✅ AUTH FUNCTIONS
export async function loginUser(email, password) {
  return apiFetch("auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signupUser(email, password) {
  return apiFetch("auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ✅ BLOG POST FUNCTIONS
export async function getUserPosts() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized");

  return apiFetch("posts", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createPost({ title, content, image }) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized");

  return apiFetch("posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content, image }),
  });
}

export async function deletePost(id) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized");

  return apiFetch(`posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
