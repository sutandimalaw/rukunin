'use client'

import { LogoutButton } from '@/components/logout-button'
import { useAuth } from '@/provider/auth-provider'

export default function ProtectedPage() {
  const { user } = useAuth()

  return (
    <div className="flex h-svh w-full items-center justify-center gap-2">
      <p>
        Hello <span>{user?.email}</span>
      </p>
      <LogoutButton />
    </div>
  )
}
