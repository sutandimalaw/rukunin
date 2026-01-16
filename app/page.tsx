import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import DataTable from "./residents/components/data-tabel"
import StatCard from "../components/molecules/stat-card"
import { Users } from "lucide-react"

export default async function Page() { 
  return ( 
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Warga RT 4</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {/*  skeleton*/}
          {/* <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" /> */}
          <StatCard
            title="Total Warga"
            value="142"
            subtitle="35 Kepala Keluarga"
            // icon={Users}
          />
          <StatCard
            title="Kas RT/RW"
            value={45}
            subtitle="Saldo tersedia"
          />
          <StatCard
            title="Laporan Aktif"
            value={8}
            subtitle="Menunggu Tindak Lanjut"
          />
          <StatCard
            title="Keamanan"
            value={2}
            subtitle="Petugas Bertugas"
          />
          <StatCard
            title="Booking Fasilitas"
            value={5}
            subtitle="Reservasi Hari ini"
          />
          <StatCard
            title="Pengumuman"
            value={3}
            subtitle="Aktif Bulan ini"
          />
        </div>
        {/* <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
        <DataTable  />
      </div>
    </SidebarInset>
  )
}
