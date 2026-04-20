'use client'

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
import DataTable from "./components/DataTabel"
import StatCard from "@/components/shared/StatCard"
import { useGetResidentSummary } from "./hooks/useGetResidents"

const Page = () => {
  const { data: summary } = useGetResidentSummary()

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
                  Kependudukan
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Warga</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <StatCard
            title="Total Jiwa"
            value={summary?.totalJiwa ?? '-'}
            subtitle="Warga terdaftar"
          />
          <StatCard
            title="Total KK"
            value={summary?.totalKK ?? '-'}
            subtitle="Kartu Keluarga"
          />
          <StatCard
            title="Laki-Laki"
            value={summary?.totalLakiLaki ?? '-'}
            subtitle="Jiwa"
          />
          <StatCard
            title="Perempuan"
            value={summary?.totalPerempuan ?? '-'}
            subtitle="Jiwa"
          />
          <StatCard
            title="Balita"
            value={summary?.totalBalita ?? '-'}
            subtitle="Usia di bawah 5 tahun"
          />
          <StatCard
            title="Lansia"
            value={summary?.totalLansia ?? '-'}
            subtitle="Usia 60 tahun ke atas"
          />
        </div>
        <DataTable />
      </div>
    </SidebarInset>
  )
}

export default Page
