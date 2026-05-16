'use client'

import { useState, useCallback } from 'react'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Plus, FileText, Clock, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import StatCard from '@/components/shared/StatCard'
import { LaporanCard } from './components/LaporanCard'
import { FilterBar, FilterState } from './components/FilterBar'
import { CreateLaporanModal } from './components/CreateLaporanModal'
import { LaporanDetailModal } from './components/LaporanDetailModal'
import { useGetLaporan, useGetLaporanSummary } from './hooks/useLaporan'
import { useAuth } from '@/provider/auth-provider'

export default function LaporanWargaPage() {
  const { user } = useAuth()
  const [openCreate, setOpenCreate] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    kategori: '',
    prioritas: '',
    sort: 'TERBARU',
  })

  const { data: summary } = useGetLaporanSummary()
  const { data, isLoading } = useGetLaporan({
    page,
    limit: 10,
    status: filters.status || undefined,
    kategori: filters.kategori || undefined,
    prioritas: filters.prioritas || undefined,
    search: filters.search || undefined,
    sort: filters.sort,
  })

  const handleFilterChange = useCallback((f: FilterState) => {
    setFilters(f)
    setPage(1)
  }, [])

  const handleDetail = useCallback((id: string) => setDetailId(id), [])

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN'

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-base font-semibold">Laporan Warga</h1>
        <div className="ml-auto">
          <Button onClick={() => setOpenCreate(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Buat Laporan Baru
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            title="Total Laporan"
            value={summary?.total ?? 0}
            icon={<FileText className="h-4 w-4 text-gray-500" />}
          />
          <StatCard
            title="Menunggu"
            value={summary?.menunggu ?? 0}
            icon={<Clock className="h-4 w-4 text-amber-500" />}
            onClick={() => handleFilterChange({ ...filters, status: 'MENUNGGU' })}
          />
          <StatCard
            title="Diproses"
            value={summary?.diproses ?? 0}
            icon={<AlertCircle className="h-4 w-4 text-blue-500" />}
            onClick={() => handleFilterChange({ ...filters, status: 'DIPROSES' })}
          />
          <StatCard
            title="Selesai"
            value={summary?.selesai ?? 0}
            icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
            onClick={() => handleFilterChange({ ...filters, status: 'SELESAI' })}
          />
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onChange={handleFilterChange} />

        {/* List */}
        {isLoading && (
          <div className="text-center py-12 text-muted-foreground text-sm">Memuat laporan...</div>
        )}

        {!isLoading && data?.data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/40" />
            {filters.search || filters.status || filters.kategori || filters.prioritas ? (
              <>
                <p className="font-medium">Tidak ada laporan ditemukan</p>
                <p className="text-sm text-muted-foreground">Coba ubah atau reset filter pencarian</p>
              </>
            ) : (
              <>
                <p className="font-medium">Belum ada laporan</p>
                <p className="text-sm text-muted-foreground">Buat laporan pertama!</p>
                <Button onClick={() => setOpenCreate(true)} className="mt-2 gap-1.5">
                  <Plus className="h-4 w-4" />
                  Buat Laporan Baru
                </Button>
              </>
            )}
          </div>
        )}

        {!isLoading && data && data.data.length > 0 && (
          <div className="space-y-3">
            {data.data.map((laporan) => (
              <LaporanCard key={laporan.id} laporan={laporan} onDetail={handleDetail} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Halaman {page} dari {data.meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <CreateLaporanModal open={openCreate} onOpenChange={setOpenCreate} />
      <LaporanDetailModal
        laporanId={detailId}
        open={!!detailId}
        onOpenChange={(o) => { if (!o) setDetailId(null) }}
        isAdminView={isAdmin}
      />
    </SidebarInset>
  )
}
