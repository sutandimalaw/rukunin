'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { StarRatingInput } from './StarRating'
import { useUpsertReview } from '../hooks/useUpsertReview'
import type { PenyediaJasaReview } from '@/lib/api/penyedia-jasa'

interface Props {
  penyediaJasaId: string
  existingReview: PenyediaJasaReview | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReviewFormModal({
  penyediaJasaId,
  existingReview,
  open,
  onOpenChange,
}: Props) {
  const [rating, setRating] = useState<number>(existingReview?.rating ?? 5)
  const [comment, setComment] = useState<string>(existingReview?.comment ?? '')
  const { mutateAsync, isPending, error } = useUpsertReview()

  useEffect(() => {
    if (open) {
      setRating(existingReview?.rating ?? 5)
      setComment(existingReview?.comment ?? '')
    }
  }, [open, existingReview])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating < 1 || rating > 5) return
    try {
      await mutateAsync({
        id: penyediaJasaId,
        data: { rating, comment: comment || undefined },
      })
      onOpenChange(false)
    } catch {
      // error tampilkan via state
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {existingReview ? 'Edit Review' : 'Tulis Review'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-5">
            <div className="grid gap-2">
              <Label>Rating</Label>
              <StarRatingInput value={rating} onChange={setRating} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comment">Komentar (opsional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Bagaimana pengalamanmu dengan penyedia jasa ini?"
                rows={4}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
