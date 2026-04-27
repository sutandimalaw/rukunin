'use client'

import { useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin, Phone, Package, ClipboardCheck } from 'lucide-react'
import { useGetUmkmList } from './hooks/useGetUmkmList'
import { useDeleteUmkm } from './hooks/useDeleteUmkm'
import { ApproveUsahaModal } from './components/ApproveUsahaModal'
import { CategoryBadge, UsahaStatusBadge } from './components/UmkmBadges'
import type { UmkmStatus, UmkmUsaha } from '@/lib/api/umkm'

function UsahaList({
  status,
  onReview,
}: {
  status?: UmkmStatus
  onReview: (u: UmkmUsaha) => void
}) {
  const { data, isLoading, error } = useGetUmkmList({ status, limit: 50 })
  const deleteMutation = useDeleteUmkm()

  const handleDelete = (id: string) => {
    if (!window.confirm('Hapus usaha ini?')) return
    deleteMutation.mutate(id)
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Memuat...</p>
  if (error) return <p className="text-sm text-red-500">Gagal memuat.</p>
  if (!data?.data.length)
    return <p className="text-sm text-muted-foreground">Belum ada usaha.</p>

  return (
    <div className="grid gap-4">
      {data.data.map((u) => (
        <Card key={u.id}>
          <CardHeader>
            <CardTitle>{u.name}</CardTitle>
            <CardDescription>
              <div className="flex flex-wrap gap-2 mt-1">
                <CategoryBadge category={u.category} />
                <UsahaStatusBadge status={u.status} />
              </div>
            </CardDescription>
            <CardAction className="flex gap-2">
              {(u.status === 'PENDING' || u.status === 'ACTIVE') && (
                <Button variant="outline" size="sm" onClick={() => onReview(u)}>
                  <ClipboardCheck className="w-4 h-4 mr-1" /> Review
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => handleDelete(u.id)}
                disabled={deleteMutation.isPending}
              >
                Hapus
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">{u.description}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>
                Oleh:{' '}
                <strong>{u.owner.profile?.fullName ?? u.owner.email}</strong>
              </span>
              {u.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {u.address}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" /> {u.whatsapp}
              </span>
              <span className="flex items-center gap-1">
                <Package className="w-4 h-4" /> {u._count?.products ?? 0} produk/jasa
              </span>
            </div>
            {u.adminNotes && (
              <div className="mt-3 rounded-md border-l-2 border-blue-400 bg-blue-50 p-3 text-sm">
                <p className="font-medium text-blue-900">Catatan Admin:</p>
                <p className="text-blue-800 mt-1">{u.adminNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function UmkmAdminPage() {
  const [tab, setTab] = useState('PENDING')
  const [reviewing, setReviewing] = useState<UmkmUsaha | null>(null)

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>UMKM Warga</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="PENDING">Menunggu Review</TabsTrigger>
            <TabsTrigger value="ACTIVE">Aktif</TabsTrigger>
            <TabsTrigger value="REJECTED">Ditolak</TabsTrigger>
          </TabsList>
          <TabsContent value="PENDING" className="mt-4">
            <UsahaList status="PENDING" onReview={setReviewing} />
          </TabsContent>
          <TabsContent value="ACTIVE" className="mt-4">
            <UsahaList status="ACTIVE" onReview={setReviewing} />
          </TabsContent>
          <TabsContent value="REJECTED" className="mt-4">
            <UsahaList status="REJECTED" onReview={setReviewing} />
          </TabsContent>
        </Tabs>
      </div>

      {reviewing && (
        <ApproveUsahaModal
          usaha={reviewing}
          open={!!reviewing}
          onOpenChange={(open) => !open && setReviewing(null)}
        />
      )}
    </SidebarInset>
  )
}
