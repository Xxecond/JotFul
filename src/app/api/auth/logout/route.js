import { NextResponse } from 'next/server'

export async function POST() {
  // Clear the access_token cookie by setting Max-Age=0
  const cookie = 'access_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
  return NextResponse.json({ success: true, message: 'Logged out' }, { headers: { 'Set-Cookie': cookie } })
}
