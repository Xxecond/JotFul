 'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({
  user: null,
  loading: true,
  sendMagicLink: async () => {},
  handleMagicCallback: async () => {},
  logout: () => {},
  isLoggedIn: false,
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const persistUser = (userData, token, rememberMe = true) => {
    if (!userData || !token) return
    setUser(userData)
    if (rememberMe) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
    } else {
      sessionStorage.setItem('token', token)
      sessionStorage.setItem('user', JSON.stringify(userData))
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (storedUser && token && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.clear()
        sessionStorage.clear()
      }
    }
    setLoading(false)
  }, [])

  // New: Send magic link
  const sendMagicLink = async (email) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send link')
      return data
    } finally {
      setLoading(false)
    }
  }

  // New: Handle magic link click (call this from a callback page)
  const handleMagicCallback = async (token) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/magic-callback?token=' + token)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Invalid link')
      persistUser(data.user, data.token, true)  // remember by default
      return data.user
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        sendMagicLink,
        handleMagicCallback,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)