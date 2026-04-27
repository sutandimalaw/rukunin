import { Badge } from '@/components/ui/badge'
import type { LayananStatus, LayananType } from '@/lib/api/layanan-warga'

const TYPE_LABELS: Record<LayananType, string> = {
  SURAT_KETERANGAN: 'Surat Keterangan',
  LAPORAN_KERUSAKAN: 'Laporan Kerusakan',
  LAPORAN_KEAMANAN: 'Laporan Keamanan',
  PENGADUAN_UMUM: 'Pengaduan Umum',
}

const STATUS_CONFIG: Record<
  LayananStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  PENDING: { label: 'Menunggu', variant: 'secondary' },
  PROSES: { label: 'Diproses', variant: 'default' },
  SELESAI: { label: 'Selesai', variant: 'outline' },
  DITOLAK: { label: 'Ditolak', variant: 'destructive' },
}

export function TypeBadge({ type }: { type: LayananType }) {
  return <Badge variant="secondary">{TYPE_LABELS[type]}</Badge>
}

export function LayananStatusBadge({ status }: { status: LayananStatus }) {
  const config = STATUS_CONFIG[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function getTypeLabel(type: LayananType) {
  return TYPE_LABELS[type]
}

export const LAYANAN_TYPES: { value: LayananType; label: string }[] = [
  { value: 'SURAT_KETERANGAN', label: 'Surat Keterangan' },
  { value: 'LAPORAN_KERUSAKAN', label: 'Laporan Kerusakan' },
  { value: 'LAPORAN_KEAMANAN', label: 'Laporan Keamanan' },
  { value: 'PENGADUAN_UMUM', label: 'Pengaduan Umum' },
]
