'use client'

import { use } from 'react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useGetHousehold } from '../hooks/useHouseholds'
import { getFamilyRelationLabel } from '@/lib/api/households'
import { ArrowLeft, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-'
  return format(new Date(dateStr), 'd MMMM yyyy', { locale: idLocale })
}

export default function HouseholdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: household, isLoading } = useGetHousehold(id)

  if (isLoading) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          Memuat data...
        </div>
      </SidebarInset>
    )
  }

  if (!household) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          Kartu Keluarga tidak ditemukan.
        </div>
      </SidebarInset>
    )
  }

  const kepala = household.members.find((m) => m.familyRelation === 'KEPALA_KELUARGA')

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Kependudukan</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/kartu-keluarga">Kartu Keluarga</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-mono">{household.kkNumber}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Back + actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/kartu-keluarga">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Kembali
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/residents/create?kkNumber=${household.kkNumber}`}>
              <UserPlus className="h-4 w-4 mr-1" />
              Tambah Anggota
            </Link>
          </Button>
        </div>

        {/* Household info */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Info Kartu Keluarga</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nomor KK</span>
                <span className="font-mono font-medium">{household.kkNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kepala Keluarga</span>
                <span className="font-medium">{kepala?.fullName ?? '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jumlah Anggota</span>
                <Badge variant="secondary">{household.members.length} jiwa</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Info Rumah</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Blok / Rumah</span>
                <span>{household.blok ?? '-'} / {household.houseNumber ?? '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">RT</span>
                <span>{household.rt ?? '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipe Rumah</span>
                <span>{household.houseType ?? '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={household.ownershipStatus === 'OWNER' ? 'default' : 'outline'}>
                  {household.ownershipStatus === 'OWNER' ? 'Pemilik' : household.ownershipStatus === 'RENT' ? 'Kontrakan' : '-'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mulai Tinggal</span>
                <span>{formatDate(household.startDateOfOccupancy)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Members table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Anggota Keluarga</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Relasi</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                  <TableHead>Tanggal Lahir</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {household.members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.fullName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={member.familyRelation === 'KEPALA_KELUARGA' ? 'default' : 'secondary'}
                      >
                        {getFamilyRelationLabel(member.familyRelation)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {member.gender === 'MEN' ? 'Laki-Laki' : member.gender === 'WOMAN' ? 'Perempuan' : member.gender}
                    </TableCell>
                    <TableCell>{formatDate(member.dateOfBirth)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
