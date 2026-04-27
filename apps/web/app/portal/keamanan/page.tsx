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
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Phone, Shield, UserPlus, X } from 'lucide-react'
import { useGetPetugas } from '@/app/keamanan/hooks/useGetPetugas'
import { useGetInsiden } from '@/app/keamanan/hooks/useGetInsiden'
import { useCreateInsiden, useCancelInsiden } from '@/app/keamanan/hooks/useInsiden'
import { useGetBukuTamu } from '@/app/keamanan/hooks/useGetBukuTamu'
import { useCreateTamu } from '@/app/keamanan/hooks/useBukuTamu'
import {
  SeverityBadge,
  InsidenStatusBadge,
  InsidenCategoryBadge,
  INSIDEN_CATEGORY_OPTIONS,
  SEVERITY_OPTIONS,
  formatDateTime,
  formatDate,
} from '@/app/keamanan/components/KeamananBadges'
import type { InsidenCategory, InsidenSeverity } from '@/lib/api/keamanan'

// ─── Lapor Insiden Modal ──────────────────────────────────────────────────

function LaporInsidenModal() {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState<InsidenCategory>('LAINNYA')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [severity, setSeverity] = useState<InsidenSeverity>('SEDANG')
  const [incidentDate, setIncidentDate] = useState('')
  const { mutateAsync, isPending, error } = useCreateInsiden()

  const reset = () => {
    setCategory('LAINNYA')
    setTitle('')
    setDescription('')
    setLocation('')
    setSeverity('SEDANG')
    setIncidentDate('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await mutateAsync({
        category,
        title,
        description,
        location: location || undefined,
        severity,
        incidentDate,
      })
      reset()
      setOpen(false)
    } catch { /* error state */ }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <AlertTriangle className="w-4 h-4 mr-2" /> Laporkan Kejadian
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Laporkan Kejadian</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mt-1">
            Laporan akan diterima pengurus RT untuk ditindaklanjuti.
          </p>
          <div className="grid gap-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Kategori</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as InsidenCategory)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {INSIDEN_CATEGORY_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Tingkat Keparahan</Label>
                <Select value={severity} onValueChange={(v) => setSeverity(v as InsidenSeverity)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SEVERITY_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Judul Kejadian</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Lokasi</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Blok A depan pos"
                />
              </div>
              <div className="grid gap-2">
                <Label>Tanggal Kejadian</Label>
                <Input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Mengirim...' : 'Laporkan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Daftarkan Tamu Modal ─────────────────────────────────────────────────

function DaftarTamuModal() {
  const [open, setOpen] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [purpose, setPurpose] = useState('')
  const [destinationBlock, setDestinationBlock] = useState('')
  const [vehicleType, setVehicleType] = useState('TIDAK_ADA')
  const [vehicleNumber, setVehicleNumber] = useState('')
  const { mutateAsync, isPending, error } = useCreateTamu()

  const reset = () => {
    setGuestName('')
    setPurpose('')
    setDestinationBlock('')
    setVehicleType('TIDAK_ADA')
    setVehicleNumber('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await mutateAsync({
        guestName,
        purpose,
        destinationBlock: destinationBlock || undefined,
        vehicleType: vehicleType !== 'TIDAK_ADA' ? vehicleType : undefined,
        vehicleNumber: vehicleNumber || undefined,
      })
      reset()
      setOpen(false)
    } catch { /* error state */ }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="w-4 h-4 mr-2" /> Daftarkan Tamu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Daftarkan Tamu</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <Label>Nama Tamu</Label>
              <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label>Keperluan</Label>
              <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label>Blok Tujuan</Label>
              <Input value={destinationBlock} onChange={(e) => setDestinationBlock(e.target.value)} placeholder="Contoh: Blok A No. 5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Kendaraan</Label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TIDAK_ADA">Tidak Ada</SelectItem>
                    <SelectItem value="MOTOR">Motor</SelectItem>
                    <SelectItem value="MOBIL">Mobil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {vehicleType !== 'TIDAK_ADA' && (
                <div className="grid gap-2">
                  <Label>No. Plat</Label>
                  <Input value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />
                </div>
              )}
            </div>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
            <Button type="submit" disabled={isPending}>{isPending ? 'Menyimpan...' : 'Daftarkan'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function PortalKeamananPage() {
  const { data: petugasList } = useGetPetugas()
  const activePetugas = petugasList?.filter((p) => p.isOnDuty) ?? []

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
                <BreadcrumbPage>Keamanan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <LaporInsidenModal />
          <DaftarTamuModal />
        </div>

        {/* Petugas Bertugas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" /> Petugas Bertugas Saat Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activePetugas.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tidak ada petugas yang bertugas saat ini.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {activePetugas.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{p.fullName}</span>
                      <span className="text-sm text-muted-foreground">
                        {p.shift === 'PAGI' ? 'Pagi' : p.shift === 'SIANG' ? 'Siang' : 'Malam'} ({p.shiftTime})
                      </span>
                      {p.whatsapp && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {p.whatsapp}
                        </span>
                      )}
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Bertugas
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Riwayat Laporan Insiden */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Laporan Saya</CardTitle>
          </CardHeader>
          <CardContent>
            <RiwayatInsiden />
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}

// ─── Riwayat Insiden Warga ────────────────────────────────────────────────

function RiwayatInsiden() {
  const { data, isLoading } = useGetInsiden({ limit: 50 })
  const cancelMutation = useCancelInsiden()

  if (isLoading) return <p className="text-sm text-muted-foreground">Memuat...</p>
  if (!data?.data.length) return <p className="text-sm text-muted-foreground">Belum ada laporan.</p>

  return (
    <div className="grid gap-3">
      {data.data.map((insiden) => (
        <div key={insiden.id} className="rounded-lg border p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">{insiden.title}</span>
            <div className="flex gap-2">
              <SeverityBadge severity={insiden.severity} />
              <InsidenStatusBadge status={insiden.status} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{insiden.description}</p>
          <div className="text-xs text-muted-foreground flex flex-wrap gap-3">
            <InsidenCategoryBadge category={insiden.category} />
            {insiden.location && <span>Lokasi: {insiden.location}</span>}
            <span>Kejadian: {formatDate(insiden.incidentDate)}</span>
          </div>
          {insiden.adminNotes && (
            <div className="text-sm rounded bg-blue-50 p-2 border-l-2 border-blue-400">
              <span className="font-medium text-blue-800">Tindakan Admin:</span>{' '}
              <span className="text-blue-700">{insiden.adminNotes}</span>
            </div>
          )}
          {insiden.status === 'DILAPORKAN' && (
            <Button
              variant="outline"
              size="sm"
              className="self-start text-red-500"
              onClick={() => {
                if (confirm('Batalkan laporan ini?')) cancelMutation.mutate(insiden.id)
              }}
              disabled={cancelMutation.isPending}
            >
              <X className="w-4 h-4 mr-1" /> Batalkan
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
