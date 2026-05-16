'use client'

import { useState, useCallback } from 'react'
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
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Plus, FileText } from 'lucide-react'
import { MyLaporanCard } from './components/MyLaporanCard'
import { LaporanDetailModal } from '@/app/laporan-warga/components/LaporanDetailModal'
import { CreateLaporanModal } from '@/app/laporan-warga/components/CreateLaporanModal'
import { useGetMyLaporan } from './hooks/useLaporan'

function MyLaporanList({ status }: { status?: string }) {
  const [detailId, setDetailId] = useState<string | null>(null)
  const { data, isLoading } = useGetMyLaporan({ status, limit: 20 })

  if (isLoading) {
    return <p className="text-center py-8 text-sm text-muted-foreground">Memuat laporan...</p>
  }

  if (!data?.data.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <FileText className="h-10 w-10 text-muted-foreground/40" />
        <p className="font-medium">Belum ada laporan</p>
        <p className="text-sm text-muted-foreground">
          {status ? `Tidak ada laporan dengan status ini` : 'Buat laporan pertama kamu!'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {data.data.map((laporan) => (
          <MyLaporanCard key={laporan.id} laporan={laporan} onDetail={setDetailId} />
        ))}
      </div>

      <LaporanDetailModal
        laporanId={detailId}
        open={!!detailId}
        onOpenChange={(o) => { if (!o) setDetailId(null) }}
        isAdminView={false}
      />
    </>
  )
}

export default function PortalLaporanPage() {
  const [openCreate, setOpenCreate] = useState(false)

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/portal">Portal</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Laporan Saya</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <Button onClick={() => setOpenCreate(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Buat Laporan Baru
          </Button>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="MENUNGGU">Menunggu</TabsTrigger>
            <TabsTrigger value="DIPROSES">Diproses</TabsTrigger>
            <TabsTrigger value="SELESAI">Selesai</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <MyLaporanList />
          </TabsContent>
          <TabsContent value="MENUNGGU">
            <MyLaporanList status="MENUNGGU" />
          </TabsContent>
          <TabsContent value="DIPROSES">
            <MyLaporanList status="DIPROSES" />
          </TabsContent>
          <TabsContent value="SELESAI">
            <MyLaporanList status="SELESAI" />
          </TabsContent>
        </Tabs>
      </div>

      <CreateLaporanModal open={openCreate} onOpenChange={setOpenCreate} />
    </SidebarInset>
  )
}
