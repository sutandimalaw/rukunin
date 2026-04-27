'use client'

import { useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CirclePlus } from 'lucide-react'
import { useCreateLayanan } from '@/app/layanan-warga/hooks/useCreateLayanan'
import { LAYANAN_TYPES } from '@/app/layanan-warga/components/LayananBadges'
import type { LayananType } from '@/lib/api/layanan-warga'

export function CreateLayananModal() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<LayananType>('SURAT_KETERANGAN')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [purpose, setPurpose] = useState('')
  const [location, setLocation] = useState('')
  const { mutateAsync, isPending, error } = useCreateLayanan()

  const isSurat = type === 'SURAT_KETERANGAN'
  const isLaporan =
    type === 'LAPORAN_KERUSAKAN' || type === 'LAPORAN_KEAMANAN'

  const reset = () => {
    setType('SURAT_KETERANGAN')
    setSubject('')
    setDescription('')
    setPurpose('')
    setLocation('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await mutateAsync({
        type,
        subject,
        description,
        purpose: isSurat && purpose ? purpose : undefined,
        location: isLaporan && location ? location : undefined,
      })
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
          Ajukan Layanan <CirclePlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ajukan Layanan Baru</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-5 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid gap-2">
              <Label htmlFor="type">Jenis Layanan</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as LayananType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LAYANAN_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Judul Singkat</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={
                  isSurat
                    ? 'Contoh: Surat Keterangan Domisili'
                    : 'Contoh: Lampu jalan blok A mati'
                }
                required
              />
            </div>
            {isSurat && (
              <div className="grid gap-2">
                <Label htmlFor="purpose">Tujuan Surat</Label>
                <Input
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Contoh: Pendaftaran sekolah anak"
                />
              </div>
            )}
            {isLaporan && (
              <div className="grid gap-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Depan rumah blok A no. 5"
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="description">Detail</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan detail permohonan/laporan kamu"
                rows={5}
                required
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
              {isPending ? 'Mengirim...' : 'Kirim'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
