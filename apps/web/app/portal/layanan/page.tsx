'use client'

import { useState } from 'react'
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Calendar, MapPin, FileText, Trash2 } from 'lucide-react'
import { useGetLayananWarga } from '@/app/layanan-warga/hooks/useGetLayananWarga'
import { useDeleteLayanan } from '@/app/layanan-warga/hooks/useDeleteLayanan'
import {
  TypeBadge,
  LayananStatusBadge,
} from '@/app/layanan-warga/components/LayananBadges'
import { CreateLayananModal } from './components/CreateLayananModal'
import type { LayananStatus } from '@/lib/api/layanan-warga'

function MyLayananList({ status }: { status?: LayananStatus }) {
  const { data, isLoading, error } = useGetLayananWarga({ status, limit: 50 })
  const deleteMutation = useDeleteLayanan()

  const handleCancel = (id: string) => {
    if (!window.confirm('Batalkan permohonan ini?')) return
    deleteMutation.mutate(id)
  }

  if (isLoading)
    return <p className="text-muted-foreground text-sm">Memuat...</p>
  if (error) return <p className="text-sm text-red-500">Gagal memuat.</p>
  if (!data?.data.length)
    return <p className="text-muted-foreground text-sm">Belum ada permohonan.</p>

  return (
    <div className="grid gap-4">
      {data.data.map((l) => (
        <Card key={l.id}>
          <CardHeader>
            <CardTitle>{l.subject}</CardTitle>
            <CardDescription>
              <div className="flex flex-wrap gap-2 mt-1">
                <TypeBadge type={l.type} />
                <LayananStatusBadge status={l.status} />
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">{l.description}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(l.createdAt).toLocaleString('id-ID', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
              {l.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {l.location}
                </span>
              )}
              {l.purpose && (
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" /> Tujuan: {l.purpose}
                </span>
              )}
            </div>
            {l.adminNotes && (
              <div className="mt-3 rounded-md border-l-2 border-blue-500 bg-blue-50 p-3 text-sm">
                <p className="font-medium text-blue-900">Tanggapan Admin:</p>
                <p className="text-blue-800 mt-1 whitespace-pre-wrap">
                  {l.adminNotes}
                </p>
              </div>
            )}
            {l.status === 'PENDING' && (
              <div className="mt-3 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleCancel(l.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Batalkan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function PortalLayananPage() {
  const [tab, setTab] = useState('all')

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
                <BreadcrumbPage>Layanan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex justify-end">
          <CreateLayananModal />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="PENDING">Menunggu</TabsTrigger>
            <TabsTrigger value="PROSES">Diproses</TabsTrigger>
            <TabsTrigger value="SELESAI">Selesai</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <MyLayananList />
          </TabsContent>
          <TabsContent value="PENDING" className="mt-4">
            <MyLayananList status="PENDING" />
          </TabsContent>
          <TabsContent value="PROSES" className="mt-4">
            <MyLayananList status="PROSES" />
          </TabsContent>
          <TabsContent value="SELESAI" className="mt-4">
            <MyLayananList status="SELESAI" />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
