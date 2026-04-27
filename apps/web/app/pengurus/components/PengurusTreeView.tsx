'use client'

import { useMemo } from 'react'
import {
  getPosisiLevel,
  POSISI_OPTIONS,
  type Pengurus,
} from '@/lib/api/pengurus'
import { PengurusCard } from './PengurusCard'

interface Props {
  data: Pengurus[]
}

export function PengurusTreeView({ data }: Props) {
  const groupedByLevel = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const la = getPosisiLevel(a.posisi)
      const lb = getPosisiLevel(b.posisi)
      if (la !== lb) return la - lb
      const ia = POSISI_OPTIONS.findIndex((p) => p.value === a.posisi)
      const ib = POSISI_OPTIONS.findIndex((p) => p.value === b.posisi)
      if (ia !== ib) return ia - ib
      if (a.urutan !== b.urutan) return a.urutan - b.urutan
      return a.createdAt.localeCompare(b.createdAt)
    })
    const map = new Map<number, Pengurus[]>()
    for (const item of sorted) {
      const level = getPosisiLevel(item.posisi)
      if (!map.has(level)) map.set(level, [])
      map.get(level)!.push(item)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b)
  }, [data])

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Belum ada data pengurus.
      </p>
    )
  }

  return (
    <div className="flex flex-col items-stretch gap-6 md:items-center">
      {groupedByLevel.map(([level, items], idx) => (
        <div key={level} className="flex flex-col items-center gap-2 w-full">
          {idx > 0 && (
            <div
              className="hidden md:block h-6 w-px bg-border"
              aria-hidden
            />
          )}
          <div className="flex flex-wrap justify-center gap-3 w-full">
            {items.map((p) => (
              <div
                key={p.id}
                className="w-full sm:w-56 max-w-xs"
              >
                <PengurusCard pengurus={p} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
