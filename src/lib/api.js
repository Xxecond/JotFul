 export const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://blogger-seven-virid.vercel.app" // live URL
    : "http://localhost:3000"; // dev URL

// Core fetch helper
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token"); // ✅ grab token if available

  const res = await fetch(`${baseURL}/api/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

// =======================
// ✅ AUTH HELPERS
// =======================
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

// =======================
// ✅ POSTS HELPERS
// =======================
export async function getUserPosts() {
  return apiFetch("posts/user"); // your backend route for user’s posts
}

export async function createPost(postData) {
  return apiFetch("posts", {
    method: "POST",
    body: JSON.stringify(postData),
  });
}

export async function deletePost(id) {
  return apiFetch(`posts/${id}`, {
    method: "DELETE",
  });
}
