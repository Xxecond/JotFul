// src/lib/api.js
export const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://blogger-seven-virid.vercel.app" // ✅ your live Vercel URL
    : "http://localhost:3000";                  // local dev URL

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
