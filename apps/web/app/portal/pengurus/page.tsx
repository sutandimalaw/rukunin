'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { useGetPengurus } from '@/app/pengurus/hooks/useGetPengurus'
import { PengurusTreeView } from '@/app/pengurus/components/PengurusTreeView'

export default function PortalPengurusPage() {
  const { data, isLoading, error } = useGetPengurus({ active: true })

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
                <BreadcrumbLink href="/portal">Portal Warga</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Pengurus RT</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div>
          <h1 className="text-xl font-semibold">Struktur Pengurus RT</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Klik tombol WhatsApp untuk menghubungi pengurus terkait.
          </p>
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground">Memuat...</p>
        )}
        {error && (
          <p className="text-sm text-red-500">Gagal memuat: {error.message}</p>
        )}
        {data && <PengurusTreeView data={data} />}
      </div>
    </SidebarInset>
  )
}
