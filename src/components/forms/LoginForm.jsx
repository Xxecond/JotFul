'use client'

import { useState } from 'react'
import { Button, Spinner } from '@/components/ui'
import { useAuth } from '@/context/authContext'

export default function LoginForm() {
  const { sendMagicLink } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email || !email.includes('@')) {
      setError('Valid email needed')
      return
    }

    setLoading(true)
    try {
      // Generate sessionId for cross-device auth
      const sessionId = Math.random().toString(36).substring(7);
      
      // Send magic link with sessionId
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sessionId, action: 'login' }),
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send link')
      
      setMessage('Magic link sent – check your email')
      setEmail('') // clear field
      
      // Redirect to waiting page with sessionId
      setTimeout(() => {
        window.location.href = `/auth/waiting?sessionId=${sessionId}`;
      }, 2000);
    } catch (err) {
      setError('Failed to send link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-9 grid gap-5">
      <div>
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="andrewsampadu9@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="block w-full p-3 mt-1 focus:outline-none ring-1 ring-black dark:ring-white focus:ring-2 rounded-full dark:bg-white/20 bg-black/20"
        />
      </div>

      {error && <p className="text-red-600 text-center font-bold">{error}</p>}
      {message && <p className="text-green-600 text-center font-bold">{message}</p>}

      <Button
        variant="special"
        type="submit"
        disabled={loading}
        className="rounded-full"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            Sending... <Spinner size="sm" />
          </span>
        ) : (
          'Send magic link'
        )}
      </Button>
    </form>
  )
}