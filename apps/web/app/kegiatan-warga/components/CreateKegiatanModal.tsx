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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CirclePlus } from 'lucide-react'
import { useCreateKegiatan } from '../hooks/useCreateKegiatan'

const CATEGORIES = [
  { value: 'umum', label: 'Umum' },
  { value: 'olahraga', label: 'Olahraga' },
  { value: 'gotong_royong', label: 'Gotong Royong' },
  { value: 'arisan', label: 'Arisan' },
  { value: 'sosial', label: 'Sosial' },
  { value: 'pendidikan', label: 'Pendidikan' },
  { value: 'keamanan', label: 'Keamanan' },
  { value: 'kebersihan', label: 'Kebersihan' },
]

const RECURRENCE_OPTIONS = [
  { value: '', label: 'Tidak berulang' },
  { value: 'WEEKLY:SUNDAY', label: 'Setiap Minggu' },
  { value: 'WEEKLY:MONDAY', label: 'Setiap Senin' },
  { value: 'WEEKLY:TUESDAY', label: 'Setiap Selasa' },
  { value: 'WEEKLY:WEDNESDAY', label: 'Setiap Rabu' },
  { value: 'WEEKLY:THURSDAY', label: 'Setiap Kamis' },
  { value: 'WEEKLY:FRIDAY', label: 'Setiap Jumat' },
  { value: 'WEEKLY:SATURDAY', label: 'Setiap Sabtu' },
  { value: 'MONTHLY:1', label: 'Setiap tanggal 1' },
]

export function CreateKegiatanModal() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('umum')
  const [minParticipants, setMinParticipants] = useState('')
  const [voteDeadline, setVoteDeadline] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrenceRule, setRecurrenceRule] = useState('')
  const { mutateAsync, isPending, error } = useCreateKegiatan()

  const reset = () => {
    setTitle('')
    setDescription('')
    setCategory('umum')
    setMinParticipants('')
    setVoteDeadline('')
    setIsRecurring(false)
    setRecurrenceRule('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await mutateAsync({
        title,
        description,
        category,
        minParticipants: minParticipants ? parseInt(minParticipants, 10) : undefined,
        voteDeadline: voteDeadline ? new Date(voteDeadline).toISOString() : undefined,
        isRecurring,
        recurrenceRule: isRecurring && recurrenceRule ? recurrenceRule : undefined,
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
        <Button variant="outline">
          Buat Kegiatan <CirclePlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Buat Usulan Kegiatan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-5 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Badminton Sabtu Sore"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Kategori</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan kegiatan, perlengkapan yang dibutuhkan, dll"
                rows={4}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="minParticipants">Min. Peserta (Quorum)</Label>
                <Input
                  id="minParticipants"
                  type="number"
                  min="1"
                  value={minParticipants}
                  onChange={(e) => setMinParticipants(e.target.value)}
                  placeholder="Opsional"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="voteDeadline">Batas Waktu Vote</Label>
                <Input
                  id="voteDeadline"
                  type="datetime-local"
                  value={voteDeadline}
                  onChange={(e) => setVoteDeadline(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isRecurring"
                checked={isRecurring}
                onCheckedChange={(v) => setIsRecurring(!!v)}
              />
              <Label htmlFor="isRecurring" className="cursor-pointer">
                Kegiatan Rutin (berulang)
              </Label>
            </div>
            {isRecurring && (
              <div className="grid gap-2">
                <Label htmlFor="recurrenceRule">Pola Pengulangan</Label>
                <Select value={recurrenceRule} onValueChange={setRecurrenceRule}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pola" />
                  </SelectTrigger>
                  <SelectContent>
                    {RECURRENCE_OPTIONS.filter((o) => o.value).map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
