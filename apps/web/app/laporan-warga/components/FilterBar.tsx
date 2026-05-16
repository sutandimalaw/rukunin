'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'

export interface FilterState {
  search: string
  status: string
  kategori: string
  prioritas: string
  sort: string
}

interface Props {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

export function FilterBar({ filters, onChange }: Props) {
  const set = (key: keyof FilterState) => (value: string) =>
    onChange({ ...filters, [key]: value })

  const reset = () =>
    onChange({ search: '', status: '', kategori: '', prioritas: '', sort: 'TERBARU' })

  const hasActiveFilters =
    filters.search || filters.status || filters.kategori || filters.prioritas

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Cari laporan..."
          value={filters.search}
          onChange={(e) => set('search')(e.target.value)}
        />
      </div>

      <Select value={filters.status || 'all'} onValueChange={(v) => set('status')(v === 'all' ? '' : v)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="MENUNGGU">Menunggu</SelectItem>
          <SelectItem value="DIPROSES">Diproses</SelectItem>
          <SelectItem value="SELESAI">Selesai</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.kategori || 'all'} onValueChange={(v) => set('kategori')(v === 'all' ? '' : v)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          <SelectItem value="INFRASTRUKTUR">Infrastruktur</SelectItem>
          <SelectItem value="KEBERSIHAN">Kebersihan</SelectItem>
          <SelectItem value="KEAMANAN">Keamanan</SelectItem>
          <SelectItem value="SOSIAL">Sosial</SelectItem>
          <SelectItem value="LAINNYA">Lainnya</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.prioritas || 'all'} onValueChange={(v) => set('prioritas')(v === 'all' ? '' : v)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Prioritas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Prioritas</SelectItem>
          <SelectItem value="PENTING">Penting</SelectItem>
          <SelectItem value="NORMAL">Normal</SelectItem>
          <SelectItem value="RENDAH">Rendah</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.sort} onValueChange={set('sort')}>
        <SelectTrigger className="w-[130px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TERBARU">Terbaru</SelectItem>
          <SelectItem value="TERLAMA">Terlama</SelectItem>
          <SelectItem value="STATUS">Status</SelectItem>
          <SelectItem value="PRIORITAS">Prioritas</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={reset} className="gap-1">
          <X className="h-4 w-4" />
          Reset
        </Button>
      )}
    </div>
  )
}
