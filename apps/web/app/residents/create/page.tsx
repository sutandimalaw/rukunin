'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle2, Search, Home, User, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { householdsApi, FAMILY_RELATIONS, type HouseholdWithMembers } from '@/lib/api/households'
import { residentsApi } from '@/lib/api/residents'
import { useQueryClient } from '@tanstack/react-query'
import { gender as genderOptions, marialStatus, houstType, ownershipStatus } from './constanta'

type Step = 1 | 2 | 3

interface HouseholdForm {
  kkNumber: string
  blok: string
  rt: string
  houseNumber: string
  houseType: string
  ownershipStatus: string
  startDateOfOccupancy: string
}

interface ResidentForm {
  fullName: string
  idNumber: string
  gender: string
  dateOfBirth: string
  maritalStatus: string
  occupation: string
  email: string
  familyRelation: string
}

function TambahWargaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  const [step, setStep] = useState<Step>(1)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingHousehold, setExistingHousehold] = useState<HouseholdWithMembers | null>(null)
  const [kkNotFound, setKkNotFound] = useState(false)

  const [hhForm, setHhForm] = useState<HouseholdForm>({
    kkNumber: searchParams.get('kkNumber') ?? '',
    blok: '',
    rt: '',
    houseNumber: '',
    houseType: '',
    ownershipStatus: '',
    startDateOfOccupancy: '',
  })

  const [resForm, setResForm] = useState<ResidentForm>({
    fullName: '',
    idNumber: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    occupation: '',
    email: '',
    familyRelation: existingHousehold ? 'LAINNYA' : 'KEPALA_KELUARGA',
  })

  // If opened from KK detail page with a pre-filled kkNumber, auto-lookup
  useEffect(() => {
    const prefilledKk = searchParams.get('kkNumber')
    if (prefilledKk) {
      handleKkLookup(prefilledKk)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleKkLookup(kkNumber?: string) {
    const kk = kkNumber ?? hhForm.kkNumber
    if (kk.length < 11) {
      toast.error('Nomor KK minimal 11 karakter')
      return
    }
    setIsLookingUp(true)
    setExistingHousehold(null)
    setKkNotFound(false)
    try {
      const result = await householdsApi.getByKkNumber(kk)
      if (result) {
        setExistingHousehold(result)
        setResForm((f) => ({ ...f, familyRelation: 'LAINNYA' }))
        setStep(3)
      } else {
        setKkNotFound(true)
        setStep(2)
      }
    } catch {
      setKkNotFound(true)
      setStep(2)
    } finally {
      setIsLookingUp(false)
    }
  }

  async function handleSubmit() {
    if (!resForm.fullName || !resForm.gender || !resForm.familyRelation) {
      toast.error('Nama, jenis kelamin, dan relasi wajib diisi')
      return
    }
    setIsSubmitting(true)
    try {
      if (existingHousehold) {
        // Tambah anggota ke KK yang sudah ada
        await residentsApi.create({
          fullName: resForm.fullName,
          idNumber: resForm.idNumber || undefined,
          gender: resForm.gender,
          dateOfBirth: resForm.dateOfBirth || undefined,
          maritalStatus: resForm.maritalStatus || undefined,
          occupation: resForm.occupation || undefined,
          email: resForm.email || undefined,
          householdId: existingHousehold.id,
          familyRelation: resForm.familyRelation,
        })
      } else {
        // KK baru + Kepala Keluarga
        await householdsApi.createWithHead({
          household: {
            kkNumber: hhForm.kkNumber,
            blok: hhForm.blok || undefined,
            rt: hhForm.rt || undefined,
            houseNumber: hhForm.houseNumber || undefined,
            houseType: hhForm.houseType || undefined,
            ownershipStatus: hhForm.ownershipStatus || undefined,
            startDateOfOccupancy: hhForm.startDateOfOccupancy || undefined,
          },
          head: {
            fullName: resForm.fullName,
            idNumber: resForm.idNumber || undefined,
            gender: resForm.gender,
            dateOfBirth: resForm.dateOfBirth || undefined,
            maritalStatus: resForm.maritalStatus || undefined,
            occupation: resForm.occupation || undefined,
            email: resForm.email || undefined,
          },
        })
      }

      await queryClient.invalidateQueries({ queryKey: ['residents'] })
      await queryClient.invalidateQueries({ queryKey: ['households'] })
      toast.success('Warga berhasil ditambahkan!')
      router.push('/residents')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepLabels = ['Nomor KK', 'Data Rumah', 'Data Warga']

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/residents">Data Warga</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Tambah Warga</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4 pt-2 max-w-2xl">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {stepLabels.map((label, i) => {
            const s = (i + 1) as Step
            const done = step > s
            const active = step === s
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 text-sm font-medium ${active ? 'text-foreground' : done ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 ${active ? 'border-primary bg-primary text-primary-foreground' : done ? 'border-muted-foreground bg-muted-foreground text-background' : 'border-muted-foreground/30'}`}>
                    {done ? '✓' : s}
                  </div>
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                )}
              </div>
            )
          })}
        </div>

        {/* Step 1: KK Lookup */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Search className="h-4 w-4" />
                Langkah 1 — Nomor Kartu Keluarga
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="kkNumber">Nomor KK</Label>
                <div className="flex gap-2">
                  <Input
                    id="kkNumber"
                    placeholder="Contoh: 3201234567890001"
                    value={hhForm.kkNumber}
                    onChange={(e) => setHhForm((f) => ({ ...f, kkNumber: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleKkLookup()}
                    className="font-mono"
                  />
                  <Button onClick={() => handleKkLookup()} disabled={isLookingUp}>
                    {isLookingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cek'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Masukkan nomor KK untuk mengecek apakah sudah terdaftar di sistem.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Data Rumah (new KK) */}
        {step === 2 && kkNotFound && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Home className="h-4 w-4" />
                Langkah 2 — Data Rumah
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                KK <span className="font-mono font-medium">{hhForm.kkNumber}</span> belum terdaftar. Lengkapi info rumah.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Blok</Label>
                  <Input
                    placeholder="cth: SB-3"
                    value={hhForm.blok}
                    onChange={(e) => setHhForm((f) => ({ ...f, blok: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>RT</Label>
                  <Input
                    placeholder="cth: 04"
                    value={hhForm.rt}
                    onChange={(e) => setHhForm((f) => ({ ...f, rt: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Nomor Rumah</Label>
                  <Input
                    placeholder="cth: 15"
                    value={hhForm.houseNumber}
                    onChange={(e) => setHhForm((f) => ({ ...f, houseNumber: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Tipe Rumah</Label>
                  <Select
                    value={hhForm.houseType}
                    onValueChange={(v) => setHhForm((f) => ({ ...f, houseType: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {houstType.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Status Kepemilikan</Label>
                  <Select
                    value={hhForm.ownershipStatus}
                    onValueChange={(v) => setHhForm((f) => ({ ...f, ownershipStatus: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      {ownershipStatus.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Tanggal Mulai Tinggal</Label>
                  <Input
                    type="date"
                    value={hhForm.startDateOfOccupancy}
                    onChange={(e) => setHhForm((f) => ({ ...f, startDateOfOccupancy: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setStep(1)}>Kembali</Button>
                <Button onClick={() => setStep(3)}>Lanjut</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Data Warga */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Langkah 3 — Data Warga
              </CardTitle>
              {existingHousehold && (
                <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  <div>
                    <span className="font-medium">KK ditemukan:</span>{' '}
                    <span className="font-mono">{existingHousehold.kkNumber}</span>
                    {' · '}
                    {existingHousehold.blok && `Blok ${existingHousehold.blok}`}
                    {existingHousehold.houseNumber && ` No ${existingHousehold.houseNumber}`}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {existingHousehold.members.length} anggota
                    </Badge>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="fullName">Nama Lengkap <span className="text-destructive">*</span></Label>
                  <Input
                    id="fullName"
                    value={resForm.fullName}
                    onChange={(e) => setResForm((f) => ({ ...f, fullName: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>No KTP</Label>
                  <Input
                    value={resForm.idNumber}
                    onChange={(e) => setResForm((f) => ({ ...f, idNumber: e.target.value }))}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Jenis Kelamin <span className="text-destructive">*</span></Label>
                  <Select
                    value={resForm.gender}
                    onValueChange={(v) => setResForm((f) => ({ ...f, gender: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((g) => (
                        <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Tanggal Lahir</Label>
                  <Input
                    type="date"
                    value={resForm.dateOfBirth}
                    onChange={(e) => setResForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Status Pernikahan</Label>
                  <Select
                    value={resForm.maritalStatus}
                    onValueChange={(v) => setResForm((f) => ({ ...f, maritalStatus: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      {marialStatus.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Pekerjaan</Label>
                  <Input
                    value={resForm.occupation}
                    onChange={(e) => setResForm((f) => ({ ...f, occupation: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={resForm.email}
                    onChange={(e) => setResForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Relasi dalam KK <span className="text-destructive">*</span></Label>
                  <Select
                    value={resForm.familyRelation}
                    onValueChange={(v) => setResForm((f) => ({ ...f, familyRelation: v }))}
                    disabled={!existingHousehold}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih relasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {FAMILY_RELATIONS.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!existingHousehold && (
                    <p className="text-xs text-muted-foreground">
                      Warga pertama otomatis menjadi Kepala Keluarga.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(existingHousehold ? 1 : 2)}
                >
                  Kembali
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                  Simpan Warga
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </SidebarInset>
  )
}

export default function TambahWargaPage() {
  return (
    <Suspense>
      <TambahWargaContent />
    </Suspense>
  )
}
