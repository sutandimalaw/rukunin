import { Badge } from '@/components/ui/badge'
import type {
  PenyediaJasaCategory,
  PenyediaJasaStatus,
} from '@/lib/api/penyedia-jasa'

export const CATEGORY_LABELS: Record<PenyediaJasaCategory, string> = {
  TUKANG: 'Tukang',
  ART: 'ART',
  BABY_SITTER: 'Baby Sitter',
  MONTIR: 'Montir',
  LAUNDRY: 'Laundry',
  KEBUN: 'Kebun/Taman',
  LAINNYA: 'Lainnya',
}

const STATUS_CONFIG: Record<
  PenyediaJasaStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  PENDING: { label: 'Menunggu Review', variant: 'secondary' },
  ACTIVE: { label: 'Aktif', variant: 'outline' },
  REJECTED: { label: 'Ditolak', variant: 'destructive' },
}

export function CategoryBadge({ category }: { category: PenyediaJasaCategory }) {
  return <Badge variant="secondary">{CATEGORY_LABELS[category]}</Badge>
}

export function PenyediaJasaStatusBadge({
  status,
}: {
  status: PenyediaJasaStatus
}) {
  const config = STATUS_CONFIG[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export const CATEGORY_OPTIONS: { value: PenyediaJasaCategory; label: string }[] = [
  { value: 'TUKANG', label: 'Tukang' },
  { value: 'ART', label: 'ART' },
  { value: 'BABY_SITTER', label: 'Baby Sitter' },
  { value: 'MONTIR', label: 'Montir' },
  { value: 'LAUNDRY', label: 'Laundry' },
  { value: 'KEBUN', label: 'Kebun/Taman' },
  { value: 'LAINNYA', label: 'Lainnya' },
]
