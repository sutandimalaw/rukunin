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
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Package, Search, CalendarDays, X } from 'lucide-react'
import { useGetInventarisList } from '@/app/inventaris/hooks/useGetInventarisList'
import { useGetPeminjamanList } from '@/app/inventaris/hooks/useGetPeminjamanList'
import { useCreatePeminjaman } from '@/app/inventaris/hooks/useCreatePeminjaman'
import { useCancelPeminjaman } from '@/app/inventaris/hooks/useCancelPeminjaman'
import {
  CategoryBadge,
  ConditionBadge,
  PeminjamanStatusBadge,
  INVENTARIS_CATEGORY_OPTIONS,
  formatDate,
} from '@/app/inventaris/components/InventarisBadges'
import type { InventarisCategory, Inventaris, PeminjamanStatus } from '@/lib/api/inventaris'

// ─── Pinjam Modal ──────────────────────────────────────────────────────────

function PinjamModal({
  item,
  onClose,
}: {
  item: Inventaris
  onClose: () => void
}) {
  const [quantity, setQuantity] = useState('1')
  const [borrowDate, setBorrowDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [purpose, setPurpose] = useState('')
  const { mutateAsync, isPending, error } = useCreatePeminjaman()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await mutateAsync({
        inventarisId: item.id,
        quantity: Number(quantity),
        borrowDate,
        returnDate,
        purpose,
      })
      onClose()
    } catch {
      // error state
    }
  }

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Pinjam &ldquo;{item.name}&rdquo;</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mt-1">
            Permintaan akan direview oleh pengurus RT.
          </p>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <Label>Jumlah (maks: {item.quantity})</Label>
              <Input
                type="number"
                min={1}
                max={item.quantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Tanggal Pinjam</Label>
                <Input
                  type="date"
                  value={borrowDate}
                  onChange={(e) => setBorrowDate(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Tanggal Kembali</Label>
                <Input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Keperluan</Label>
              <Textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Contoh: Acara arisan RT blok A"
                rows={3}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button type="button" variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Mengajukan...' : 'Ajukan Peminjaman'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function PortalInventarisPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [pinjamItem, setPinjamItem] = useState<Inventaris | null>(null)

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
                <BreadcrumbPage>Inventaris RT</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Tabs defaultValue="katalog">
          <TabsList>
            <TabsTrigger value="katalog">Katalog Inventaris</TabsTrigger>
            <TabsTrigger value="riwayat">Riwayat Peminjaman</TabsTrigger>
          </TabsList>

          <TabsContent value="katalog">
            <KatalogInventaris
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              onPinjam={setPinjamItem}
            />
          </TabsContent>

          <TabsContent value="riwayat">
            <RiwayatPeminjaman />
          </TabsContent>
        </Tabs>

        {pinjamItem && <PinjamModal item={pinjamItem} onClose={() => setPinjamItem(null)} />}
      </div>
    </SidebarInset>
  )
}

// ─── Katalog Inventaris ─────────────────────────────────────────────────────

function KatalogInventaris({
  search,
  setSearch,
  category,
  setCategory,
  onPinjam,
}: {
  search: string
  setSearch: (v: string) => void
  category: string
  setCategory: (v: string) => void
  onPinjam: (item: Inventaris) => void
}) {
  const { data, isLoading, error } = useGetInventarisList({
    category: category !== 'all' ? (category as InventarisCategory) : undefined,
    search: search || undefined,
    limit: 50,
  })

  // Fetch peminjaman aktif milik warga untuk cek status per barang
  const { data: peminjamanData } = useGetPeminjamanList({ limit: 100 })
  const activeBorrowIds = new Set(
    (peminjamanData?.data ?? [])
      .filter((p) => ['PENDING', 'DISETUJUI', 'DIPINJAM'].includes(p.status))
      .map((p) => p.inventarisId),
  )

  // Only show available items for warga
  const items = data?.data.filter((i) => i.isAvailable) ?? []

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Cari inventaris..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {INVENTARIS_CATEGORY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Memuat...</p>}
      {error && <p className="text-sm text-red-500">Gagal memuat.</p>}
      {!isLoading && items.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Package className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
          <p className="font-medium">Belum ada inventaris tersedia</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const isAlreadyBorrowed = activeBorrowIds.has(item.id)
          return (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-base">{item.name}</CardTitle>
              <CardDescription>
                <div className="flex flex-wrap gap-2 mt-1">
                  <CategoryBadge category={item.category} />
                  <ConditionBadge condition={item.condition} />
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {item.description && (
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
              )}
              <p className="text-sm mb-3">
                <span className="font-medium">Tersedia:</span> {item.quantity} unit
              </p>
              {isAlreadyBorrowed ? (
                <p className="text-xs text-yellow-600 font-medium bg-yellow-50 rounded px-2 py-1">
                  Anda sudah memiliki peminjaman aktif untuk barang ini
                </p>
              ) : (
                <Button size="sm" onClick={() => onPinjam(item)}>
                  <CalendarDays className="w-4 h-4 mr-1" /> Ajukan Pinjam
                </Button>
              )}
            </CardContent>
          </Card>
          )
        })}
      </div>
    </div>
  )
}

// ─── Riwayat Peminjaman ─────────────────────────────────────────────────────

function RiwayatPeminjaman() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { data, isLoading, error } = useGetPeminjamanList({
    status: statusFilter !== 'all' ? (statusFilter as PeminjamanStatus) : undefined,
    limit: 50,
  })
  const cancelMutation = useCancelPeminjaman()

  return (
    <div className="flex flex-col gap-4 mt-4">
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="PENDING">Menunggu</TabsTrigger>
          <TabsTrigger value="DISETUJUI">Disetujui</TabsTrigger>
          <TabsTrigger value="DIPINJAM">Dipinjam</TabsTrigger>
          <TabsTrigger value="DIKEMBALIKAN">Dikembalikan</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading && <p className="text-sm text-muted-foreground">Memuat...</p>}
      {error && <p className="text-sm text-red-500">Gagal memuat.</p>}
      {!isLoading && data?.data.length === 0 && (
        <p className="text-sm text-muted-foreground">Belum ada riwayat peminjaman.</p>
      )}

      <div className="grid gap-3">
        {data?.data.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>{p.inventaris.name}</span>
                <PeminjamanStatusBadge status={p.status} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-1 text-sm">
                <p><span className="font-medium">Jumlah:</span> {p.quantity} unit</p>
                <p><span className="font-medium">Pinjam:</span> {formatDate(p.borrowDate)}</p>
                <p><span className="font-medium">Kembali:</span> {formatDate(p.returnDate)}</p>
                <p><span className="font-medium">Keperluan:</span> {p.purpose}</p>
                {p.adminNotes && (
                  <p><span className="font-medium">Catatan Admin:</span> {p.adminNotes}</p>
                )}
                {p.actualReturn && (
                  <p><span className="font-medium">Dikembalikan:</span> {formatDate(p.actualReturn)}</p>
                )}
              </div>
              {p.status === 'PENDING' && (
                <div className="mt-3 border-t pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500"
                    onClick={() => {
                      if (confirm('Batalkan peminjaman ini?')) cancelMutation.mutate(p.id)
                    }}
                    disabled={cancelMutation.isPending}
                  >
                    <X className="w-4 h-4 mr-1" /> Batalkan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
