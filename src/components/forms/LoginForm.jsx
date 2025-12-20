 'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { Button, Spinner } from '@/components/ui'
import { useAuth } from '@/hooks'
import Link from 'next/link'

export default function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [show, setShow] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) return setError('Email is not valid.')

    setLoading(true)
    try {
      await login(email, password, rememberMe)
      // If a `redirect` query param exists (e.g. /login?redirect=/home), honor it
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect') || '/home'
      router.push(redirect) // navigate after user is properly set
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-9 grid gap-5">
      <div>
        <label>Email</label>
        <input
          type="email"
           placeholder="andrewsampadu9@gmail.com"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full p-2 focus:outline-none ring-1 ring-black focus:ring-2 rounded-full"
        />
      </div>

      <div>
        <label>Password</label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={password}
            placeholder="••••••••"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full p-2 focus:outline-none ring-1 focus:ring-2 ring-black rounded-full"
          />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2">
            {show ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
        Remember me
      </label>

      <div className=" flex items-center justify-center h-15">
        {error && <div className="text-red-600 font-bold">{error}</div>}
      </div>
      <Button variant="special" type="submit" disabled={loading} className="rounded-full">
        {loading ? <span className="flex items-center gap-2">Signing in... <Spinner size="sm" /></span> : 'Sign in'}
      </Button>

      <div className="text-center">
        <Link href="/auth/forgot-password" className="text-cyan-700 font-semibold text-sm">Forgot password?</Link>
      </div>
    </form>
  )
}
