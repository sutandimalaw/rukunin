'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useAuth } from '@/provider/auth-provider'
import { StarRating } from './StarRating'
import { useDeleteMyReview } from '../hooks/useDeleteMyReview'
import { useAdminDeleteReview } from '../hooks/useAdminDeleteReview'
import type { PenyediaJasaReview } from '@/lib/api/penyedia-jasa'

interface Props {
  penyediaJasaId: string
  reviews: PenyediaJasaReview[]
}

export function ReviewList({ penyediaJasaId, reviews }: Props) {
  const { user } = useAuth()
  const deleteMyReview = useDeleteMyReview()
  const adminDelete = useAdminDeleteReview()

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        Belum ada review. Jadi yang pertama!
      </p>
    )
  }

  const handleDeleteMy = () => {
    if (!window.confirm('Hapus review kamu?')) return
    deleteMyReview.mutate(penyediaJasaId)
  }

  const handleAdminDelete = (reviewId: string) => {
    if (!window.confirm('Moderasi: hapus review ini?')) return
    adminDelete.mutate(reviewId)
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => {
        const isMine = user?.id === r.reviewerId
        const isAdmin = user?.role === 'ADMIN'
        return (
          <div key={r.id} className="border rounded-lg p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <StarRating rating={r.rating} size="sm" />
                  <span className="text-sm font-medium">
                    {r.reviewer.profile?.fullName ?? r.reviewer.email}
                  </span>
                  {isMine && (
                    <span className="text-xs text-muted-foreground">(kamu)</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(r.createdAt).toLocaleDateString('id-ID', {
                    dateStyle: 'medium',
                  })}
                </p>
              </div>
              {isMine && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleDeleteMy}
                  disabled={deleteMyReview.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              {!isMine && isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleAdminDelete(r.id)}
                  disabled={adminDelete.isPending}
                  title="Hapus (moderasi admin)"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            {r.comment && (
              <p className="text-sm whitespace-pre-wrap mt-2">{r.comment}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
