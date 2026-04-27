'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'
import {
  getPosisiLabel,
  type Pengurus,
} from '@/lib/api/pengurus'
import { PosisiBadge } from './PosisiBadge'

function buildWaLink(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, '')
  const normalized = digits.startsWith('0') ? `62${digits.slice(1)}` : digits
  return `https://wa.me/${normalized}`
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

interface Props {
  pengurus: Pengurus
  size?: 'sm' | 'md'
}

export function PengurusCard({ pengurus, size = 'md' }: Props) {
  const photoUrl = pengurus.photoUrl ?? pengurus.user?.profile?.avatarUrl ?? undefined
  const label = getPosisiLabel(pengurus.posisi, pengurus.customPosisi)

  return (
    <div className="flex flex-col items-center gap-2 rounded-md border bg-card p-3 text-center">
      <Avatar className={size === 'sm' ? 'h-12 w-12' : 'h-20 w-20'}>
        {photoUrl && <AvatarImage src={photoUrl} alt={pengurus.fullName} />}
        <AvatarFallback>{initials(pengurus.fullName)}</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <p className={size === 'sm' ? 'text-sm font-medium' : 'font-semibold'}>
          {pengurus.fullName}
        </p>
        <PosisiBadge
          posisi={pengurus.posisi}
          customPosisi={pengurus.customPosisi}
        />
      </div>
      {pengurus.whatsapp && (
        <Button
          asChild
          size="sm"
          variant="outline"
          className="mt-1 w-full"
          aria-label={`Hubungi ${label} via WhatsApp`}
        >
          <a
            href={buildWaLink(pengurus.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Phone className="mr-1 h-3 w-3" /> Hubungi WA
          </a>
        </Button>
      )}
    </div>
  )
}
