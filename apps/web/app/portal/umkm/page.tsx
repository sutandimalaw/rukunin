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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Link from 'next/link'
import { MapPin, Phone, Package, Search, Settings2 } from 'lucide-react'
import { useGetUmkmList } from '@/app/umkm-warga/hooks/useGetUmkmList'
import { useGetUmkmDetail } from '@/app/umkm-warga/hooks/useGetUmkmDetail'
import {
  CategoryBadge,
  UMKM_CATEGORY_OPTIONS,
  formatRupiah,
} from '@/app/umkm-warga/components/UmkmBadges'
import { ProdukTypeBadge } from '@/app/umkm-warga/components/UmkmBadges'
import type { UmkmCategory, UmkmUsaha } from '@/lib/api/umkm'

function DetailModal({
  usaha,
  open,
  onClose,
}: {
  usaha: UmkmUsaha
  open: boolean
  onClose: () => void
}) {
  const { data } = useGetUmkmDetail(open ? usaha.id : null)
  const detail = data ?? usaha

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[560px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{detail.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-2 mt-1">
          <CategoryBadge category={detail.category} />
        </div>
        <p className="text-sm text-muted-foreground mt-2">{detail.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
          {detail.address && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {detail.address}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Phone className="w-4 h-4" /> {detail.whatsapp}
          </span>
        </div>

        {/* Produk */}
        {detail.products && detail.products.length > 0 && (
          <div className="mt-4">
            <p className="font-medium text-sm mb-2">Produk &amp; Jasa</p>
            <div className="grid gap-2">
              {detail.products
                .filter((p) => p.isAvailable)
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-start justify-between rounded-md border p-3 text-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{p.name}</span>
                        <ProdukTypeBadge type={p.type} />
                      </div>
                      {p.description && (
                        <p className="text-muted-foreground text-xs mt-0.5">{p.description}</p>
                      )}
                    </div>
                    <span className="font-semibold shrink-0 ml-4">
                      {formatRupiah(p.price)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        <Button
          className="mt-4 w-full"
          onClick={() =>
            window.open(
              `https://wa.me/${detail.whatsapp.replace(/\D/g, '')}`,
              '_blank',
            )
          }
        >
          <Phone className="w-4 h-4 mr-2" /> Hubungi via WhatsApp
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default function PortalUmkmPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<UmkmCategory | 'all'>('all')
  const [selected, setSelected] = useState<UmkmUsaha | null>(null)

  const { data, isLoading, error } = useGetUmkmList({
    status: 'ACTIVE',
    limit: 50,
    category: category !== 'all' ? category : undefined,
    search: search || undefined,
  })

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/portal">Portal Warga</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>UMKM</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Action bar */}
        <div className="flex justify-end">
          <Button asChild variant="outline">
            <Link href="/portal/umkm/kelola">
              <Settings2 className="w-4 h-4 mr-2" /> Kelola Usaha Saya
            </Link>
          </Button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Cari nama usaha..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as typeof category)}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {UMKM_CATEGORY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        {isLoading && <p className="text-sm text-muted-foreground">Memuat...</p>}
        {error && <p className="text-sm text-red-500">Gagal memuat.</p>}
        {!isLoading && data?.data.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada usaha yang terdaftar.</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.data.map((u) => (
            <Card
              key={u.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelected(u)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base line-clamp-1">{u.name}</CardTitle>
                <CardDescription>
                  <CategoryBadge category={u.category} />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{u.description}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {u.address && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {u.address}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Package className="w-3 h-3" /> {u._count?.products ?? 0} produk
                  </span>
                </div>
                <Button
                  size="sm"
                  className="mt-3 w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(
                      `https://wa.me/${u.whatsapp.replace(/\D/g, '')}`,
                      '_blank',
                    )
                  }}
                >
                  <Phone className="w-3 h-3 mr-1" /> WhatsApp
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selected && (
        <DetailModal
          usaha={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
        />
      )}
    </SidebarInset>
  )
}
