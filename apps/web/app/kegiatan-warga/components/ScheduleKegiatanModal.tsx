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
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useScheduleKegiatan } from '../hooks/useScheduleKegiatan'
import type { KegiatanWarga } from '@/lib/api/kegiatan-warga'

interface Props {
  kegiatan: KegiatanWarga
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ScheduleKegiatanModal({ kegiatan, open, onOpenChange }: Props) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [location, setLocation] = useState('')
  const [force, setForce] = useState(false)
  const { mutateAsync, isPending, error } = useScheduleKegiatan()

  const quorumGap =
    kegiatan.minParticipants !== null
      ? kegiatan.minParticipants - kegiatan.voteCount
      : 0
  const quorumReached = quorumGap <= 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await mutateAsync({
        id: kegiatan.id,
        data: {
          startDate: new Date(startDate).toISOString(),
          endDate: endDate ? new Date(endDate).toISOString() : undefined,
          location: location || undefined,
          force,
        },
      })
      onOpenChange(false)
    } catch {
      // error ditampilkan via error state
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Jadwalkan Kegiatan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-5">
            <div className="rounded-md border p-3 text-sm">
              <p className="font-medium">{kegiatan.title}</p>
              <p className="text-muted-foreground mt-1">
                Vote: {kegiatan.voteCount}
                {kegiatan.minParticipants !== null && ` / ${kegiatan.minParticipants}`}
                {kegiatan.minParticipants !== null && (
                  <span className={quorumReached ? ' text-green-600' : ' text-amber-600'}>
                    {' '}— {quorumReached ? 'Quorum tercapai' : `Kurang ${quorumGap} peserta`}
                  </span>
                )}
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startDate">Tanggal & Waktu Mulai</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">Tanggal & Waktu Selesai (opsional)</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Lapangan Badminton RT 04"
              />
            </div>
            {!quorumReached && kegiatan.minParticipants !== null && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="force"
                  checked={force}
                  onCheckedChange={(v) => setForce(!!v)}
                />
                <Label htmlFor="force" className="cursor-pointer text-sm">
                  Tetap jadwalkan walaupun quorum belum tercapai
                </Label>
              </div>
            )}
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button type="button" variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Menjadwalkan...' : 'Jadwalkan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
