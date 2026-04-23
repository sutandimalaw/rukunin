'use client'

import { useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Calendar, MapPin, Users, Trash2, CheckCircle, XCircle, Repeat } from 'lucide-react'
import { useGetKegiatanWarga } from './hooks/useGetKegiatanWarga'
import { useDeleteKegiatan } from './hooks/useDeleteKegiatan'
import { useCancelKegiatan } from './hooks/useCancelKegiatan'
import { useCompleteKegiatan } from './hooks/useCompleteKegiatan'
import { CreateKegiatanModal } from './components/CreateKegiatanModal'
import { ScheduleKegiatanModal } from './components/ScheduleKegiatanModal'
import { StatusBadge, getRecurrenceLabel } from './components/StatusBadge'
import type { KegiatanWarga } from '@/lib/api/kegiatan-warga'

export default function KegiatanWargaPage() {
  const { data, isLoading, error } = useGetKegiatanWarga()
  const deleteMutation = useDeleteKegiatan()
  const cancelMutation = useCancelKegiatan()
  const completeMutation = useCompleteKegiatan()
  const [schedulingKegiatan, setSchedulingKegiatan] = useState<KegiatanWarga | null>(null)

  const handleDelete = (id: string) => {
    if (!window.confirm('Hapus kegiatan ini?')) return
    deleteMutation.mutate(id)
  }

  const handleCancel = (id: string) => {
    if (!window.confirm('Batalkan kegiatan ini?')) return
    cancelMutation.mutate(id)
  }

  const handleComplete = (id: string) => {
    if (!window.confirm('Tandai kegiatan ini sebagai selesai?')) return
    completeMutation.mutate(id)
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Kegiatan Warga</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="mx-6 flex justify-end">
        <CreateKegiatanModal />
      </div>

      <div className="m-6 grid gap-4 grid-cols-1">
        {isLoading && <p className="text-muted-foreground text-sm">Memuat kegiatan...</p>}
        {error && <p className="text-sm text-red-500">Gagal memuat kegiatan.</p>}
        {!isLoading && data?.data.length === 0 && (
          <p className="text-muted-foreground text-sm">Belum ada kegiatan. Klik "Buat Kegiatan" untuk mulai.</p>
        )}

        {data?.data.map((k) => {
          const recurrenceLabel = getRecurrenceLabel(k.recurrenceRule)
          return (
            <Card key={k.id}>
              <CardHeader>
                <CardTitle>{k.title}</CardTitle>
                <CardDescription>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="secondary">{k.category}</Badge>
                    <StatusBadge status={k.status} />
                    {recurrenceLabel && (
                      <Badge variant="outline" className="gap-1">
                        <Repeat className="w-3 h-3" /> {recurrenceLabel}
                      </Badge>
                    )}
                  </div>
                </CardDescription>
                <CardAction>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(k.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{k.description}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {k.status === 'OPEN_VOTE' ? (
                      <>Vote: {k.voteCount}{k.minParticipants ? ` / ${k.minParticipants}` : ''}</>
                    ) : (
                      <>RSVP: {k.rsvpCount}</>
                    )}
                  </span>
                  {k.startDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(k.startDate).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  )}
                  {k.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {k.location}
                    </span>
                  )}
                  {k.voteDeadline && k.status === 'OPEN_VOTE' && (
                    <span className="text-amber-600">
                      Vote ditutup: {new Date(k.voteDeadline).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="justify-end gap-2 flex-wrap">
                {k.status === 'OPEN_VOTE' && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleCancel(k.id)}>
                      <XCircle className="w-4 h-4 mr-1" /> Batalkan
                    </Button>
                    <Button size="sm" onClick={() => setSchedulingKegiatan(k)}>
                      <Calendar className="w-4 h-4 mr-1" /> Jadwalkan
                    </Button>
                  </>
                )}
                {k.status === 'SCHEDULED' && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleCancel(k.id)}>
                      <XCircle className="w-4 h-4 mr-1" /> Batalkan
                    </Button>
                    <Button size="sm" onClick={() => handleComplete(k.id)}>
                      <CheckCircle className="w-4 h-4 mr-1" /> Tandai Selesai
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {schedulingKegiatan && (
        <ScheduleKegiatanModal
          kegiatan={schedulingKegiatan}
          open={!!schedulingKegiatan}
          onOpenChange={(open) => !open && setSchedulingKegiatan(null)}
        />
      )}
    </SidebarInset>
  )
}
