// app/api/auth/forgot-password/route.js
export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    // 🚀 Forward request to your backend API (Django)
    // eslint-disable-next-line no-undef
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) return Response.json(data, { status: res.status });

    return Response.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
