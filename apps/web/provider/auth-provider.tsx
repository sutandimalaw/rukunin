"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import { usePathname, useRouter } from 'next/navigation'
import { authApi, type AuthUser } from "@/lib/api/auth"
import { setAccessToken } from "@/lib/api/client"

type AuthContextType = {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  refreshUser: () => Promise<AuthUser | null>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const restore = async () => {
      try {
        const result = await authApi.refresh()
        setAccessToken(result.accessToken)
        const me = await authApi.me()
        setUser(me)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    restore()
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const result = await authApi.login(email, password)
    setAccessToken(result.accessToken)
    setUser(result.user)
    return result.user
  }, [])

  const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const me = await authApi.me()
      setUser(me)
      return me
    } catch {
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    if (isLoading) return
    if (!user) return
    if (user.role !== 'WARGA') return
    if (user.isProfileComplete) return

    const isAuthRoute = pathname.startsWith('/auth') || pathname === '/login'
    const isProfileRoute = pathname.startsWith('/account/profile')

    if (!isAuthRoute && !isProfileRoute) {
      router.replace('/account/profile')
    }
  }, [isLoading, pathname, router, user])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      setAccessToken(null)
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return ctx
}
