"use client"

import * as React from "react"
import { useAuth } from "@/provider/auth-provider"
import {
  Users,
  GalleryVerticalEnd,
  CircleDollarSign,
  Bell,
  FileTextIcon,
  House,
  UserCheck,
  CalendarHeart,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LogoutButton } from "./logout-button"

// This is sample data.
const data = {
  teams: [
    {
      name: "Rukunin",
      logo: GalleryVerticalEnd,
      plan: "Web RT",
    },
  ],
  navMainAdmin: [
    {
      title: "Dashboard",
      url: "/",
      icon: House,
      isActive: true,
    },
    {
      title: "Kependudukan",
      url: "#",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "Data Warga",
          url: "/residents",
        },
        {
          title: "Kartu Keluarga",
          url: "/kartu-keluarga",
        },
      ],
    },
    {
      title: "Keuangan",
      url: "#",
      icon: CircleDollarSign,
      isActive: true,
      items: [
        { title: "Kas RT", url: "/finance" },
        { title: "Iuran Warga", url: "/iuran-warga" },
      ],
    },
    {
      title: "Pengumuman",
      url: "/announcements",
      icon: Bell,
    },
    {
      title: "Kegiatan Warga",
      url: "/kegiatan-warga",
      icon: CalendarHeart,
    },
    {
      title: "Laporan",
      url: "/report",
      icon: FileTextIcon,
    },
    {
      title: "Kelola Pengguna",
      url: "/kelola-pengguna",
      icon: UserCheck,
    },
  ],
  navMainWarga: [
    {
      title: "Portal",
      url: "/portal",
      icon: House,
      isActive: true,
    },
    {
      title: "Pengumuman",
      url: "/portal/pengumuman",
      icon: Bell,
    },
    {
      title: "Kegiatan",
      url: "/portal/kegiatan",
      icon: CalendarHeart,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const navItems = user?.role === 'WARGA' ? data.navMainWarga : data.navMainAdmin

  return (
    <aside>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navItems} />
        </SidebarContent>
        <SidebarFooter>
          <LogoutButton />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </aside>
  )
}
