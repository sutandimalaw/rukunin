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
import { useUpdateLayananStatus } from '../hooks/useUpdateLayananStatus'
import type { LayananWarga } from '@/lib/api/layanan-warga'

interface Props {
  layanan: LayananWarga
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateStatusModal({ layanan, open, onOpenChange }: Props) {
  const [status, setStatus] = useState<'PROSES' | 'SELESAI' | 'DITOLAK'>('PROSES')
  const [adminNotes, setAdminNotes] = useState(layanan.adminNotes ?? '')
  const { mutateAsync, isPending, error } = useUpdateLayananStatus()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await mutateAsync({
        id: layanan.id,
        data: { status, adminNotes: adminNotes || undefined },
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
            <DialogTitle>Update Status Layanan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-5">
            <div className="rounded-md border p-3 text-sm">
              <p className="font-medium">{layanan.subject}</p>
              <p className="text-muted-foreground mt-1">
                Dari:{' '}
                {layanan.requester.profile?.fullName ?? layanan.requester.email}
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status Baru</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as typeof status)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROSES">Diproses</SelectItem>
                  <SelectItem value="SELESAI">Selesai</SelectItem>
                  <SelectItem value="DITOLAK">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adminNotes">Catatan untuk Warga</Label>
              <Textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Contoh: Surat sudah siap diambil di RT, atau alasan penolakan"
                rows={4}
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
