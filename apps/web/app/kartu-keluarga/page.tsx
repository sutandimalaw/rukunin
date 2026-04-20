'use client'

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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { useGetHouseholds } from './hooks/useHouseholds'
import { useRouter } from 'next/navigation'
import { Search, ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'

export default function KartuKeluargaPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetHouseholds({ page, limit: 20, search })

  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  const handleReset = () => {
    setSearchInput('')
    setSearch('')
    setPage(1)
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
                <BreadcrumbLink href="#">Kependudukan</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Kartu Keluarga</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nomor KK..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-8 w-64"
              />
            </div>
            <Button size="sm" onClick={handleSearch}>Cari</Button>
            {search && (
              <Button size="sm" variant="outline" onClick={handleReset}>Reset</Button>
            )}
          </div>
          <Button size="sm" asChild>
            <Link href="/residents/create">
              <Plus className="h-4 w-4 mr-1" />
              Tambah KK Baru
            </Link>
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor KK</TableHead>
                <TableHead>Blok</TableHead>
                <TableHead>No Rumah</TableHead>
                <TableHead>RT</TableHead>
                <TableHead>Kepala Keluarga</TableHead>
                <TableHead className="text-center">Anggota</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    Tidak ada data Kartu Keluarga.
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((kk) => (
                  <TableRow
                    key={kk.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/kartu-keluarga/${kk.id}`)}
                  >
                    <TableCell className="font-mono text-sm">{kk.kkNumber}</TableCell>
                    <TableCell>{kk.blok ?? '-'}</TableCell>
                    <TableCell>{kk.houseNumber ?? '-'}</TableCell>
                    <TableCell>{kk.rt ?? '-'}</TableCell>
                    <TableCell>{kk.kepalaKeluarga?.fullName ?? '-'}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{kk.memberCount} jiwa</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={kk.ownershipStatus === 'OWNER' ? 'default' : 'outline'}>
                        {kk.ownershipStatus === 'OWNER' ? 'Pemilik' : kk.ownershipStatus === 'RENT' ? 'Kontrakan' : '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {data && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Total {data.meta.total} Kartu Keluarga
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
