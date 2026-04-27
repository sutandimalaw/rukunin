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
import { Badge } from '@/components/ui/badge'
import StatCard from '@/components/shared/StatCard'
import {
  CirclePlus,
  Shield,
  Users,
  AlertTriangle,
  Phone,
  LogOut,
  Trash2,
  Pencil,
  UserPlus,
} from 'lucide-react'
import { useGetKeamananSummary } from './hooks/useGetKeamananSummary'
import { useGetPetugas } from './hooks/useGetPetugas'
import { useCreatePetugas, useUpdatePetugas, useDeletePetugas } from './hooks/usePetugas'
import { useGetBukuTamu } from './hooks/useGetBukuTamu'
import { useCreateTamu, useCheckOutTamu } from './hooks/useBukuTamu'
import { useGetInsiden } from './hooks/useGetInsiden'
import { useUpdateInsidenStatus } from './hooks/useInsiden'
import {
  SeverityBadge,
  InsidenStatusBadge,
  InsidenCategoryBadge,
  INSIDEN_CATEGORY_OPTIONS,
  formatDateTime,
  formatDate,
} from './components/KeamananBadges'
import type { PetugasKeamanan, InsidenStatus, LaporanInsiden } from '@/lib/api/keamanan'

// ─── Tambah Petugas Modal ─────────────────────────────────────────────────

function TambahPetugasModal() {
  const [open, setOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [shift, setShift] = useState('PAGI')
  const [shiftTime, setShiftTime] = useState('06:00-14:00')
  const [whatsapp, setWhatsapp] = useState('')
  const { mutateAsync, isPending, error } = useCreatePetugas()

  const shiftTimeMap: Record<string, string> = {
    PAGI: '06:00-14:00',
    SIANG: '14:00-22:00',
    MALAM: '22:00-06:00',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await mutateAsync({
        fullName,
        shift,
        shiftTime,
        whatsapp: whatsapp || undefined,
        isOnDuty: false,
      })
      setFullName('')
      setShift('PAGI')
      setShiftTime('06:00-14:00')
      setWhatsapp('')
      setOpen(false)
    } catch { /* error state */ }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <CirclePlus className="w-4 h-4 mr-2" /> Tambah Petugas
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Petugas Keamanan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <Label>Nama Lengkap</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label>Shift</Label>
              <Select
                value={shift}
                onValueChange={(v) => {
                  setShift(v)
                  setShiftTime(shiftTimeMap[v] ?? '06:00-14:00')
                }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAGI">Pagi (06:00-14:00)</SelectItem>
                  <SelectItem value="SIANG">Siang (14:00-22:00)</SelectItem>
                  <SelectItem value="MALAM">Malam (22:00-06:00)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>No. WhatsApp</Label>
              <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="08123456789" />
            </div>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
            <Button type="submit" disabled={isPending}>{isPending ? 'Menyimpan...' : 'Tambah'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Catat Tamu Modal ─────────────────────────────────────────────────────

function CatatTamuModal() {
  const [open, setOpen] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [purpose, setPurpose] = useState('')
  const [destinationBlock, setDestinationBlock] = useState('')
  const [vehicleType, setVehicleType] = useState('TIDAK_ADA')
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [notes, setNotes] = useState('')
  const { mutateAsync, isPending, error } = useCreateTamu()

  const reset = () => {
    setGuestName('')
    setPurpose('')
    setDestinationBlock('')
    setVehicleType('TIDAK_ADA')
    setVehicleNumber('')
    setNotes('')
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
        notes: notes || undefined,
      })
      reset()
      setOpen(false)
    } catch { /* error state */ }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="w-4 h-4 mr-2" /> Catat Tamu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Catat Tamu Masuk</DialogTitle>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Blok Tujuan</Label>
                <Input value={destinationBlock} onChange={(e) => setDestinationBlock(e.target.value)} placeholder="Contoh: Blok A No. 5" />
              </div>
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
            </div>
            {vehicleType !== 'TIDAK_ADA' && (
              <div className="grid gap-2">
                <Label>No. Plat Kendaraan</Label>
                <Input value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="B 1234 XYZ" />
              </div>
            )}
            <div className="grid gap-2">
              <Label>Catatan (opsional)</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </div>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
            <Button type="submit" disabled={isPending}>{isPending ? 'Menyimpan...' : 'Catat Masuk'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function KeamananPage() {
  const { data: summary } = useGetKeamananSummary()
  const { data: petugasList } = useGetPetugas()
  const updatePetugas = useUpdatePetugas()
  const deletePetugas = useDeletePetugas()

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Manajemen Keamanan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Stat Cards */}
        <div className="grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Tamu Hari Ini"
            value={summary?.tamuHariIni ?? 0}
            icon={<Users className="w-5 h-5 text-blue-500" />}
          />
          <StatCard
            title="Insiden Aktif"
            value={summary?.insidenAktif ?? 0}
            icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
          />
          <StatCard
            title="Panic Button"
            value={summary?.panicButton ?? 0}
            icon={<Shield className="w-5 h-5 text-red-500" />}
            subtitle="Insiden darurat aktif"
          />
          <StatCard
            title="Petugas Bertugas"
            value={summary?.petugasBertugas ?? 0}
            icon={<Shield className="w-5 h-5 text-green-500" />}
          />
        </div>

        {/* Status Petugas Keamanan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Status Petugas Keamanan</span>
              <TambahPetugasModal />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!petugasList || petugasList.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada petugas terdaftar.</p>
            ) : (
              <div className="grid gap-3">
                {petugasList.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
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
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          p.isOnDuty
                            ? 'bg-green-100 text-green-800 hover:bg-green-100 cursor-pointer'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-100 cursor-pointer'
                        }
                        onClick={() =>
                          updatePetugas.mutate({
                            id: p.id,
                            data: { isOnDuty: !p.isOnDuty },
                          })
                        }
                      >
                        {p.isOnDuty ? 'Bertugas' : 'Tidak Bertugas'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => {
                          if (confirm(`Hapus petugas ${p.fullName}?`)) deletePetugas.mutate(p.id)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs: Buku Tamu & Laporan Insiden */}
        <Tabs defaultValue="tamu">
          <TabsList>
            <TabsTrigger value="tamu">Buku Tamu</TabsTrigger>
            <TabsTrigger value="insiden">Laporan Insiden</TabsTrigger>
          </TabsList>

          <TabsContent value="tamu">
            <BukuTamuTab />
          </TabsContent>

          <TabsContent value="insiden">
            <InsidenTab />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}

// ─── Buku Tamu Tab ─────────────────────────────────────────────────────────

function BukuTamuTab() {
  const today = new Date().toISOString().split('T')[0]
  const [dateFilter, setDateFilter] = useState(today)
  const { data, isLoading } = useGetBukuTamu({ date: dateFilter, limit: 50 })
  const checkOut = useCheckOutTamu()

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Label>Tanggal:</Label>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-44"
          />
        </div>
        <CatatTamuModal />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Memuat...</p>}
      {!isLoading && data?.data.length === 0 && (
        <p className="text-sm text-muted-foreground">Belum ada tamu tercatat.</p>
      )}

      <div className="grid gap-3">
        {data?.data.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex flex-col gap-1">
              <span className="font-medium">{t.guestName}</span>
              <span className="text-sm text-muted-foreground">
                Keperluan: {t.purpose}
                {t.destinationBlock ? ` · ${t.destinationBlock}` : ''}
              </span>
              <span className="text-xs text-muted-foreground">
                Masuk: {formatDateTime(t.checkInTime)}
                {t.checkOutTime ? ` · Keluar: ${formatDateTime(t.checkOutTime)}` : ''}
              </span>
              {t.vehicleType && t.vehicleType !== 'TIDAK_ADA' && (
                <span className="text-xs text-muted-foreground">
                  🚗 {t.vehicleType} {t.vehicleNumber ? `(${t.vehicleNumber})` : ''}
                </span>
              )}
            </div>
            <div>
              {!t.checkOutTime ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => checkOut.mutate(t.id)}
                  disabled={checkOut.isPending}
                >
                  <LogOut className="w-4 h-4 mr-1" /> Catat Keluar
                </Button>
              ) : (
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Sudah Keluar
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Insiden Tab ───────────────────────────────────────────────────────────

function InsidenTab() {
  const [statusFilter, setStatusFilter] = useState<string>('DILAPORKAN')
  const { data, isLoading } = useGetInsiden({
    status: statusFilter !== 'all' ? (statusFilter as InsidenStatus) : undefined,
    limit: 50,
  })
  const updateStatus = useUpdateInsidenStatus()
  const [notes, setNotes] = useState<Record<string, string>>({})

  const handleAction = (id: string, status: 'DITINDAK' | 'SELESAI' | 'DITUTUP') => {
    updateStatus.mutate({
      id,
      data: { status, adminNotes: notes[id] || undefined },
    })
    setNotes((prev) => ({ ...prev, [id]: '' }))
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="DILAPORKAN">Dilaporkan</TabsTrigger>
          <TabsTrigger value="DITINDAK">Ditindak</TabsTrigger>
          <TabsTrigger value="SELESAI">Selesai</TabsTrigger>
          <TabsTrigger value="DITUTUP">Ditutup</TabsTrigger>
          <TabsTrigger value="all">Semua</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading && <p className="text-sm text-muted-foreground">Memuat...</p>}
      {!isLoading && data?.data.length === 0 && (
        <p className="text-sm text-muted-foreground">Tidak ada data.</p>
      )}

      <div className="grid gap-3">
        {data?.data.map((insiden) => {
          const reporterName =
            insiden.reporter.profile?.fullName ?? insiden.reporter.email

          return (
            <Card key={insiden.id}>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{insiden.title}</span>
                  <div className="flex gap-2">
                    <SeverityBadge severity={insiden.severity} />
                    <InsidenStatusBadge status={insiden.status} />
                  </div>
                </CardTitle>
                <CardDescription>
                  <InsidenCategoryBadge category={insiden.category} />
                  <span className="ml-2">Pelapor: {reporterName}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <p>{insiden.description}</p>
                  {insiden.location && (
                    <p><span className="font-medium">Lokasi:</span> {insiden.location}</p>
                  )}
                  <p><span className="font-medium">Tanggal Kejadian:</span> {formatDate(insiden.incidentDate)}</p>
                  <p><span className="font-medium">Dilaporkan:</span> {formatDateTime(insiden.createdAt)}</p>
                  {insiden.adminNotes && (
                    <p><span className="font-medium">Catatan Admin:</span> {insiden.adminNotes}</p>
                  )}
                </div>

                {(insiden.status === 'DILAPORKAN' || insiden.status === 'DITINDAK') && (
                  <div className="mt-4 border-t pt-3 flex flex-col gap-3">
                    <Textarea
                      placeholder="Catatan tindakan (opsional)"
                      value={notes[insiden.id] ?? ''}
                      onChange={(e) =>
                        setNotes((prev) => ({ ...prev, [insiden.id]: e.target.value }))
                      }
                      rows={2}
                    />
                    <div className="flex gap-2 flex-wrap">
                      {insiden.status === 'DILAPORKAN' && (
                        <Button
                          size="sm"
                          onClick={() => handleAction(insiden.id, 'DITINDAK')}
                          disabled={updateStatus.isPending}
                        >
                          Tindak Lanjuti
                        </Button>
                      )}
                      {(insiden.status === 'DILAPORKAN' || insiden.status === 'DITINDAK') && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(insiden.id, 'SELESAI')}
                            disabled={updateStatus.isPending}
                          >
                            Selesai
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-gray-600"
                            onClick={() => handleAction(insiden.id, 'DITUTUP')}
                            disabled={updateStatus.isPending}
                          >
                            Tutup
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
