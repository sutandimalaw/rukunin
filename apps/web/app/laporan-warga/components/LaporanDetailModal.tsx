'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  RefreshCcw,
  MapPin,
  Calendar,
  User,
} from 'lucide-react'
import { LaporanDetail } from '@/lib/api/laporan-warga'
import { useGetLaporanDetail, useUpdateLaporanStatus, useAddKomentar } from '../hooks/useLaporan'
import { useAuth } from '@/provider/auth-provider'
import { cn } from '@/lib/utils'

const STATUS_CONFIG = {
  MENUNGGU: { label: 'Menunggu', icon: Clock, className: 'bg-amber-100 text-amber-800' },
  DIPROSES: { label: 'Diproses', icon: AlertCircle, className: 'bg-blue-100 text-blue-800' },
  SELESAI: { label: 'Selesai', icon: CheckCircle2, className: 'bg-green-100 text-green-800' },
}

const KATEGORI_LABEL: Record<string, string> = {
  INFRASTRUKTUR: 'Infrastruktur',
  KEBERSIHAN: 'Kebersihan',
  KEAMANAN: 'Keamanan',
  SOSIAL: 'Sosial',
  LAINNYA: 'Lainnya',
}

const PRIORITAS_CONFIG: Record<string, { label: string; className: string }> = {
  PENTING: { label: 'Penting', className: 'bg-orange-100 text-orange-800' },
  NORMAL: { label: 'Normal', className: 'bg-gray-100 text-gray-800' },
  RENDAH: { label: 'Rendah', className: 'bg-green-100 text-green-700' },
}

interface Props {
  laporanId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isAdminView?: boolean
}

export function LaporanDetailModal({ laporanId, open, onOpenChange, isAdminView = false }: Props) {
  const { user } = useAuth()
  const { data: laporan, isLoading } = useGetLaporanDetail(laporanId)
  const updateStatus = useUpdateLaporanStatus()
  const addKomentar = useAddKomentar(laporanId ?? '')

  const [newStatus, setNewStatus] = useState('')
  const [komentar, setKomentar] = useState('')

  const handleUpdateStatus = async () => {
    if (!newStatus || !laporanId) return
    await updateStatus.mutateAsync({ id: laporanId, status: newStatus })
    setNewStatus('')
  }

  const handleAddKomentar = async () => {
    if (!komentar.trim() || !laporanId) return
    await addKomentar.mutateAsync(komentar.trim())
    setKomentar('')
  }

  const statusCfg = laporan ? STATUS_CONFIG[laporan.status as keyof typeof STATUS_CONFIG] : null
  const StatusIcon = statusCfg?.icon ?? Clock

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Laporan</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {laporan && (
          <div className="space-y-5">
            {/* Header Info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <Badge variant="outline" className="font-mono text-xs">{laporan.nomorLaporan}</Badge>
                {statusCfg && (
                  <Badge className={cn('gap-1', statusCfg.className)}>
                    <StatusIcon className="h-3 w-3" />
                    {statusCfg.label}
                  </Badge>
                )}
              </div>

              <h2 className="text-lg font-semibold">{laporan.judul}</h2>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{KATEGORI_LABEL[laporan.kategori] ?? laporan.kategori}</Badge>
                {PRIORITAS_CONFIG[laporan.prioritas] && (
                  <Badge className={PRIORITAS_CONFIG[laporan.prioritas].className}>
                    {PRIORITAS_CONFIG[laporan.prioritas].label}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {laporan.submitterName}
                  {laporan.rtPerlapor && ` · ${laporan.rtPerlapor}`}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(laporan.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                {laporan.lokasi && (
                  <span className="flex items-center gap-1.5 col-span-2">
                    <MapPin className="h-3.5 w-3.5" />
                    {laporan.lokasi}
                  </span>
                )}
              </div>
            </div>

            <Separator />

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Deskripsi</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{laporan.deskripsi}</p>
            </div>

            <Separator />

            {/* Timeline / Komentar */}
            {(laporan as LaporanDetail).komentar && (
              <div className="space-y-3">
                <p className="text-sm font-medium flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  Riwayat & Tanggapan
                </p>

                {(laporan as LaporanDetail).komentar.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Belum ada tanggapan</p>
                )}

                <div className="space-y-3">
                  {(laporan as LaporanDetail).komentar.map((k) => (
                    <div key={k.id} className={cn('rounded-lg p-3 text-sm', k.type === 'STATUS_CHANGE' ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-100')}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-medium flex items-center gap-1">
                          {k.type === 'STATUS_CHANGE' && <RefreshCcw className="h-3 w-3 text-blue-500" />}
                          {k.userName}
                          <span className="text-xs text-muted-foreground font-normal ml-1">({k.userRole})</span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(k.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{k.isi}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Actions */}
            {isAdminView && (
              <>
                <Separator />
                <div className="space-y-3">
                  <p className="text-sm font-medium">Tindakan Admin</p>

                  <div className="flex gap-2">
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Ubah status..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MENUNGGU">Menunggu</SelectItem>
                        <SelectItem value="DIPROSES">Diproses</SelectItem>
                        <SelectItem value="SELESAI">Selesai</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={handleUpdateStatus}
                      disabled={!newStatus || updateStatus.isPending}
                    >
                      {updateStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan'}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Tambah Tanggapan</Label>
                    <Textarea
                      placeholder="Tulis tanggapan..."
                      value={komentar}
                      onChange={(e) => setKomentar(e.target.value)}
                      rows={3}
                    />
                    <Button
                      className="w-full"
                      onClick={handleAddKomentar}
                      disabled={!komentar.trim() || addKomentar.isPending}
                    >
                      {addKomentar.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Kirim Tanggapan
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
