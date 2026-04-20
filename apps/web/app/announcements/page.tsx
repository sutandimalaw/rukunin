'use client'

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
import { Calendar } from 'lucide-react'
import { useGetAnnouncements } from './hooks/useGetAnnouncements'
import { CreateAnnouncementModal } from './components/CreateAnnouncementModal'

export default function AnnouncementsPage() {
  const { data, isLoading, error } = useGetAnnouncements()

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
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
        {isLoading && (
          <p className="text-muted-foreground text-sm">Memuat pengumuman...</p>
        )}
        {error && (
          <p className="text-sm text-red-500">Gagal memuat pengumuman.</p>
        )}
        {!isLoading && data?.data.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Belum ada pengumuman.
          </p>
        )}
        {data?.data.map((announcement) => (
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
              <p>{announcement.content}</p>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="outline" size="sm">
                Selengkapnya
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </SidebarInset>
  )
}
