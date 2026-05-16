'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, AlertCircle, CheckCircle2, MessageSquare, User } from 'lucide-react'
import { LaporanWarga } from '@/lib/api/laporan-warga'
import { cn } from '@/lib/utils'

const STATUS_CONFIG = {
  MENUNGGU: { label: 'Menunggu', icon: Clock, className: 'bg-amber-100 text-amber-800' },
  DIPROSES: { label: 'Diproses', icon: AlertCircle, className: 'bg-blue-100 text-blue-800' },
  SELESAI: { label: 'Selesai', icon: CheckCircle2, className: 'bg-green-100 text-green-800' },
}

const KATEGORI_CONFIG: Record<string, { label: string; className: string }> = {
  INFRASTRUKTUR: { label: 'Infrastruktur', className: 'bg-emerald-100 text-emerald-800' },
  KEBERSIHAN: { label: 'Kebersihan', className: 'bg-teal-100 text-teal-800' },
  KEAMANAN: { label: 'Keamanan', className: 'bg-purple-100 text-purple-800' },
  SOSIAL: { label: 'Sosial', className: 'bg-sky-100 text-sky-800' },
  LAINNYA: { label: 'Lainnya', className: 'bg-gray-100 text-gray-700' },
}

const PRIORITAS_CONFIG: Record<string, { label: string; className: string }> = {
  PENTING: { label: 'Penting', className: 'bg-orange-100 text-orange-800' },
  NORMAL: { label: 'Normal', className: 'bg-gray-100 text-gray-600' },
  RENDAH: { label: 'Rendah', className: 'bg-green-100 text-green-700' },
}

interface Props {
  laporan: LaporanWarga
  onDetail: (id: string) => void
}

export function LaporanCard({ laporan, onDetail }: Props) {
  const statusCfg = STATUS_CONFIG[laporan.status as keyof typeof STATUS_CONFIG]
  const StatusIcon = statusCfg?.icon ?? Clock
  const kategoriCfg = KATEGORI_CONFIG[laporan.kategori]
  const prioritasCfg = PRIORITAS_CONFIG[laporan.prioritas]

  return (
    <Card
      className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
      onClick={() => onDetail(laporan.id)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm leading-snug">{laporan.judul}</h3>
            <Badge variant="outline" className="font-mono text-xs">{laporan.nomorLaporan}</Badge>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {new Date(laporan.createdAt).toLocaleDateString('id-ID')}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {statusCfg && (
            <Badge className={cn('gap-1 text-xs', statusCfg.className)}>
              <StatusIcon className="h-3 w-3" />
              {statusCfg.label}
            </Badge>
          )}
          {kategoriCfg && (
            <Badge className={cn('text-xs', kategoriCfg.className)}>{kategoriCfg.label}</Badge>
          )}
          {prioritasCfg && prioritasCfg.label !== 'Normal' && (
            <Badge className={cn('text-xs', prioritasCfg.className)}>{prioritasCfg.label}</Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">{laporan.deskripsi}</p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            {laporan.submitterName}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              {laporan.komentarCount}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={(e) => { e.stopPropagation(); onDetail(laporan.id) }}
            >
              Detail
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
