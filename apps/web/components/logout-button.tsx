'use client'

import { LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/provider/auth-provider'
import { useState, useEffect } from 'react'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function LogoutButton() {
  const router = useRouter()
  const { logout, user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  const displayName = mounted
    ? (user?.profile?.fullName ?? user?.email ?? 'Pengguna')
    : 'Pengguna'

  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          onClick={handleLogout}
          tooltip="Logout"
          className="hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-semibold shrink-0">
            {mounted && initials ? initials : <User className="size-4" />}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
            <span className="truncate font-medium">{displayName}</span>
            <span className="truncate text-xs opacity-70" suppressHydrationWarning>
              {mounted ? user?.email : ''}
            </span>
          </div>
          <LogOut className="ml-auto size-4 shrink-0" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
