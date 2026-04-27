import { Badge } from '@/components/ui/badge'
import type { InsidenCategory, InsidenSeverity, InsidenStatus } from '@/lib/api/keamanan'

export const INSIDEN_CATEGORY_OPTIONS: { value: InsidenCategory; label: string }[] = [
  { value: 'PENCURIAN', label: 'Pencurian' },
  { value: 'VANDALISME', label: 'Vandalisme' },
  { value: 'GANGGUAN_KETERTIBAN', label: 'Gangguan Ketertiban' },
  { value: 'ORANG_MENCURIGAKAN', label: 'Orang Mencurigakan' },
  { value: 'KECELAKAAN', label: 'Kecelakaan' },
  { value: 'KEBAKARAN', label: 'Kebakaran' },
  { value: 'LAINNYA', label: 'Lainnya' },
]

export const SEVERITY_OPTIONS: { value: InsidenSeverity; label: string }[] = [
  { value: 'RENDAH', label: 'Rendah' },
  { value: 'SEDANG', label: 'Sedang' },
  { value: 'TINGGI', label: 'Tinggi' },
  { value: 'DARURAT', label: 'Darurat' },
]

const severityMap: Record<InsidenSeverity, { label: string; className: string }> = {
  RENDAH: { label: 'Rendah', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  SEDANG: { label: 'Sedang', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  TINGGI: { label: 'Tinggi', className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
  DARURAT: { label: 'Darurat', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
}

export function SeverityBadge({ severity }: { severity: InsidenSeverity }) {
  const s = severityMap[severity] ?? { label: severity, className: '' }
  return <Badge variant="outline" className={s.className}>{s.label}</Badge>
}

const statusMap: Record<InsidenStatus, { label: string; className: string }> = {
  DILAPORKAN: { label: 'Dilaporkan', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  DITINDAK: { label: 'Ditindak', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  SELESAI: { label: 'Selesai', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  DITUTUP: { label: 'Ditutup', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
}

export function InsidenStatusBadge({ status }: { status: InsidenStatus }) {
  const s = statusMap[status] ?? { label: status, className: '' }
  return <Badge variant="outline" className={s.className}>{s.label}</Badge>
}

const categoryLabelMap: Record<InsidenCategory, string> = {
  PENCURIAN: 'Pencurian',
  VANDALISME: 'Vandalisme',
  GANGGUAN_KETERTIBAN: 'Gangguan Ketertiban',
  ORANG_MENCURIGAKAN: 'Orang Mencurigakan',
  KECELAKAAN: 'Kecelakaan',
  KEBAKARAN: 'Kebakaran',
  LAINNYA: 'Lainnya',
}

export function InsidenCategoryBadge({ category }: { category: InsidenCategory }) {
  return <Badge variant="secondary">{categoryLabelMap[category] ?? category}</Badge>
}

export function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
