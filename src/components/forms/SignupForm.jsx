import { useState } from 'react'
import { useAuth } from '@/context/authContext' 
import { Button, Spinner } from "@/components/ui"

export default function SignupForm() {
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
      setError('Enter a valid email')
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
        body: JSON.stringify({ email, sessionId, action: 'signup' }),
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send link')
      
      setMessage('Magic link sent! Check your email (and spam folder).')
      setEmail('') // clear field
      
      // Redirect to waiting page with sessionId
      setTimeout(() => {
        window.location.href = `/auth/waiting?sessionId=${sessionId}`;
      }, 2000);
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
          placeholder="andrews@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="focus:border-3 focus:border-black block w-full text-base border border-black rounded-xl p-2 bg-black/10"
        />
      </div>

      {error && <div className="text-red-600 font-bold text-center">{error}</div>}
      {message && <div className="text-green-600 font-bold text-center">{message}</div>}

      <Button
        variant="special"
        type="submit"
        className="text-sm md:text-base w-full rounded-xl p-2 cursor-pointer"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            Sending link...<Spinner size="sm" />
          </span>
        ) : (
          'Send magic link'
        )}
      </Button>
    </form>
  )
}