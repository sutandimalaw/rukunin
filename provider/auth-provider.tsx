// providers/auth-provider.tsx
"use client"

import { createContext, useContext } from "react"
import type { User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  user,
  children,
}: {
  user: User | null
  children: React.ReactNode
}) {
  return (
    <AuthContext.Provider value={{ user }}>
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