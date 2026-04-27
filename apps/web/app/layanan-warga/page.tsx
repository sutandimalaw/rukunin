'use client'

import { useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Calendar, MapPin, FileText, Pencil } from 'lucide-react'
import { useGetLayananWarga } from './hooks/useGetLayananWarga'
import { UpdateStatusModal } from './components/UpdateStatusModal'
import { TypeBadge, LayananStatusBadge } from './components/LayananBadges'
import type { LayananStatus, LayananWarga } from '@/lib/api/layanan-warga'

function LayananList({
  status,
  onEdit,
}: {
  status?: LayananStatus
  onEdit: (l: LayananWarga) => void
}) {
  const { data, isLoading, error } = useGetLayananWarga({ status, limit: 50 })

  if (isLoading)
    return <p className="text-muted-foreground text-sm">Memuat...</p>
  if (error) return <p className="text-sm text-red-500">Gagal memuat.</p>
  if (!data?.data.length)
    return <p className="text-muted-foreground text-sm">Belum ada layanan.</p>

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
            <CardAction>
              {(l.status === 'PENDING' || l.status === 'PROSES') && (
                <Button variant="outline" size="sm" onClick={() => onEdit(l)}>
                  <Pencil className="w-4 h-4 mr-1" /> Update
                </Button>
              )}
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">{l.description}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>
                Dari:{' '}
                <strong>
                  {l.requester.profile?.fullName ?? l.requester.email}
                </strong>
              </span>
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
                <p className="font-medium text-blue-900">Catatan Admin:</p>
                <p className="text-blue-800 mt-1 whitespace-pre-wrap">
                  {l.adminNotes}
                </p>
              </div>
            )}
          </CardContent>
          {l.processedAt && (
            <CardFooter className="text-xs text-muted-foreground">
              Diproses oleh{' '}
              {l.processor?.profile?.fullName ?? l.processor?.email ?? 'admin'}{' '}
              pada{' '}
              {new Date(l.processedAt).toLocaleString('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}

export default function LayananWargaAdminPage() {
  const [tab, setTab] = useState('PENDING')
  const [editing, setEditing] = useState<LayananWarga | null>(null)

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
              <BreadcrumbItem>
                <BreadcrumbPage>Layanan Warga</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="PENDING">Menunggu</TabsTrigger>
            <TabsTrigger value="PROSES">Diproses</TabsTrigger>
            <TabsTrigger value="SELESAI">Selesai</TabsTrigger>
            <TabsTrigger value="DITOLAK">Ditolak</TabsTrigger>
          </TabsList>
          <TabsContent value="PENDING" className="mt-4">
            <LayananList status="PENDING" onEdit={setEditing} />
          </TabsContent>
          <TabsContent value="PROSES" className="mt-4">
            <LayananList status="PROSES" onEdit={setEditing} />
          </TabsContent>
          <TabsContent value="SELESAI" className="mt-4">
            <LayananList status="SELESAI" onEdit={setEditing} />
          </TabsContent>
          <TabsContent value="DITOLAK" className="mt-4">
            <LayananList status="DITOLAK" onEdit={setEditing} />
          </TabsContent>
        </Tabs>
      </div>

      {editing && (
        <UpdateStatusModal
          layanan={editing}
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
        />
      )}
    </SidebarInset>
  )
}
