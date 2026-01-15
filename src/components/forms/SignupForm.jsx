import { useState, useEffect } from 'react'
import { useAuth } from '@/context/authContext' 
import { Button, Spinner } from "@/components/ui"
import { useRouter } from 'next/navigation'

export default function SignupForm() {
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
      setError('Enter a valid email')
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
        body: JSON.stringify({ email, sessionId: newSessionId, action: 'signup' }),
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send email')
      
      if (data.isUnverified) {
        setMessage('Verification email resent! Check your inbox.')
      } else {
        setMessage('Verification email sent! Check your inbox.')
      }
      
      setSessionId(newSessionId)
      setPolling(true)
      startCountdown()
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='grid gap-5 mt-9'>
      <div>
        <label className="text-sm md:text-base">Email</label>
        <input
          type="email"
          placeholder="andrewsampadu9@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="block w-full p-3 mt-1 focus:outline-none ring-1 ring-black dark:ring-white focus:ring-2 rounded-full dark:bg-white/20 bg-black/20"
        />
      </div>

      {error && <div className="text-red-600 dark:text-red-500 font-bold text-center">{error}</div>}
      {message && <div className="text-green-600 dark:text-green-500 font-bold text-center">{message}</div>} 

      <Button
        variant="special"
        type="submit"
        className="text-sm md:text-base w-full rounded-xl p-2 cursor-pointer"
        disabled={loading || !canResend}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            Sending link...<Spinner size="sm" />
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