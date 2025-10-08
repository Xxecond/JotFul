 const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://blogger-seven-virid.vercel.app";

// Helper: get token from localStorage
function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token"); // or "authToken" — use your actual key name
  }
  return null;
}

// ✅ Create a new post
export async function createPost(postData) {
  const token = getAuthToken();
  try {
    const res = await fetch(`${API_BASE_URL}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(postData),
    });

    if (!res.ok) throw new Error(`Failed to create post: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Create post error:", error);
    throw error;
  }
}

// ✅ Get all posts for a user
export async function getUserPosts(userId) {
  const token = getAuthToken();
  try {
    const res = await fetch(`${API_BASE_URL}/api/posts?userId=${userId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Fetch posts error:", error);
    throw error;
  }
}

// ✅ Get a single post by ID
export async function getPostById(id) {
  const token = getAuthToken();
  try {
    const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Fetch single post error:", error);
    throw error;
  }
}

// ✅ Update a post
export async function updatePost(id, postData) {
  const token = getAuthToken();
  try {
    const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(postData),
    });
    if (!res.ok) throw new Error(`Failed to update post: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Update post error:", error);
    throw error;
  }
}

// ✅ Delete a post
export async function deletePost(id) {
  const token = getAuthToken();
  try {
    const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    if (!res.ok) throw new Error(`Failed to delete post: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Delete post error:", error);
    throw error;
  }
}
