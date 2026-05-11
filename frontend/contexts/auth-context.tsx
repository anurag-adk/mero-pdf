'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '@/lib/api'

interface User {
  email: string
  user_id: string
  _id: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  

// safe auth check and cleanup
  useEffect(() => {
  const storedUser = localStorage.getItem('user')
  const accessToken = localStorage.getItem('access_token')

  if (!storedUser || !accessToken) {
    setUser(null)
    setIsLoading(false)
    return
  }

  try {
    setUser(JSON.parse(storedUser))
  } catch (err) {
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    setUser(null)
  }

  setIsLoading(false)
}, [])


  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password)
      localStorage.setItem('access_token', response.access_token)
      
      // Store user info (we'll use email as the identifier)
      const userData = { 
        email, 
        user_id: email, // Backend uses email as user_id in most endpoints
        _id: email 
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      throw error
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await api.signup(email, password)
      
      // After signup, automatically login
      await login(email, password)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
