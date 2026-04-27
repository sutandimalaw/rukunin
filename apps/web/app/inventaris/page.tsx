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
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CirclePlus, Pencil, Trash2, Search, Package } from 'lucide-react'
import { useGetInventarisList } from './hooks/useGetInventarisList'
import { useCreateInventaris } from './hooks/useCreateInventaris'
import { useUpdateInventaris } from './hooks/useUpdateInventaris'
import { useDeleteInventaris } from './hooks/useDeleteInventaris'
import {
  CategoryBadge,
  ConditionBadge,
  INVENTARIS_CATEGORY_OPTIONS,
} from './components/InventarisBadges'
import type { InventarisCategory, InventarisCondition, Inventaris } from '@/lib/api/inventaris'

// ─── Create/Edit Modal ─────────────────────────────────────────────────────

function InventarisFormModal({
  item,
  onClose,
}: {
  item?: Inventaris
  onClose: () => void
}) {
  const [open, setOpen] = useState(true)
  const [name, setName] = useState(item?.name ?? '')
  const [category, setCategory] = useState<InventarisCategory>(item?.category ?? 'ELEKTRONIK')
  const [description, setDescription] = useState(item?.description ?? '')
  const [quantity, setQuantity] = useState(String(item?.quantity ?? 1))
  const [condition, setCondition] = useState<InventarisCondition>(item?.condition ?? 'BAIK')
  const createMutation = useCreateInventaris()
  const updateMutation = useUpdateInventaris()
  const isPending = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      name,
      category,
      description: description || undefined,
      quantity: Number(quantity),
      condition,
    }
    try {
      if (item) {
        await updateMutation.mutateAsync({ id: item.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      setOpen(false)
      onClose()
    } catch {
      // error state
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(false)
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{item ? 'Edit Inventaris' : 'Tambah Inventaris'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <Label>Nama Barang</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label>Kategori</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as InventarisCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INVENTARIS_CATEGORY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Jumlah Unit</Label>
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Kondisi</Label>
                <Select value={condition} onValueChange={(v) => setCondition(v as InventarisCondition)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BAIK">Baik</SelectItem>
                    <SelectItem value="RUSAK_RINGAN">Rusak Ringan</SelectItem>
                    <SelectItem value="RUSAK_BERAT">Rusak Berat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Deskripsi (opsional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Keterangan tambahan..."
              />
            </div>
            {(createMutation.error || updateMutation.error) && (
              <p className="text-sm text-red-500">
                {(createMutation.error || updateMutation.error)?.message}
              </p>
            )}
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button type="button" variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Menyimpan...' : item ? 'Simpan' : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Inventaris Card ────────────────────────────────────────────────────────

function InventarisCard({
  item,
  onEdit,
}: {
  item: Inventaris
  onEdit: (item: Inventaris) => void
}) {
  const deleteMutation = useDeleteInventaris()
  const updateMutation = useUpdateInventaris()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{item.name}</CardTitle>
        <CardDescription>
          <div className="flex flex-wrap gap-2 mt-1">
            <CategoryBadge category={item.category} />
            <ConditionBadge condition={item.condition} />
            {!item.isAvailable && (
              <span className="text-xs text-red-600 font-medium">Tidak Tersedia</span>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {item.description && (
          <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
        )}
        <p className="text-sm">
          <span className="font-medium">Stok:</span> {item.quantity} unit
        </p>
        <div className="flex justify-end gap-2 mt-4 border-t pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateMutation.mutate({ id: item.id, data: { isAvailable: !item.isAvailable } })}
            disabled={updateMutation.isPending}
          >
            {item.isAvailable ? 'Nonaktifkan' : 'Aktifkan'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
            <Pencil className="w-4 h-4 mr-1" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-600"
            onClick={() => {
              if (confirm('Hapus inventaris ini?')) deleteMutation.mutate(item.id)
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4 mr-1" /> Hapus
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function InventarisPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [editItem, setEditItem] = useState<Inventaris | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const { data, isLoading, error } = useGetInventarisList({
    category: category !== 'all' ? (category as InventarisCategory) : undefined,
    search: search || undefined,
    limit: 50,
  })

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Inventaris RT</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Tabs defaultValue="inventaris">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <TabsList>
              <TabsTrigger value="inventaris">Daftar Inventaris</TabsTrigger>
              <TabsTrigger value="peminjaman">Peminjaman</TabsTrigger>
            </TabsList>
            <Button onClick={() => setShowCreate(true)}>
              <CirclePlus className="w-4 h-4 mr-2" /> Tambah Inventaris
            </Button>
          </div>

          <TabsContent value="inventaris">
            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Cari nama barang..."
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
            {!isLoading && data?.data.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <Package className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                <p className="font-medium">Belum ada inventaris</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Klik &ldquo;Tambah Inventaris&rdquo; untuk menambah barang.
                </p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data?.data.map((item) => (
                <InventarisCard key={item.id} item={item} onEdit={setEditItem} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="peminjaman">
            <PeminjamanAdmin />
          </TabsContent>
        </Tabs>

        {showCreate && <InventarisFormModal onClose={() => setShowCreate(false)} />}
        {editItem && <InventarisFormModal item={editItem} onClose={() => setEditItem(null)} />}
      </div>
    </SidebarInset>
  )
}

// ─── Peminjaman Admin Tab ───────────────────────────────────────────────────

function PeminjamanAdmin() {
  const [statusFilter, setStatusFilter] = useState<string>('PENDING')
  const { data, isLoading, error } = useGetPeminjamanList({
    status: statusFilter !== 'all' ? (statusFilter as PeminjamanStatus) : undefined,
    limit: 50,
  })
  const updateStatus = useUpdatePeminjamanStatus()

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="PENDING">Menunggu</TabsTrigger>
          <TabsTrigger value="DISETUJUI">Disetujui</TabsTrigger>
          <TabsTrigger value="DIPINJAM">Dipinjam</TabsTrigger>
          <TabsTrigger value="DIKEMBALIKAN">Dikembalikan</TabsTrigger>
          <TabsTrigger value="DITOLAK">Ditolak</TabsTrigger>
          <TabsTrigger value="all">Semua</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading && <p className="text-sm text-muted-foreague">Memuat...</p>}
      {error && <p className="text-sm text-red-500">Gagal memuat.</p>}
      {!isLoading && data?.data.length === 0 && (
        <p className="text-sm text-muted-foreground">Tidak ada data peminjaman.</p>
      )}

      <div className="grid gap-3">
        {data?.data.map((p) => (
          <PeminjamanCard key={p.id} peminjaman={p} onAction={updateStatus.mutate} isPending={updateStatus.isPending} />
        ))}
      </div>
    </div>
  )
}

// Import these at top level — moved here for readability
import { useGetPeminjamanList } from './hooks/useGetPeminjamanList'
import { useUpdatePeminjamanStatus } from './hooks/useUpdatePeminjamanStatus'
import { PeminjamanStatusBadge, formatDate } from './components/InventarisBadges'
import type { PeminjamanInventaris, PeminjamanStatus, UpdatePeminjamanStatusData } from '@/lib/api/inventaris'

function PeminjamanCard({
  peminjaman: p,
  onAction,
  isPending,
}: {
  peminjaman: PeminjamanInventaris
  onAction: (args: { id: string; data: UpdatePeminjamanStatusData }) => void
  isPending: boolean
}) {
  const [notes, setNotes] = useState('')
  const borrowerName = p.borrower.profile?.fullName ?? p.borrower.email

  const handleAction = (status: UpdatePeminjamanStatusData['status']) => {
    onAction({ id: p.id, data: { status, adminNotes: notes || undefined } })
    setNotes('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>{p.inventaris.name}</span>
          <PeminjamanStatusBadge status={p.status} />
        </CardTitle>
        <CardDescription>
          Peminjam: <span className="font-medium text-foreground">{borrowerName}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 text-sm">
          <p><span className="font-medium">Jumlah:</span> {p.quantity} unit</p>
          <p><span className="font-medium">Tanggal Pinjam:</span> {formatDate(p.borrowDate)}</p>
          <p><span className="font-medium">Tanggal Kembali:</span> {formatDate(p.returnDate)}</p>
          <p><span className="font-medium">Keperluan:</span> {p.purpose}</p>
          {p.adminNotes && (
            <p><span className="font-medium">Catatan Admin:</span> {p.adminNotes}</p>
          )}
          {p.actualReturn && (
            <p><span className="font-medium">Dikembalikan:</span> {formatDate(p.actualReturn)}</p>
          )}
        </div>

        {(p.status === 'PENDING' || p.status === 'DISETUJUI' || p.status === 'DIPINJAM') && (
          <div className="mt-4 border-t pt-3 flex flex-col gap-3">
            <Textarea
              placeholder="Catatan admin (opsional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
            <div className="flex gap-2 flex-wrap">
              {p.status === 'PENDING' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleAction('DISETUJUI')}
                    disabled={isPending}
                  >
                    Setujui
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleAction('DITOLAK')}
                    disabled={isPending}
                  >
                    Tolak
                  </Button>
                </>
              )}
              {p.status === 'DISETUJUI' && (
                <Button
                  size="sm"
                  onClick={() => handleAction('DIPINJAM')}
                  disabled={isPending}
                >
                  Tandai Dipinjam
                </Button>
              )}
              {p.status === 'DIPINJAM' && (
                <Button
                  size="sm"
                  onClick={() => handleAction('DIKEMBALIKAN')}
                  disabled={isPending}
                >
                  Tandai Dikembalikan
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
