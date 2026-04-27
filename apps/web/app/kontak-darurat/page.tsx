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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CirclePlus, Pencil, Trash2, Phone } from 'lucide-react'
import { useGetKontakDaruratAdmin } from './hooks/useGetKontakDarurat'
import { useCreateKontakDarurat, useUpdateKontakDarurat, useDeleteKontakDarurat } from './hooks/useKontakDaruratMutations'
import type { KontakDarurat, KontakCategory, CreateKontakData } from '@/lib/api/kontak-darurat'

const CATEGORY_OPTIONS: { value: KontakCategory; label: string }[] = [
  { value: 'RUMAH_SAKIT', label: 'Rumah Sakit' },
  { value: 'POLISI', label: 'Polisi' },
  { value: 'PEMADAM', label: 'Pemadam Kebakaran' },
  { value: 'PLN', label: 'PLN' },
  { value: 'PDAM', label: 'PDAM' },
  { value: 'AMBULANS', label: 'Ambulans' },
  { value: 'LAINNYA', label: 'Lainnya' },
]

function getCategoryLabel(cat: KontakCategory) {
  return CATEGORY_OPTIONS.find((c) => c.value === cat)?.label ?? cat
}

// ─── Form Dialog ─────────────────────────────────────────────────────────────

function KontakFormDialog({
  mode,
  initial,
  trigger,
}: {
  mode: 'create' | 'edit'
  initial?: Partial<CreateKontakData>
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(initial?.name ?? '')
  const [category, setCategory] = useState<KontakCategory>(initial?.category ?? 'LAINNYA')
  const [phoneNumber, setPhoneNumber] = useState(initial?.phoneNumber ?? '')
  const [address, setAddress] = useState(initial?.address ?? '')
  const [isActive, setIsActive] = useState(initial?.isActive ?? true)
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0))

  const createMutation = useCreateKontakDarurat()
  const updateMutation = useUpdateKontakDarurat()
  const isPending = createMutation.isPending || updateMutation.isPending
  const error = createMutation.error || updateMutation.error

  const handleOpen = (val: boolean) => {
    if (val) {
      setName(initial?.name ?? '')
      setCategory(initial?.category ?? 'LAINNYA')
      setPhoneNumber(initial?.phoneNumber ?? '')
      setAddress(initial?.address ?? '')
      setIsActive(initial?.isActive ?? true)
      setSortOrder(String(initial?.sortOrder ?? 0))
    }
    setOpen(val)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data: CreateKontakData = {
      name: name.trim(),
      category,
      phoneNumber: phoneNumber.trim(),
      address: address.trim() || undefined,
      isActive,
      sortOrder: Number(sortOrder),
    }
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(data)
      } else if (initial && 'id' in initial) {
        await updateMutation.mutateAsync({ id: (initial as KontakDarurat).id, data })
      }
      setOpen(false)
    } catch {}
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Tambah Kontak Darurat' : 'Edit Kontak'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nama *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nama instansi / layanan" />
          </div>
          <div className="space-y-1.5">
            <Label>Kategori *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as KontakCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>No. Telepon *</Label>
            <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required placeholder="Contoh: 112" />
          </div>
          <div className="space-y-1.5">
            <Label>Alamat (opsional)</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Alamat kantor / instansi" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Urutan</Label>
              <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} min={0} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Aktif</Label>
              <div className="flex items-center h-10">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{String(error)}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Menyimpan...' : mode === 'create' ? 'Tambah' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function KontakDaruratPage() {
  const { data: contacts, isLoading } = useGetKontakDaruratAdmin()
  const { mutateAsync: remove } = useDeleteKontakDarurat()

  const grouped = (contacts ?? []).reduce<Record<string, KontakDarurat[]>>((acc, k) => {
    const cat = k.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(k)
    return acc
  }, {})

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Kontak Darurat</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Kontak Darurat</h1>
            <p className="text-muted-foreground text-sm">Kelola nomor telepon penting di lingkungan RT</p>
          </div>
          <KontakFormDialog
            mode="create"
            trigger={
              <Button className="gap-2">
                <CirclePlus className="w-4 h-4" /> Tambah Kontak
              </Button>
            }
          />
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Memuat...</p>
        ) : !contacts?.length ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Belum ada kontak darurat.</p>
        ) : (
          <div className="space-y-6">
            {CATEGORY_OPTIONS.filter((c) => grouped[c.value]?.length).map(({ value, label }) => (
              <Card key={value}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{label}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>No. Telepon</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-20">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grouped[value].map((k) => (
                        <TableRow key={k.id}>
                          <TableCell className="font-medium">{k.name}</TableCell>
                          <TableCell>
                            <a href={`tel:${k.phoneNumber}`} className="flex items-center gap-1 text-primary hover:underline">
                              <Phone className="w-3.5 h-3.5" /> {k.phoneNumber}
                            </a>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{k.address ?? '—'}</TableCell>
                          <TableCell>
                            <Badge variant={k.isActive ? 'default' : 'secondary'}>
                              {k.isActive ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <KontakFormDialog
                                mode="edit"
                                initial={{ ...k, address: k.address ?? undefined }}
                                trigger={
                                  <Button variant="ghost" size="icon">
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                }
                              />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Hapus kontak?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Kontak <strong>{k.name}</strong> akan dihapus permanen.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => remove(k.id)}
                                    >
                                      Hapus
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SidebarInset>
  )
}
