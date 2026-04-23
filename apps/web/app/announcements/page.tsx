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
import { Calendar, Pencil, Trash2 } from 'lucide-react'
import { useGetAnnouncements } from './hooks/useGetAnnouncements'
import { useDeleteAnnouncement } from './hooks/useDeleteAnnouncement'
import { CreateAnnouncementModal } from './components/CreateAnnouncementModal'
import { EditAnnouncementModal } from './components/EditAnnouncementModal'
import type { Announcement } from '@/lib/api/announcements'

const PREVIEW_LENGTH = 150

export default function AnnouncementsPage() {
  const { data, isLoading, error } = useGetAnnouncements()
  const deleteMutation = useDeleteAnnouncement()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleDelete = (id: string) => {
    if (!window.confirm('Hapus pengumuman ini?')) return
    deleteMutation.mutate(id)
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
                <BreadcrumbPage>Pengumuman RT</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="mx-6 flex justify-end">
        <CreateAnnouncementModal />
      </div>

      <div className="m-6 grid gap-4 grid-cols-1">
        {isLoading && <p className="text-muted-foreground text-sm">Memuat pengumuman...</p>}
        {error && <p className="text-sm text-red-500">Gagal memuat pengumuman.</p>}
        {!isLoading && data?.data.length === 0 && (
          <p className="text-muted-foreground text-sm">Belum ada pengumuman.</p>
        )}
        {data?.data.map((announcement) => {
          const isExpanded = expandedIds.has(announcement.id)
          const isLong = announcement.content.length > PREVIEW_LENGTH
          const displayContent =
            isExpanded || !isLong
              ? announcement.content
              : announcement.content.slice(0, PREVIEW_LENGTH) + '...'

          return (
            <Card key={announcement.id}>
              <CardHeader>
                <CardTitle>{announcement.title}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary">{announcement.category}</Badge>
                </CardDescription>
                <CardAction>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(announcement.createdAt).toLocaleDateString('id-ID')}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingAnnouncement(announcement)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(announcement.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{displayContent}</p>
              </CardContent>
              {isLong && (
                <CardFooter className="justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleExpand(announcement.id)}
                  >
                    {isExpanded ? 'Sembunyikan' : 'Selengkapnya'}
                  </Button>
                </CardFooter>
              )}
            </Card>
          )
        })}
      </div>

      {editingAnnouncement && (
        <EditAnnouncementModal
          announcement={editingAnnouncement}
          open={!!editingAnnouncement}
          onOpenChange={(open) => !open && setEditingAnnouncement(null)}
        />
      )}
    </SidebarInset>
  )
}
