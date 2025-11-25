 'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => null,
  signup: async () => null,
  logout: () => {},
  isLoggedIn: false,
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Persist user + token based on rememberMe
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

  // Load user from localStorage or sessionStorage on app init
  useEffect(() => {
    const storedUser =
      localStorage.getItem('user') || sessionStorage.getItem('user')
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')

    if (storedUser && token && storedUser !== 'undefined' && storedUser !== '') {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('token')
      }
    }

    setLoading(false)
  }, [])

  // Login function
  const login = async (email, password) => { // removed rememberMe for simplicity
  setLoading(true)
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()

    if (!res.ok) throw new Error(data.error || 'Login failed')

    // Always store user and token in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    return data.user
  } finally {
    setLoading(false)
  }
}

  // Signup function
  const signup = async ( email, password, rememberMe = true) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Signup failed')

      persistUser(data.user, data.token, rememberMe)
      return data.user
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, isLoggedIn: !!user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export default AuthContext
