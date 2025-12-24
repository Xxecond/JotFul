'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({
  user: null,
  loading: true,
  sendMagicLink: async () => {},
  logout: () => {},
  isLoggedIn: false,
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')

    if (storedUser && token && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        // Bad data – clear it
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  // Send magic link (signup or login – same thing)
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

  // Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    // Optional: call backend logout if you have one
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        sendMagicLink,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)