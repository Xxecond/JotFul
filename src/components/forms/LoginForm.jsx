'use client'

import { useState, useEffect } from 'react'
import { Button, Spinner } from '@/components/ui'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const { sendMagicLink } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [canResend, setCanResend] = useState(true)
  const [countdown, setCountdown] = useState(0)
  const [sessionId, setSessionId] = useState(null)
  const [polling, setPolling] = useState(false)

  useEffect(() => {
    if (!sessionId || !polling) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/auth/check-session?sessionId=${sessionId}`)
        const data = await res.json()
        
        if (data.authenticated) {
          clearInterval(interval)
          setPolling(false)
          router.push('/home')
        } else if (data.denied) {
          clearInterval(interval)
          setPolling(false)
          setError('Login request was denied')
          setSessionId(null)
        }
      } catch (err) {
        console.error('Polling error:', err)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [sessionId, polling, router])

  const startCountdown = () => {
    setCanResend(false)
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email || !email.includes('@')) {
      setError('Valid email needed')
      return
    }

    if (!canResend) {
      setError(`Please wait ${countdown}s before resending`)
      return
    }

    setLoading(true)
    try {
      const newSessionId = Math.random().toString(36).substring(7)
      
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sessionId: newSessionId, action: 'login' }),
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send email')
      
      setMessage('Login link sent! Check your email.')
      setSessionId(newSessionId)
      setPolling(true)
      startCountdown()
    } catch (err) {
      setError(err.message || 'Failed to send email')
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

      {error && <p className="text-red-600 dark:text-red-500 text-center font-bold">{error}</p>}
      {message && <p className="text-green-600 dark:text-green-500 text-center font-bold">{message}</p>}

      <Button
        variant="special"
        type="submit"
        disabled={loading || !canResend}
        className="rounded-full"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            Sending... <Spinner size="sm" />
          </span>
        ) : !canResend ? (
          `Resend in ${countdown}s`
        ) : (
          'Send Email'
        )}
      </Button>
    </form>
  )
}