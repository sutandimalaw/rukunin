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
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { useGetAnnouncements } from '@/app/announcements/hooks/useGetAnnouncements'

const PREVIEW_LENGTH = 150

export default function PortalPengumumanPage() {
  const [page, setPage] = useState(1)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const { data, isLoading, error } = useGetAnnouncements({ page, limit: 10 })

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

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
                <BreadcrumbPage>Pengumuman</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {isLoading && (
          <p className="text-muted-foreground text-sm">Memuat pengumuman...</p>
        )}
        {error && (
          <p className="text-sm text-red-500">Gagal memuat pengumuman.</p>
        )}
        {!isLoading && data?.data.length === 0 && (
          <p className="text-muted-foreground text-sm">Belum ada pengumuman.</p>
        )}

        <div className="grid gap-4 grid-cols-1">
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
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(announcement.createdAt).toLocaleDateString('id-ID')}
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

        {/* Pagination */}
        {data && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Halaman {page} dari {data.meta.totalPages} • Total {data.meta.total} pengumuman
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.meta.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </SidebarInset>
  )
}
