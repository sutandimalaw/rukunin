import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { transaction_type, all_categories } from '../type/transactionType'

export interface FilterParams {
  type?: string
  category?: string
  startDate?: string
  endDate?: string
}

interface FilterProps {
  filters: FilterParams
  onFilterChange: (filters: FilterParams) => void
  onReset: () => void
}

const Filter = ({ filters, onFilterChange, onReset }: FilterProps) => {
  return (
    <div className="flex items-end gap-4 flex-wrap">
      <div className="grid gap-1.5">
        <Label>Tipe</Label>
        <Select
          value={filters.type ?? 'all'}
          onValueChange={(val) =>
            onFilterChange({ ...filters, type: val === 'all' ? undefined : val })
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Semua" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            {transaction_type.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label>Kategori</Label>
        <Select
          value={filters.category ?? 'all'}
          onValueChange={(val) =>
            onFilterChange({ ...filters, category: val === 'all' ? undefined : val })
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Semua" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            {all_categories.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label>Dari Tanggal</Label>
        <Input
          type="date"
          value={filters.startDate ?? ''}
          onChange={(e) =>
            onFilterChange({ ...filters, startDate: e.target.value || undefined })
          }
          className="w-40"
        />
      </div>
      <div className="grid gap-1.5">
        <Label>Sampai Tanggal</Label>
        <Input
          type="date"
          value={filters.endDate ?? ''}
          onChange={(e) =>
            onFilterChange({ ...filters, endDate: e.target.value || undefined })
          }
          className="w-40"
        />
      </div>
      <Button variant="outline" onClick={onReset}>
        Reset
      </Button>
    </div>
  )
}

export default Filter
