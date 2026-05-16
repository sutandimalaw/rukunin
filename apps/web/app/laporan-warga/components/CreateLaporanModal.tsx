'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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
import { useCreateLaporan } from '../hooks/useLaporan'
import { LaporanKategori, LaporanPrioritas } from '@/lib/api/laporan-warga'
import { useAuth } from '@/provider/auth-provider'

const KATEGORI_OPTIONS: { label: string; value: LaporanKategori }[] = [
  { label: 'Infrastruktur', value: 'INFRASTRUKTUR' },
  { label: 'Kebersihan', value: 'KEBERSIHAN' },
  { label: 'Keamanan', value: 'KEAMANAN' },
  { label: 'Sosial', value: 'SOSIAL' },
  { label: 'Lainnya', value: 'LAINNYA' },
]

const PRIORITAS_OPTIONS: { label: string; value: LaporanPrioritas }[] = [
  { label: 'Penting', value: 'PENTING' },
  { label: 'Normal', value: 'NORMAL' },
  { label: 'Rendah', value: 'RENDAH' },
]

const RT_OPTIONS = ['RT 1', 'RT 2', 'RT 3', 'RT 4', 'RT 5']

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateLaporanModal({ open, onOpenChange }: Props) {
  const { user } = useAuth()
  const { mutateAsync, isPending, error } = useCreateLaporan()

  const [judul, setJudul] = useState('')
  const [kategori, setKategori] = useState<LaporanKategori>('INFRASTRUKTUR')
  const [prioritas, setPrioritas] = useState<LaporanPrioritas>('NORMAL')
  const [deskripsi, setDeskripsi] = useState('')
  const [lokasi, setLokasi] = useState('')
  const [namaPerlapor, setNamaPerlapor] = useState('')
  const [rtPerlapor, setRtPerlapor] = useState('')

  const reset = () => {
    setJudul('')
    setKategori('INFRASTRUKTUR')
    setPrioritas('NORMAL')
    setDeskripsi('')
    setLokasi('')
    setNamaPerlapor('')
    setRtPerlapor('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await mutateAsync({
        judul,
        kategori,
        prioritas,
        deskripsi,
        lokasi: lokasi || undefined,
        namaPerlapor: namaPerlapor || undefined,
        rtPerlapor: rtPerlapor || undefined,
      })
      reset()
      onOpenChange(false)
    } catch {
      // error displayed below
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Buat Laporan Baru</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 mt-5 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid gap-2">
              <Label htmlFor="judul">Judul Laporan <span className="text-red-500">*</span></Label>
              <Input
                id="judul"
                placeholder="Contoh: Jalan rusak di RT 3"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Kategori <span className="text-red-500">*</span></Label>
                <Select value={kategori} onValueChange={(v) => setKategori(v as LaporanKategori)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {KATEGORI_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Prioritas</Label>
                <Select value={prioritas} onValueChange={(v) => setPrioritas(v as LaporanPrioritas)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITAS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deskripsi">Deskripsi <span className="text-red-500">*</span></Label>
              <Textarea
                id="deskripsi"
                placeholder="Jelaskan masalah secara detail (minimal 20 karakter)"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                rows={4}
                required
                minLength={20}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lokasi">Lokasi Kejadian</Label>
              <Input
                id="lokasi"
                placeholder="Contoh: Depan Balai RT, Blok A No. 5"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="foto">Foto / Lampiran</Label>
              <Input
                id="foto"
                type="file"
                accept="image/*"
                multiple
                disabled
                className="cursor-not-allowed opacity-60"
              />
              <p className="text-xs text-muted-foreground">Upload foto akan tersedia segera</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="namaPerlapor">Nama Pelapor</Label>
                <Input
                  id="namaPerlapor"
                  placeholder="Nama Anda"
                  value={namaPerlapor}
                  onChange={(e) => setNamaPerlapor(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>RT Pelapor</Label>
                <Select value={rtPerlapor} onValueChange={setRtPerlapor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih RT" />
                  </SelectTrigger>
                  <SelectContent>
                    {RT_OPTIONS.map((rt) => (
                      <SelectItem key={rt} value={rt}>{rt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500">{(error as Error).message}</p>
            )}
          </div>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button type="button" variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Mengirim...' : 'Kirim Laporan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
