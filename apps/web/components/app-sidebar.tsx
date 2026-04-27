"use client"

import * as React from "react"
import { useAuth } from "@/provider/auth-provider"
import {
  Users,
  Building2,
  CircleDollarSign,
  Bell,
  FileTextIcon,
  House,
  CalendarHeart,
  ClipboardList,
  Store,
  Warehouse,
  Award,
  Shield,
  MessageSquare,
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
      logo: Building2,
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
      title: "Layanan Warga",
      url: "#",
      icon: ClipboardList,
      items: [
        { title: "Layanan Surat", url: "/layanan-warga" },
        { title: "Polling Warga", url: "/polling" },
        { title: "Kontak Darurat", url: "/kontak-darurat" },
      ],
    },
    {
      title: "Inventaris RT",
      url: "/inventaris",
      icon: Warehouse,
    },
    {
      title: "Keamanan",
      url: "/keamanan",
      icon: Shield,
    },
    {
      title: "Direktori Warga & UMKM",
      url: "#",
      icon: Store,
      items: [
        { title: "UMKM Warga", url: "/umkm-warga" },
        { title: "Penyedia Jasa", url: "/penyedia-jasa" },
      ],
    },
    {
      title: "Saran & Masukan",
      url: "/saran-masukan",
      icon: MessageSquare,
    },
    {
      title: "Organisasi",
      url: "#",
      icon: Award,
      items: [
        { title: "Pengurus RT", url: "/pengurus" },
        { title: "Kelola Pengguna", url: "/kelola-pengguna" },
      ],
    },
    {
      title: "Laporan",
      url: "/report",
      icon: FileTextIcon,
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
    {
      title: "Layanan",
      url: "#",
      icon: ClipboardList,
      items: [
        { title: "Layanan Surat", url: "/portal/layanan" },
        { title: "Polling", url: "/portal/polling" },
        { title: "Kontak Darurat", url: "/portal/kontak-darurat" },
      ],
    },
    {
      title: "Inventaris RT",
      url: "/portal/inventaris",
      icon: Warehouse,
    },
    {
      title: "Keamanan",
      url: "/portal/keamanan",
      icon: Shield,
    },
    {
      title: "Direktori Warga & UMKM",
      url: "#",
      icon: Store,
      items: [
        { title: "Katalog UMKM", url: "/portal/umkm" },
        { title: "Kelola Usaha Saya", url: "/portal/umkm/kelola" },
        { title: "Penyedia Jasa", url: "/portal/penyedia-jasa" },
        { title: "Rekomendasi Saya", url: "/portal/penyedia-jasa/saya" },
      ],
    },
    {
      title: "Saran & Masukan",
      url: "/portal/saran-masukan",
      icon: MessageSquare,
    },
    {
      title: "Pengurus RT",
      url: "/portal/pengurus",
      icon: Award,
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
