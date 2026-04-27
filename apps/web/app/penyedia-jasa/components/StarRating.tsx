'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number | null
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  reviewCount?: number
}

const SIZE_MAP = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-6 h-6',
}

export function StarRating({
  rating,
  size = 'md',
  showValue = false,
  reviewCount,
}: StarRatingProps) {
  const value = rating ?? 0
  const stars = [1, 2, 3, 4, 5]
  const sizeClass = SIZE_MAP[size]

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {stars.map((s) => (
          <Star
            key={s}
            className={cn(
              sizeClass,
              s <= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-none text-muted-foreground/40',
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground ml-1">
          {rating !== null ? rating.toFixed(1) : 'Belum ada rating'}
          {reviewCount !== undefined && rating !== null && (
            <span className="ml-1">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  )
}

interface StarRatingInputProps {
  value: number
  onChange: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
}

export function StarRatingInput({
  value,
  onChange,
  size = 'lg',
}: StarRatingInputProps) {
  const stars = [1, 2, 3, 4, 5]
  const sizeClass = SIZE_MAP[size]
  return (
    <div className="flex gap-1">
      {stars.map((s) => (
        <button
          type="button"
          key={s}
          onClick={() => onChange(s)}
          className="p-1 hover:scale-110 transition-transform"
          aria-label={`Beri ${s} bintang`}
        >
          <Star
            className={cn(
              sizeClass,
              s <= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-none text-muted-foreground/40',
            )}
          />
        </button>
      ))}
    </div>
  )
}
