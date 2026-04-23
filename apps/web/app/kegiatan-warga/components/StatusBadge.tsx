import { Badge } from '@/components/ui/badge'
import type { KegiatanStatus } from '@/lib/api/kegiatan-warga'

const STATUS_LABELS: Record<KegiatanStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  OPEN_VOTE: { label: 'Voting Terbuka', variant: 'secondary' },
  SCHEDULED: { label: 'Terjadwal', variant: 'default' },
  ONGOING: { label: 'Berlangsung', variant: 'default' },
  COMPLETED: { label: 'Selesai', variant: 'outline' },
  CANCELLED: { label: 'Dibatalkan', variant: 'destructive' },
}

export function StatusBadge({ status }: { status: KegiatanStatus }) {
  const config = STATUS_LABELS[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function getRecurrenceLabel(rule: string | null): string | null {
  if (!rule) return null
  const map: Record<string, string> = {
    'WEEKLY:SUNDAY': 'Setiap Minggu',
    'WEEKLY:MONDAY': 'Setiap Senin',
    'WEEKLY:TUESDAY': 'Setiap Selasa',
    'WEEKLY:WEDNESDAY': 'Setiap Rabu',
    'WEEKLY:THURSDAY': 'Setiap Kamis',
    'WEEKLY:FRIDAY': 'Setiap Jumat',
    'WEEKLY:SATURDAY': 'Setiap Sabtu',
    'MONTHLY:1': 'Setiap tanggal 1',
  }
  return map[rule] ?? rule
}
