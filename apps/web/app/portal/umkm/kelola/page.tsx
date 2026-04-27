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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CirclePlus, Package, Pencil, Trash2 } from 'lucide-react'
import { useGetMyUmkm } from '@/app/umkm-warga/hooks/useGetMyUmkm'
import { useCreateUmkm } from '@/app/umkm-warga/hooks/useCreateUmkm'
import { useUpdateUmkm } from '@/app/umkm-warga/hooks/useUpdateUmkm'
import { useCreateProduk, useUpdateProduk, useDeleteProduk } from '@/app/umkm-warga/hooks/useProduk'
import {
  CategoryBadge,
  UsahaStatusBadge,
  ProdukTypeBadge,
  UMKM_CATEGORY_OPTIONS,
  formatRupiah,
} from '@/app/umkm-warga/components/UmkmBadges'
import type { UmkmCategory, UmkmUsaha, UmkmProduk } from '@/lib/api/umkm'

// ─── Daftar Usaha Modal ─────────────────────────────────────────────────────

function DaftarUsahaModal() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<UmkmCategory>('MAKANAN')
  const [address, setAddress] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const { mutateAsync, isPending, error } = useCreateUmkm()

  const reset = () => {
    setName('')
    setDescription('')
    setCategory('MAKANAN')
    setAddress('')
    setWhatsapp('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await mutateAsync({ name, description, category, address: address || undefined, whatsapp })
      reset()
      setOpen(false)
    } catch {
      // error ditampilkan via error state
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CirclePlus className="w-4 h-4 mr-2" /> Daftar Usaha
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Daftarkan Usaha Baru</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mt-1">
            Usaha akan direview admin sebelum tampil di katalog.
          </p>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <Label>Nama Usaha</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label>Kategori</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as UmkmCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UMKM_CATEGORY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan usaha kamu secara singkat"
                rows={3}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Alamat / Lokasi</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Contoh: Blok A No. 5 (opsional)"
              />
            </div>
            <div className="grid gap-2">
              <Label>Nomor WhatsApp</Label>
              <Input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Contoh: 08123456789"
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
              {isPending ? 'Mendaftar...' : 'Daftar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Tambah Produk Modal ────────────────────────────────────────────────────

function TambahProdukModal({ usahaId }: { usahaId: string }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [type, setType] = useState<'BARANG' | 'JASA'>('BARANG')
  const { mutateAsync, isPending, error } = useCreateProduk(usahaId)

  const reset = () => {
    setName('')
    setDescription('')
    setPrice('')
    setType('BARANG')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await mutateAsync({ name, description: description || undefined, price: Number(price), type })
      reset()
      setOpen(false)
    } catch {
      // error ditampilkan via error state
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <CirclePlus className="w-4 h-4 mr-1" /> Tambah Produk
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Produk / Jasa</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <Label>Tipe</Label>
              <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BARANG">Barang</SelectItem>
                  <SelectItem value="JASA">Jasa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Nama</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label>Harga (Rp)</Label>
              <Input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat (opsional)"
                rows={2}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button type="button" variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Produk Row ─────────────────────────────────────────────────────────────

function ProdukRow({ produk }: { produk: UmkmProduk }) {
  const updateMutation = useUpdateProduk()
  const deleteMutation = useDeleteProduk()

  const toggleAvail = () => {
    updateMutation.mutate({ id: produk.id, data: { isAvailable: !produk.isAvailable } })
  }

  const handleDelete = () => {
    if (!window.confirm(`Hapus "${produk.name}"?`)) return
    deleteMutation.mutate(produk.id)
  }

  return (
    <div className="flex items-center justify-between rounded-md border p-3 text-sm">
      <div>
        <div className="flex items-center gap-2">
          <span className={produk.isAvailable ? 'font-medium' : 'font-medium line-through text-muted-foreground'}>
            {produk.name}
          </span>
          <ProdukTypeBadge type={produk.type} />
          {!produk.isAvailable && (
            <span className="text-xs text-muted-foreground">(tidak tersedia)</span>
          )}
        </div>
        {produk.description && (
          <p className="text-muted-foreground text-xs mt-0.5">{produk.description}</p>
        )}
        <p className="font-semibold mt-1">{formatRupiah(produk.price)}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0 ml-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAvail}
          disabled={updateMutation.isPending}
          className="text-xs"
        >
          {produk.isAvailable ? 'Nonaktifkan' : 'Aktifkan'}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

// ─── Usaha Card ──────────────────────────────────────────────────────────────

function UsahaCard({ usaha }: { usaha: UmkmUsaha }) {
  const updateMutation = useUpdateUmkm()

  const toggleActive = () => {
    updateMutation.mutate({ id: usaha.id, data: { isActive: !usaha.isActive } })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {usaha.name}
          {!usaha.isActive && (
            <span className="text-xs font-normal text-muted-foreground">(dinonaktifkan)</span>
          )}
        </CardTitle>
        <CardDescription>
          <div className="flex flex-wrap gap-2 mt-1">
            <CategoryBadge category={usaha.category} />
            <UsahaStatusBadge status={usaha.status} />
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{usaha.description}</p>

        {usaha.status === 'REJECTED' && usaha.adminNotes && (
          <div className="rounded-md border-l-2 border-red-400 bg-red-50 p-3 text-sm">
            <p className="font-medium text-red-800">Alasan Penolakan:</p>
            <p className="text-red-700 mt-1">{usaha.adminNotes}</p>
          </div>
        )}

        {usaha.status === 'PENDING' && (
          <div className="rounded-md border-l-2 border-yellow-400 bg-yellow-50 p-3 text-sm text-yellow-800">
            Usaha sedang menunggu review admin sebelum tampil di katalog.
          </div>
        )}

        {/* Produk list */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium flex items-center gap-1">
              <Package className="w-4 h-4" /> Produk &amp; Jasa ({usaha.products?.length ?? 0})
            </p>
            <TambahProdukModal usahaId={usaha.id} />
          </div>
          {usaha.products && usaha.products.length > 0 ? (
            <div className="grid gap-2">
              {usaha.products.map((p) => (
                <ProdukRow key={p.id} produk={p} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada produk/jasa.</p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleActive}
            disabled={updateMutation.isPending}
          >
            <Pencil className="w-4 h-4 mr-1" />
            {usaha.isActive ? 'Nonaktifkan Usaha' : 'Aktifkan Usaha'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PortalUmkmKelolaPage() {
  const { data: myUsaha, isLoading, error } = useGetMyUmkm()

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/portal/umkm">UMKM</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Kelola Usaha Saya</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex justify-end">
          <DaftarUsahaModal />
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Memuat...</p>}
        {error && <p className="text-sm text-red-500">Gagal memuat.</p>}
        {!isLoading && myUsaha?.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <Package className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
            <p className="font-medium">Belum ada usaha terdaftar</p>
            <p className="text-sm text-muted-foreground mt-1">
              Klik &ldquo;Daftar Usaha&rdquo; untuk mendaftarkan usaha kamu.
            </p>
          </div>
        )}

        <div className="grid gap-4">
          {myUsaha?.map((u) => <UsahaCard key={u.id} usaha={u} />)}
        </div>
      </div>
    </SidebarInset>
  )
}
