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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUpdatePenyediaJasaStatus } from '../hooks/useUpdatePenyediaJasaStatus'
import type { PenyediaJasa } from '@/lib/api/penyedia-jasa'

interface Props {
  item: PenyediaJasa
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApproveModal({ item, open, onOpenChange }: Props) {
  const [status, setStatus] = useState<'ACTIVE' | 'REJECTED'>('ACTIVE')
  const [adminNotes, setAdminNotes] = useState(item.adminNotes ?? '')
  const { mutateAsync, isPending, error } = useUpdatePenyediaJasaStatus()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await mutateAsync({
        id: item.id,
        data: { status, adminNotes: adminNotes || undefined },
      })
      onOpenChange(false)
    } catch {
      // ditampilkan via state
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Review Rekomendasi Penyedia Jasa</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-5">
            <div className="rounded-md border p-3 text-sm">
              <p className="font-medium">{item.personName}</p>
              <p className="text-muted-foreground mt-1">
                Direkomendasikan oleh:{' '}
                {item.submitter.profile?.fullName ?? item.submitter.email}
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Keputusan</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as typeof status)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">
                    Setujui — Tampilkan di direktori
                  </SelectItem>
                  <SelectItem value="REJECTED">Tolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Catatan untuk Perekomendasi</Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={
                  status === 'REJECTED'
                    ? 'Jelaskan alasan penolakan...'
                    : 'Opsional: pesan untuk perekomendasi'
                }
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
