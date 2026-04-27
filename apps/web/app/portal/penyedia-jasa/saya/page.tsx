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
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { MapPin, Phone, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useGetMyPenyediaJasa } from '@/app/penyedia-jasa/hooks/useGetMyPenyediaJasa'
import { useDeletePenyediaJasa } from '@/app/penyedia-jasa/hooks/useDeletePenyediaJasa'
import {
  CategoryBadge,
  PenyediaJasaStatusBadge,
} from '@/app/penyedia-jasa/components/PenyediaJasaBadges'
import { StarRating } from '@/app/penyedia-jasa/components/StarRating'
import { CreatePenyediaJasaModal } from '../components/CreatePenyediaJasaModal'

export default function MyPenyediaJasaPage() {
  const { data, isLoading, error } = useGetMyPenyediaJasa()
  const deleteMutation = useDeletePenyediaJasa()

  const handleDelete = (id: string) => {
    if (!window.confirm('Hapus rekomendasi ini?')) return
    deleteMutation.mutate(id)
  }

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
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/portal/penyedia-jasa">
                  Penyedia Jasa
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Rekomendasi Saya</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex justify-end">
          <CreatePenyediaJasaModal />
        </div>
        {isLoading && (
          <p className="text-sm text-muted-foreground">Memuat...</p>
        )}
        {error && <p className="text-sm text-red-500">Gagal memuat.</p>}
        {data && data.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Belum ada rekomendasi. Klik tombol Rekomendasikan untuk submit.
          </p>
        )}
        {data && data.length > 0 && (
          <div className="grid gap-3">
            {data.map((p) => (
              <Card key={p.id}>
                <CardHeader>
                  <CardTitle>
                    <Link
                      href={`/portal/penyedia-jasa/${p.id}`}
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
                </CardHeader>
                <CardContent>
                  {p.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {p.description}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
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
                      <p className="font-medium text-blue-900">
                        Catatan Admin:
                      </p>
                      <p className="text-blue-800 mt-1">{p.adminNotes}</p>
                    </div>
                  )}
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(p.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SidebarInset>
  )
}
