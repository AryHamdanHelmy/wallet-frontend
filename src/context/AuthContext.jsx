import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../api/wallet'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setLoading(false)
      return
    }

    authApi
      .me()
      .then((res) => setUser(res.data.data))
      .catch((error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            return
        }
        const cached = localStorage.getItem('user')
        if (cached) setUser(JSON.parse(cached))
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await authApi.login(email, password)
    const { token, user } = res.data.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)

    return user
  }

  const register = async (data) => {
    const res = await authApi.register(data)
    const { token, user } = res.data.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)

    return user
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // token mungkin sudah tidak valid di server, tetap bersihkan lokal
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider')
  }

  return context
}