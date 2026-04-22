'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { residentsApi, type UpsertMyProfileData, type Resident } from '@/lib/api/residents'
import { useAuth } from '@/provider/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const genderOptions = [
  { label: 'Laki-laki', value: 'MEN' },
  { label: 'Perempuan', value: 'WOMAN' },
] as const

const maritalStatusOptions = [
  { label: 'Menikah', value: 'MARRIED' },
  { label: 'Lajang', value: 'SINGLE' },
  { label: 'Cerai', value: 'DIVORCED' },
] as const

const ownershipStatusOptions = [
  { label: 'Owner', value: 'OWNER' },
  { label: 'Sewa', value: 'RENT' },
] as const

export default function WargaProfilePage() {
  const router = useRouter()
  const { user, refreshUser } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [form, setForm] = useState<UpsertMyProfileData>({
    kkNumber: '',
    fullName: '',
    gender: 'MEN',
    blok: '',
    rt: '',
    houseNumber: '',
    houseType: '',
    ownershipStatus: '',
    idNumber: '',
    dateOfBirth: '',
    maritalStatus: '',
    occupation: '',
  })

  const isWarga = user?.role === 'WARGA'

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const profile = await residentsApi.getMyProfile()
        setForm((prev) => mapResidentToForm(profile, prev))
      } catch {
        // Profil belum ada — biarkan form kosong
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const canSubmit = useMemo(() => {
    return form.kkNumber.trim().length >= 11 && form.fullName.trim().length >= 3 && !!form.gender
  }, [form])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const payload: UpsertMyProfileData = {
        kkNumber: form.kkNumber.trim(),
        fullName: form.fullName.trim(),
        gender: form.gender,
        blok: normalizeOptional(form.blok),
        rt: normalizeOptional(form.rt),
        houseNumber: normalizeOptional(form.houseNumber),
        houseType: normalizeOptional(form.houseType),
        ownershipStatus: normalizeOptional(form.ownershipStatus),
        idNumber: normalizeOptional(form.idNumber),
        dateOfBirth: normalizeOptional(form.dateOfBirth),
        maritalStatus: normalizeOptional(form.maritalStatus),
        occupation: normalizeOptional(form.occupation),
      }

      await residentsApi.upsertMyProfile(payload)
      await refreshUser()

      setSuccess('Data berhasil disimpan.')

      if (isWarga) {
        router.replace('/portal')
      } else {
        router.replace('/')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Lengkapi Data Warga</CardTitle>
          <CardDescription>
            Data ini diperlukan agar kamu bisa melihat iuran dan informasi KK.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Memuat...</p>
          ) : (
            <form className="grid gap-6" onSubmit={onSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="kkNumber">Nomor KK</Label>
                  <Input
                    id="kkNumber"
                    value={form.kkNumber}
                    onChange={(e) => setForm((p) => ({ ...p, kkNumber: e.target.value }))}
                    placeholder="Contoh: 3201234567890001"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="idNumber">NIK (opsional)</Label>
                  <Input
                    id="idNumber"
                    value={form.idNumber ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, idNumber: e.target.value }))}
                    placeholder="Contoh: 3201234567890001"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Jenis Kelamin</Label>
                  <Select
                    value={form.gender}
                    onValueChange={(v) => setForm((p) => ({ ...p, gender: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dateOfBirth">Tanggal Lahir (opsional)</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Status Pernikahan (opsional)</Label>
                  <Select
                    value={form.maritalStatus || ''}
                    onValueChange={(v) => setForm((p) => ({ ...p, maritalStatus: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      {maritalStatusOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="occupation">Pekerjaan (opsional)</Label>
                  <Input
                    id="occupation"
                    value={form.occupation ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, occupation: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="blok">Blok (opsional)</Label>
                  <Input
                    id="blok"
                    value={form.blok ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, blok: e.target.value }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="rt">RT (opsional)</Label>
                  <Input
                    id="rt"
                    value={form.rt ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, rt: e.target.value }))}
                    placeholder="Contoh: 01"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="houseNumber">Nomor Rumah (opsional)</Label>
                  <Input
                    id="houseNumber"
                    value={form.houseNumber ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, houseNumber: e.target.value }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="houseType">Tipe Rumah (opsional)</Label>
                  <Input
                    id="houseType"
                    value={form.houseType ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, houseType: e.target.value }))}
                    placeholder="Contoh: SB-2"
                  />
                </div>

                <div className="grid gap-2 md:col-span-2">
                  <Label>Status Kepemilikan (opsional)</Label>
                  <Select
                    value={form.ownershipStatus || ''}
                    onValueChange={(v) => setForm((p) => ({ ...p, ownershipStatus: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      {ownershipStatusOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={!canSubmit || isSaving}>
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function normalizeOptional(value: string | undefined) {
  const v = (value ?? '').trim()
  return v.length ? v : undefined
}

function mapResidentToForm(resident: Resident, prev: UpsertMyProfileData): UpsertMyProfileData {
  return {
    ...prev,
    kkNumber: resident.household?.kkNumber ?? prev.kkNumber,
    blok: resident.household?.blok ?? '',
    rt: resident.household?.rt ?? '',
    houseNumber: resident.household?.houseNumber ?? '',
    houseType: resident.household?.houseType ?? '',
    ownershipStatus: resident.household?.ownershipStatus ?? '',

    fullName: resident.fullName ?? prev.fullName,
    idNumber: resident.idNumber ?? '',
    gender: resident.gender ?? prev.gender,
    dateOfBirth: resident.dateOfBirth ? resident.dateOfBirth.slice(0, 10) : '',
    maritalStatus: resident.maritalStatus ?? '',
    occupation: resident.occupation ?? '',
  }
}
