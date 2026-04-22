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
  UserCheck
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
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Rukunin",
      logo: GalleryVerticalEnd,
      plan: "Web RT",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: House,
      isActive: true,
      // items: [
      //   {
      //     title: "History",
      //     url: "#",
      //   },
      //   {
      //     title: "Starred",
      //     url: "#",
      //   },
      //   {
      //     title: "Settings",
      //     url: "#",
      //   },
      // ],
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
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  return (
    <aside>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          {/* <NavProjects projects={data.projects} /> */}
        </SidebarContent>
        <SidebarFooter>
          <LogoutButton />
          {/* <NavUser user={data.user} /> */}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

    </aside>
    
  )
}
