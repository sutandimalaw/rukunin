import { Badge } from '@/components/ui/badge'
import type { InventarisCategory, InventarisCondition, PeminjamanStatus } from '@/lib/api/inventaris'

export const INVENTARIS_CATEGORY_OPTIONS: { value: InventarisCategory; label: string }[] = [
  { value: 'ELEKTRONIK', label: 'Elektronik' },
  { value: 'FURNITURE', label: 'Furniture' },
  { value: 'ALAT_OLAHRAGA', label: 'Alat Olahraga' },
  { value: 'TENDA_DEKORASI', label: 'Tenda & Dekorasi' },
  { value: 'DAPUR', label: 'Peralatan Dapur' },
  { value: 'KEBERSIHAN', label: 'Kebersihan' },
  { value: 'LAINNYA', label: 'Lainnya' },
]

const categoryMap: Record<InventarisCategory, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  ELEKTRONIK: { label: 'Elektronik', variant: 'default' },
  FURNITURE: { label: 'Furniture', variant: 'secondary' },
  ALAT_OLAHRAGA: { label: 'Alat Olahraga', variant: 'outline' },
  TENDA_DEKORASI: { label: 'Tenda & Dekorasi', variant: 'default' },
  DAPUR: { label: 'Peralatan Dapur', variant: 'secondary' },
  KEBERSIHAN: { label: 'Kebersihan', variant: 'outline' },
  LAINNYA: { label: 'Lainnya', variant: 'secondary' },
}

export function CategoryBadge({ category }: { category: InventarisCategory }) {
  const c = categoryMap[category] ?? { label: category, variant: 'secondary' as const }
  return <Badge variant={c.variant}>{c.label}</Badge>
}

const conditionMap: Record<InventarisCondition, { label: string; className: string }> = {
  BAIK: { label: 'Baik', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  RUSAK_RINGAN: { label: 'Rusak Ringan', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  RUSAK_BERAT: { label: 'Rusak Berat', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
}

export function ConditionBadge({ condition }: { condition: InventarisCondition }) {
  const c = conditionMap[condition] ?? { label: condition, className: '' }
  return <Badge variant="outline" className={c.className}>{c.label}</Badge>
}

const statusMap: Record<PeminjamanStatus, { label: string; className: string }> = {
  PENDING: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  DISETUJUI: { label: 'Disetujui', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  DIPINJAM: { label: 'Dipinjam', className: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
  DIKEMBALIKAN: { label: 'Dikembalikan', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  DITOLAK: { label: 'Ditolak', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
}

export function PeminjamanStatusBadge({ status }: { status: PeminjamanStatus }) {
  const s = statusMap[status] ?? { label: status, className: '' }
  return <Badge variant="outline" className={s.className}>{s.label}</Badge>
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
