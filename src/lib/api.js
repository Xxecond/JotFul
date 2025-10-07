// src/lib/api.js

export const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://blogger-seven-virid.vercel.app" // your live URL
    : "http://localhost:3000";                  // dev URL

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

// 👇 Add these
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
