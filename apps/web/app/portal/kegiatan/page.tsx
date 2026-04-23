'use client'

import { useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Calendar, MapPin, Users, Heart, ThumbsUp, Repeat } from 'lucide-react'
import { useGetKegiatanWarga } from '@/app/kegiatan-warga/hooks/useGetKegiatanWarga'
import { useGetKegiatanDetail } from '@/app/kegiatan-warga/hooks/useGetKegiatanDetail'
import { useVoteKegiatan } from '@/app/kegiatan-warga/hooks/useVoteKegiatan'
import { useRsvpKegiatan } from '@/app/kegiatan-warga/hooks/useRsvpKegiatan'
import { StatusBadge, getRecurrenceLabel } from '@/app/kegiatan-warga/components/StatusBadge'
import type { KegiatanWarga, KegiatanStatus } from '@/lib/api/kegiatan-warga'

function KegiatanCard({ kegiatan }: { kegiatan: KegiatanWarga }) {
  const { data: detail } = useGetKegiatanDetail(kegiatan.id)
  const voteMutation = useVoteKegiatan()
  const rsvpMutation = useRsvpKegiatan()

  const hasVoted = detail?.myParticipation?.hasVoted ?? false
  const hasRsvp = detail?.myParticipation?.hasRsvp ?? false
  const recurrenceLabel = getRecurrenceLabel(kegiatan.recurrenceRule)

  const handleVote = () => {
    voteMutation.mutate({ id: kegiatan.id, action: hasVoted ? 'unvote' : 'vote' })
  }

  const handleRsvp = () => {
    rsvpMutation.mutate({ id: kegiatan.id, action: hasRsvp ? 'unrsvp' : 'rsvp' })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{kegiatan.title}</CardTitle>
        <CardDescription>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="secondary">{kegiatan.category}</Badge>
            <StatusBadge status={kegiatan.status} />
            {recurrenceLabel && (
              <Badge variant="outline" className="gap-1">
                <Repeat className="w-3 h-3" /> {recurrenceLabel}
              </Badge>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm">{kegiatan.description}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {kegiatan.status === 'OPEN_VOTE' ? (
              <>Vote: {kegiatan.voteCount}{kegiatan.minParticipants ? ` / ${kegiatan.minParticipants}` : ''}</>
            ) : (
              <>Hadir: {kegiatan.rsvpCount}</>
            )}
          </span>
          {kegiatan.startDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(kegiatan.startDate).toLocaleString('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
          )}
          {kegiatan.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {kegiatan.location}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        {kegiatan.status === 'OPEN_VOTE' && (
          <Button
            variant={hasVoted ? 'outline' : 'default'}
            size="sm"
            onClick={handleVote}
            disabled={voteMutation.isPending}
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            {hasVoted ? 'Batalkan Vote' : 'Saya Tertarik'}
          </Button>
        )}
        {kegiatan.status === 'SCHEDULED' && (
          <Button
            variant={hasRsvp ? 'outline' : 'default'}
            size="sm"
            onClick={handleRsvp}
            disabled={rsvpMutation.isPending}
          >
            <Heart className="w-4 h-4 mr-1" />
            {hasRsvp ? 'Batalkan Konfirmasi' : 'Konfirmasi Hadir'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

function KegiatanList({ status }: { status?: KegiatanStatus }) {
  const { data, isLoading, error } = useGetKegiatanWarga({ status })

  if (isLoading) return <p className="text-muted-foreground text-sm">Memuat...</p>
  if (error) return <p className="text-sm text-red-500">Gagal memuat.</p>
  if (!data?.data.length) return <p className="text-muted-foreground text-sm">Belum ada kegiatan.</p>

  return (
    <div className="grid gap-4">
      {data.data.map((k) => (
        <KegiatanCard key={k.id} kegiatan={k} />
      ))}
    </div>
  )
}

export default function PortalKegiatanPage() {
  const [tab, setTab] = useState('OPEN_VOTE')

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/portal">Portal Warga</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Kegiatan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="OPEN_VOTE">Voting</TabsTrigger>
            <TabsTrigger value="SCHEDULED">Akan Datang</TabsTrigger>
            <TabsTrigger value="COMPLETED">Riwayat</TabsTrigger>
          </TabsList>
          <TabsContent value="OPEN_VOTE" className="mt-4">
            <KegiatanList status="OPEN_VOTE" />
          </TabsContent>
          <TabsContent value="SCHEDULED" className="mt-4">
            <KegiatanList status="SCHEDULED" />
          </TabsContent>
          <TabsContent value="COMPLETED" className="mt-4">
            <KegiatanList status="COMPLETED" />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
