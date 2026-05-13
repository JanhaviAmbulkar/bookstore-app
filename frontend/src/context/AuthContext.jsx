import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // On mount, restore user from token
  useEffect(() => {
    const restore = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe()
          // FIX: Backend successResponse spreads data at top level:
          // { success, message, user }  — NOT nested under res.data.data
          const user = res.data?.user
          if (user) setUser(user)
          else throw new Error('No user in response')
        } catch {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setToken(null)
        }
      }
      setLoading(false)
    }
    restore()
  }, []) // eslint-disable-line

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password })
    // FIX: Backend returns { success, message, token, user } at res.data top level
    const { token, user } = res.data
    localStorage.setItem('token', token)
    setToken(token)
    setUser(user)
    return user
  }, [])

  const register = useCallback(async (formData) => {
    const res = await authAPI.register(formData)
    const { token, user } = res.data
    localStorage.setItem('token', token)
    setToken(token)
    setUser(user)
    return user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  const updateUser = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }))
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
