import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import React from 'react'
import { Calendar } from 'lucide-react'

const page = () => {
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
                <BreadcrumbPage>Pengumuman RT 4 RW</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

    </header>
    <div className="m-6 grid gap-4 grid-cols-1">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Gotong Royong Mingguan</CardTitle>
            <CardDescription>
              <Badge variant="secondary" asChild>
                <Link href="/">Umum</Link>
              </Badge>
            </CardDescription>
            <CardAction>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                2024-03-12
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p>
              Diadakan setiap Sabtu pagi jam 07:00 untuk membersihkan lingkungan RT.
              Mohon partisipasi seluruh warga.
            </p>
          </CardContent>
          <CardFooter className="justify-end">
            <Button variant="outline">Selengkapnya</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
    

   </SidebarInset>
  )
}

export default page
