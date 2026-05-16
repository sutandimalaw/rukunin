'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, AlertCircle, CheckCircle2, MessageSquare } from 'lucide-react'
import { LaporanWarga } from '@/lib/api/laporan-warga'
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

interface Props {
  laporan: LaporanWarga
  onDetail: (id: string) => void
}

export function MyLaporanCard({ laporan, onDetail }: Props) {
  const statusCfg = STATUS_CONFIG[laporan.status as keyof typeof STATUS_CONFIG]
  const StatusIcon = statusCfg?.icon ?? Clock

  return (
    <Card
      className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
      onClick={() => onDetail(laporan.id)}
    >
      <CardContent className="p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm">{laporan.judul}</h3>
            <Badge variant="outline" className="font-mono text-xs">{laporan.nomorLaporan}</Badge>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {new Date(laporan.createdAt).toLocaleDateString('id-ID')}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {statusCfg && (
            <Badge className={cn('gap-1 text-xs', statusCfg.className)}>
              <StatusIcon className="h-3 w-3" />
              {statusCfg.label}
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">
            {KATEGORI_LABEL[laporan.kategori] ?? laporan.kategori}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{laporan.deskripsi}</p>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="h-3 w-3" />
            {laporan.komentarCount} tanggapan
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={(e) => { e.stopPropagation(); onDetail(laporan.id) }}
          >
            Lihat Detail
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
