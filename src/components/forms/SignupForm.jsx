'use client'

import  { useState } from 'react'
import useAuth from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { Button, Spinner } from "@/components/ui" 

export default function SignupForm() {
  const { signup } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
      const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) return setError('Email is not valid.')


    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await signup( email, password)
      router.push('/auth/verify-email')
    } catch (err) {
      setError(err.message)
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
      className="focus:border-3 focus:border-black block w-full text-sm md:text-base border border-black rounded-xl p-2 bg-black/10"
      />
</div>
      <div>
       <label className="text-sm md:text-base">Password</label>
        <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="focus:border-3 focus:border-black block w-full text-sm md:text-base border border-black rounded-xl p-2 bg-black/10"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
        >
          {show ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
        </button>
      </div>
      </div>

      <div>
        <label className="text-sm md:text-base">Confirm Password</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          label="Confirm Password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="inline-block focus:border-3 focus:border-black block w-full text-sm md:text-base border border-black rounded-xl p-2 bg-black/10"
        />
        
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
        >
          {show ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
        </button>
        </div>
      </div>

  <div className=" flex text-red-900 font-semi-bold items-center justify-center h-12">
      {error && <div className="text-red-600 font-bold">{error}</div>}
</div>

      <Button
        variant="special"
        type="submit"
        className="text-sm md:text-base  w-full rounded-xl p-2 cursor-pointer"
        disabled={loading}
      >
   {loading ? (<span className="flex  items-center justify-center gap-3">
    Creating account...<Spinner size="sm" /></span>) :(<>Sign up</>)}
      </Button>
    </form>
  )
}
