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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MapPin, Phone, Search } from 'lucide-react'
import Link from 'next/link'
import { useGetPenyediaJasa } from '@/app/penyedia-jasa/hooks/useGetPenyediaJasa'
import {
  CategoryBadge,
  CATEGORY_OPTIONS,
} from '@/app/penyedia-jasa/components/PenyediaJasaBadges'
import { StarRating } from '@/app/penyedia-jasa/components/StarRating'
import { CreatePenyediaJasaModal } from './components/CreatePenyediaJasaModal'
import type { PenyediaJasaCategory } from '@/lib/api/penyedia-jasa'

export default function PortalPenyediaJasaPage() {
  const [category, setCategory] = useState<'all' | PenyediaJasaCategory>('all')
  const [search, setSearch] = useState('')

  const { data, isLoading, error } = useGetPenyediaJasa({
    status: 'ACTIVE',
    category: category === 'all' ? undefined : category,
    search: search || undefined,
    limit: 50,
  })

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
                <BreadcrumbPage>Penyedia Jasa</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 flex-1 max-w-2xl">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama penyedia jasa..."
                className="pl-9"
              />
            </div>
            <Select
              value={category}
              onValueChange={(v) =>
                setCategory(v as 'all' | PenyediaJasaCategory)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {CATEGORY_OPTIONS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Link href="/portal/penyedia-jasa/saya">
              <span className="text-sm text-muted-foreground hover:underline">
                Rekomendasi Saya →
              </span>
            </Link>
            <CreatePenyediaJasaModal />
          </div>
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground">Memuat...</p>
        )}
        {error && (
          <p className="text-sm text-red-500">Gagal memuat: {error.message}</p>
        )}
        {data && data.data.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Belum ada penyedia jasa yang cocok. Jadi yang pertama
            merekomendasikan!
          </p>
        )}
        {data && data.data.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((p) => (
              <Link href={`/portal/penyedia-jasa/${p.id}`} key={p.id}>
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle>{p.personName}</CardTitle>
                    <CardDescription>
                      <div className="flex flex-wrap gap-2 mt-1 items-center">
                        <CategoryBadge category={p.category} />
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <StarRating
                      rating={p.averageRating ?? null}
                      size="sm"
                      showValue
                      reviewCount={p.reviewCount}
                    />
                    {p.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {p.description}
                      </p>
                    )}
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      {p.area && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {p.area}
                        </span>
                      )}
                      {p.whatsapp && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" /> {p.whatsapp}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </SidebarInset>
  )
}
