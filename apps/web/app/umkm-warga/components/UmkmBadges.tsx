import { Badge } from '@/components/ui/badge'
import type { UmkmCategory, UmkmStatus, ProdukType } from '@/lib/api/umkm'

export const CATEGORY_LABELS: Record<UmkmCategory, string> = {
  MAKANAN: 'Makanan',
  MINUMAN: 'Minuman',
  JASA: 'Jasa',
  KERAJINAN: 'Kerajinan',
  FASHION: 'Fashion',
  ELEKTRONIK: 'Elektronik',
  LAINNYA: 'Lainnya',
}

const STATUS_CONFIG: Record<
  UmkmStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  PENDING: { label: 'Menunggu Review', variant: 'secondary' },
  ACTIVE: { label: 'Aktif', variant: 'outline' },
  REJECTED: { label: 'Ditolak', variant: 'destructive' },
}

export function CategoryBadge({ category }: { category: UmkmCategory }) {
  return <Badge variant="secondary">{CATEGORY_LABELS[category]}</Badge>
}

export function UsahaStatusBadge({ status }: { status: UmkmStatus }) {
  const config = STATUS_CONFIG[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function ProdukTypeBadge({ type }: { type: ProdukType }) {
  return (
    <Badge variant={type === 'BARANG' ? 'outline' : 'default'}>
      {type === 'BARANG' ? 'Barang' : 'Jasa'}
    </Badge>
  )
}

export function formatRupiah(price: number | string) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(price))
}

export const UMKM_CATEGORY_OPTIONS: { value: UmkmCategory; label: string }[] = [
  { value: 'MAKANAN', label: 'Makanan' },
  { value: 'MINUMAN', label: 'Minuman' },
  { value: 'JASA', label: 'Jasa' },
  { value: 'KERAJINAN', label: 'Kerajinan' },
  { value: 'FASHION', label: 'Fashion' },
  { value: 'ELEKTRONIK', label: 'Elektronik' },
  { value: 'LAINNYA', label: 'Lainnya' },
]
