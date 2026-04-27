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
import { MapPin, Phone, ClipboardCheck } from 'lucide-react'
import Link from 'next/link'
import { useGetPenyediaJasa } from './hooks/useGetPenyediaJasa'
import { useDeletePenyediaJasa } from './hooks/useDeletePenyediaJasa'
import { ApproveModal } from './components/ApproveModal'
import {
  CategoryBadge,
  PenyediaJasaStatusBadge,
} from './components/PenyediaJasaBadges'
import { StarRating } from './components/StarRating'
import type { PenyediaJasa, PenyediaJasaStatus } from '@/lib/api/penyedia-jasa'

function PenyediaJasaList({
  status,
  onReview,
}: {
  status?: PenyediaJasaStatus
  onReview: (item: PenyediaJasa) => void
}) {
  const { data, isLoading, error } = useGetPenyediaJasa({ status, limit: 50 })
  const deleteMutation = useDeletePenyediaJasa()

  const handleDelete = (id: string) => {
    if (!window.confirm('Hapus rekomendasi ini?')) return
    deleteMutation.mutate(id)
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Memuat...</p>
  if (error) return <p className="text-sm text-red-500">Gagal memuat.</p>
  if (!data?.data.length)
    return <p className="text-sm text-muted-foreground">Belum ada entry.</p>

  return (
    <div className="grid gap-4">
      {data.data.map((p) => (
        <Card key={p.id}>
          <CardHeader>
            <CardTitle>
              <Link
                href={`/penyedia-jasa/${p.id}`}
                className="hover:underline"
              >
                {p.personName}
              </Link>
            </CardTitle>
            <CardDescription>
              <div className="flex flex-wrap gap-2 mt-1 items-center">
                <CategoryBadge category={p.category} />
                <PenyediaJasaStatusBadge status={p.status} />
                {p.status === 'ACTIVE' && (
                  <StarRating
                    rating={p.averageRating ?? null}
                    size="sm"
                    showValue
                    reviewCount={p.reviewCount}
                  />
                )}
              </div>
            </CardDescription>
            <CardAction className="flex gap-2">
              {(p.status === 'PENDING' || p.status === 'ACTIVE') && (
                <Button variant="outline" size="sm" onClick={() => onReview(p)}>
                  <ClipboardCheck className="w-4 h-4 mr-1" /> Review
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => handleDelete(p.id)}
                disabled={deleteMutation.isPending}
              >
                Hapus
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {p.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {p.description}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>
                Direkomendasikan:{' '}
                <strong>
                  {p.submitter.profile?.fullName ?? p.submitter.email}
                </strong>
              </span>
              {p.area && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {p.area}
                </span>
              )}
              {p.whatsapp && (
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {p.whatsapp}
                </span>
              )}
            </div>
            {p.adminNotes && (
              <div className="mt-3 rounded-md border-l-2 border-blue-400 bg-blue-50 p-3 text-sm">
                <p className="font-medium text-blue-900">Catatan Admin:</p>
                <p className="text-blue-800 mt-1">{p.adminNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function PenyediaJasaAdminPage() {
  const [tab, setTab] = useState('PENDING')
  const [reviewing, setReviewing] = useState<PenyediaJasa | null>(null)

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
                <BreadcrumbPage>Penyedia Jasa</BreadcrumbPage>
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
            <PenyediaJasaList status="PENDING" onReview={setReviewing} />
          </TabsContent>
          <TabsContent value="ACTIVE" className="mt-4">
            <PenyediaJasaList status="ACTIVE" onReview={setReviewing} />
          </TabsContent>
          <TabsContent value="REJECTED" className="mt-4">
            <PenyediaJasaList status="REJECTED" onReview={setReviewing} />
          </TabsContent>
        </Tabs>
      </div>

      {reviewing && (
        <ApproveModal
          item={reviewing}
          open={!!reviewing}
          onOpenChange={(open) => !open && setReviewing(null)}
        />
      )}
    </SidebarInset>
  )
}
