'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { MapPin, MessageCircle, Pencil, Star } from 'lucide-react'
import { useAuth } from '@/provider/auth-provider'
import { useGetPenyediaJasaDetail } from '../hooks/useGetPenyediaJasaDetail'
import {
  CategoryBadge,
  PenyediaJasaStatusBadge,
} from './PenyediaJasaBadges'
import { StarRating } from './StarRating'
import { ReviewList } from './ReviewList'
import { ReviewFormModal } from './ReviewFormModal'

function buildWaLink(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, '')
  const normalized = digits.startsWith('0') ? `62${digits.slice(1)}` : digits
  return `https://wa.me/${normalized}`
}

export function DetailContent({ id }: { id: string }) {
  const { user } = useAuth()
  const { data, isLoading, error } = useGetPenyediaJasaDetail(id)
  const [openReview, setOpenReview] = useState(false)

  const myReview = useMemo(
    () =>
      data?.reviews.find((r) => r.reviewerId === user?.id) ?? null,
    [data, user],
  )

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Memuat...</p>
  if (error)
    return <p className="text-sm text-red-500">Gagal memuat: {error.message}</p>
  if (!data) return null

  const canReview = data.status === 'ACTIVE'

  return (
    <div className="grid gap-4 max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-2xl">{data.personName}</CardTitle>
              <CardDescription>
                <div className="flex flex-wrap gap-2 mt-1 items-center">
                  <CategoryBadge category={data.category} />
                  <PenyediaJasaStatusBadge status={data.status} />
                </div>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex items-center gap-3">
            <StarRating
              rating={data.averageRating ?? null}
              size="lg"
              showValue
              reviewCount={data.reviewCount}
            />
          </div>
          {data.description && (
            <p className="text-sm whitespace-pre-wrap">{data.description}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {data.area && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {data.area}
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            Direkomendasikan oleh:{' '}
            <strong>
              {data.submitter.profile?.fullName ?? data.submitter.email}
            </strong>
          </div>
          {data.whatsapp && (
            <Button asChild className="w-fit">
              <a
                href={buildWaLink(data.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Hubungi via WhatsApp ({data.whatsapp})
              </a>
            </Button>
          )}
          {data.adminNotes && (
            <div className="rounded-md border-l-2 border-blue-400 bg-blue-50 p-3 text-sm">
              <p className="font-medium text-blue-900">Catatan Admin:</p>
              <p className="text-blue-800 mt-1">{data.adminNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Review Warga</CardTitle>
            {canReview && (
              <Button size="sm" onClick={() => setOpenReview(true)}>
                {myReview ? (
                  <>
                    <Pencil className="w-4 h-4 mr-1" /> Edit Review
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-1" /> Tulis Review
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ReviewList penyediaJasaId={data.id} reviews={data.reviews} />
        </CardContent>
      </Card>

      {canReview && (
        <ReviewFormModal
          penyediaJasaId={data.id}
          existingReview={myReview}
          open={openReview}
          onOpenChange={setOpenReview}
        />
      )}
    </div>
  )
}
