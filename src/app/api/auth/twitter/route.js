import { NextResponse } from "next/server";

const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const TWITTER_REDIRECT_URI = process.env.TWITTER_REDIRECT_URI;

export async function GET() {
  const params = new URLSearchParams({
    client_id: TWITTER_CLIENT_ID,
    redirect_uri: TWITTER_REDIRECT_URI,
    response_type: 'code',
    scope: 'tweet.read users.read',
    state: 'state',
    code_challenge: 'challenge',
    code_challenge_method: 'plain'
  });

  const authUrl = `https://twitter.com/i/oauth2/authorize?${params}`;
  return NextResponse.redirect(authUrl);
}