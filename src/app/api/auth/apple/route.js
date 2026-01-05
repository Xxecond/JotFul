import { NextResponse } from "next/server";

const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID;
const APPLE_REDIRECT_URI = process.env.APPLE_REDIRECT_URI;

export async function GET() {
  const params = new URLSearchParams({
    client_id: APPLE_CLIENT_ID,
    redirect_uri: APPLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'name email',
    response_mode: 'form_post'
  });

  const authUrl = `https://appleid.apple.com/auth/authorize?${params}`;
  return NextResponse.redirect(authUrl);
}