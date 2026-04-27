'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CirclePlus } from 'lucide-react'
import {
  POSISI_OPTIONS,
  type CreatePengurusData,
  type Pengurus,
  type PosisiPengurus,
  type UpdatePengurusData,
} from '@/lib/api/pengurus'
import { useCreatePengurus } from '../hooks/useCreatePengurus'
import { useUpdatePengurus } from '../hooks/useUpdatePengurus'
import { useGetActiveUsers } from '../hooks/useGetActiveUsers'

const MANUAL_VALUE = '__manual__'

interface Props {
  initial?: Pengurus
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function PengurusForm({
  initial,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = (v: boolean) => {
    if (isControlled) onOpenChange?.(v)
    else setInternalOpen(v)
  }

  const isEdit = !!initial

  const createMutation = useCreatePengurus()
  const updateMutation = useUpdatePengurus()
  const activeUsersQuery = useGetActiveUsers()

  const [posisi, setPosisi] = useState<PosisiPengurus>(
    initial?.posisi ?? 'KETUA',
  )
  const [customPosisi, setCustomPosisi] = useState(initial?.customPosisi ?? '')
  const [urutan, setUrutan] = useState(initial?.urutan ?? 0)
  const [userId, setUserId] = useState<string>(initial?.userId ?? MANUAL_VALUE)
  const [fullName, setFullName] = useState(initial?.fullName ?? '')
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp ?? '')
  const [photoUrl, setPhotoUrl] = useState(initial?.photoUrl ?? '')
  const currentYear = new Date().getFullYear()
  const [periodeStart, setPeriodeStart] = useState(
    initial?.periodeStart ?? currentYear,
  )
  const [periodeEnd, setPeriodeEnd] = useState(
    initial?.periodeEnd ?? currentYear + 3,
  )
  const [isActive, setIsActive] = useState(initial?.isActive ?? true)
  const [notes, setNotes] = useState(initial?.notes ?? '')

  useEffect(() => {
    if (!open) return
    setPosisi(initial?.posisi ?? 'KETUA')
    setCustomPosisi(initial?.customPosisi ?? '')
    setUrutan(initial?.urutan ?? 0)
    setUserId(initial?.userId ?? MANUAL_VALUE)
    setFullName(initial?.fullName ?? '')
    setWhatsapp(initial?.whatsapp ?? '')
    setPhotoUrl(initial?.photoUrl ?? '')
    setPeriodeStart(initial?.periodeStart ?? currentYear)
    setPeriodeEnd(initial?.periodeEnd ?? currentYear + 3)
    setIsActive(initial?.isActive ?? true)
    setNotes(initial?.notes ?? '')
  }, [open, initial, currentYear])

  const handleUserChange = (value: string) => {
    setUserId(value)
    if (value !== MANUAL_VALUE) {
      const picked = activeUsersQuery.data?.find((u) => u.id === value)
      if (picked) {
        const name = picked.profile?.fullName ?? picked.email
        if (!fullName.trim() || !isEdit) setFullName(name)
      }
    }
  }

  const error = createMutation.error ?? updateMutation.error
  const isPending = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: CreatePengurusData = {
      posisi,
      customPosisi:
        posisi === 'LAINNYA' && customPosisi ? customPosisi : undefined,
      urutan,
      userId: userId === MANUAL_VALUE ? undefined : userId,
      fullName,
      whatsapp: whatsapp || undefined,
      photoUrl: photoUrl || undefined,
      periodeStart,
      periodeEnd,
      isActive,
      notes: notes || undefined,
    }
    try {
      if (isEdit && initial) {
        const updatePayload: UpdatePengurusData = {
          ...payload,
          userId: userId === MANUAL_VALUE ? null : userId,
        }
        await updateMutation.mutateAsync({ id: initial.id, data: updatePayload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      setOpen(false)
    } catch {
      // ditampilkan via state
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {!trigger && !isControlled && (
        <DialogTrigger asChild>
          <Button>
            Tambah Pengurus <CirclePlus />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[640px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Pengurus' : 'Tambah Pengurus'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-5 max-h-[65vh] overflow-y-auto pr-2">
            <div className="grid gap-2">
              <Label htmlFor="posisi">Jabatan</Label>
              <Select
                value={posisi}
                onValueChange={(v) => setPosisi(v as PosisiPengurus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POSISI_OPTIONS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {posisi === 'LAINNYA' && (
              <div className="grid gap-2">
                <Label htmlFor="customPosisi">Nama Jabatan Kustom</Label>
                <Input
                  id="customPosisi"
                  value={customPosisi}
                  onChange={(e) => setCustomPosisi(e.target.value)}
                  placeholder="Contoh: Penasehat"
                  required
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="userId">Link ke Akun Warga (opsional)</Label>
              <Select value={userId} onValueChange={handleUserChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MANUAL_VALUE}>
                    — Manual (tidak link akun) —
                  </SelectItem>
                  {activeUsersQuery.data?.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.profile?.fullName ?? u.email} · {u.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Pilih akun warga kalau pengurus sudah terdaftar di sistem,
                atau biarkan manual untuk pengurus yang belum punya akun.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Pak Budi Santoso"
                required
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
              <div className="grid gap-2">
                <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="urutan">Urutan</Label>
                <Input
                  id="urutan"
                  type="number"
                  min={0}
                  value={urutan}
                  onChange={(e) => setUrutan(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="photoUrl">URL Foto (opsional)</Label>
              <Input
                id="photoUrl"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
              <div className="grid gap-2">
                <Label htmlFor="periodeStart">Periode Mulai (Tahun)</Label>
                <Input
                  id="periodeStart"
                  type="number"
                  min={1900}
                  value={periodeStart}
                  onChange={(e) => setPeriodeStart(Number(e.target.value))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="periodeEnd">Periode Selesai (Tahun)</Label>
                <Input
                  id="periodeEnd"
                  type="number"
                  min={1900}
                  value={periodeEnd}
                  onChange={(e) => setPeriodeEnd(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(v) => setIsActive(!!v)}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Pengurus aktif (tampil di portal warga)
              </Label>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Catatan (opsional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
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
