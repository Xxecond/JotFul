import { verifyToken } from "@/lib/authMiddleware";

export async function POST(req) {
  const { valid, userId, message } = verifyToken(req);
  if (!valid) return Response.json({ error: message }, { status: 401 });

  // continue with logic (e.g., create a post for userId)
}
