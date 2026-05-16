'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Users,
  Wallet,
  Receipt,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Bell,
  CalendarHeart,
} from 'lucide-react'
import StatCard from '@/components/shared/StatCard'
import DataTable from './residents/components/DataTabel'
import { useGetResidentSummary } from './residents/hooks/useGetResidents'
import { useGetTransactionSummary } from './finance/hooks/useGetTransactionSummary'
import { useGetDuesSummary } from './iuran-warga/hooks/useDues'
import { useGetLayananWarga } from './layanan-warga/hooks/useGetLayananWarga'
import { useGetFinancialReport, useGetResidentsReport } from './dashboard/hooks/useGetReport'
import { useQuery } from '@tanstack/react-query'
import { announcementsApi } from '@/lib/api/announcements'
import { kegiatanWargaApi } from '@/lib/api/kegiatan-warga'
import Link from 'next/link'
import { useState } from 'react'

function formatRupiah(amount: number | string) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(amount))
}

function getCurrentPeriod() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function formatMonth(monthKey: string) {
  const [year, month] = monthKey.split('-')
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  })
}

export default function DashboardPage() {
  const currentPeriod = getCurrentPeriod()

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filterParams, setFilterParams] = useState<{ startDate?: string; endDate?: string }>({})

  const { data: residentSummary } = useGetResidentSummary()
  const { data: financeSummary } = useGetTransactionSummary()
  const { data: duesSummary } = useGetDuesSummary(currentPeriod)
  const { data: layananPending } = useGetLayananWarga({ status: 'PENDING', limit: 1 })
  const { data: financial, isLoading: loadingFinancial } = useGetFinancialReport(filterParams)
  const { data: residents, isLoading: loadingResidents } = useGetResidentsReport()

  const { data: announcements } = useQuery({
    queryKey: ['announcements', 'dashboard'],
    queryFn: () => announcementsApi.getAll({ limit: 3 }),
  })

  const { data: kegiatanUpcoming } = useQuery({
    queryKey: ['kegiatan-warga', 'dashboard'],
    queryFn: () => kegiatanWargaApi.getAll({ status: 'SCHEDULED', limit: 3 }),
  })

  const handleFilter = () => {
    setFilterParams({ startDate: startDate || undefined, endDate: endDate || undefined })
  }

  const handleReset = () => {
    setStartDate('')
    setEndDate('')
    setFilterParams({})
  }

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
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Stat Cards */}
        <div className="grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Warga"
            value={residentSummary?.totalJiwa ?? '—'}
            subtitle={`${residentSummary?.totalKK ?? 0} Kepala Keluarga`}
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard
            title="Saldo Kas"
            value={financeSummary ? formatRupiah(financeSummary.currentBalance) : '—'}
            subtitle="Saldo tersedia"
            icon={<Wallet className="h-4 w-4" />}
          />
          <StatCard
            title="Pemasukan"
            value={financeSummary ? formatRupiah(financeSummary.incomeThisMonth) : '—'}
            subtitle="Bulan ini"
            icon={<TrendingUp className="h-4 w-4 text-green-600" />}
          />
          <StatCard
            title="Pengeluaran"
            value={financeSummary ? formatRupiah(financeSummary.expensesThisMonth) : '—'}
            subtitle="Bulan ini"
            icon={<TrendingDown className="h-4 w-4 text-red-500" />}
          />
          <StatCard
            title="Iuran Bulan Ini"
            value={duesSummary ? `${duesSummary.paid}/${duesSummary.totalKK} KK` : '—'}
            subtitle={
              duesSummary
                ? `${duesSummary.pending} menunggu · ${duesSummary.unpaid} belum bayar`
                : 'Status iuran'
            }
            icon={<Receipt className="h-4 w-4" />}
          />
        </div>
        
        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Layanan Pending */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" /> Layanan Warga
                </CardTitle>
                <Link href="/layanan-warga" className="text-sm text-primary hover:underline">
                  Lihat semua
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{layananPending?.meta.total ?? 0}</p>
              <p className="text-sm text-muted-foreground mt-1">Permohonan menunggu</p>
            </CardContent>
          </Card>

          {/* Pengumuman Terbaru */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4" /> Pengumuman Terbaru
                </CardTitle>
                <Link href="/announcements" className="text-sm text-primary hover:underline">
                  Lihat semua
                </Link>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {announcements?.data.length ? (
                announcements.data.map((a) => (
                  <div key={a.id} className="flex items-start justify-between gap-2 text-sm">
                    <span className="line-clamp-1">{a.title}</span>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {a.category}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada pengumuman</p>
              )}
            </CardContent>
          </Card>

          {/* Kegiatan Upcoming */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarHeart className="h-4 w-4" /> Kegiatan Mendatang
                </CardTitle>
                <Link href="/kegiatan-warga" className="text-sm text-primary hover:underline">
                  Lihat semua
                </Link>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {kegiatanUpcoming?.data.length ? (
                kegiatanUpcoming.data.map((k) => (
                  <div key={k.id} className="text-sm">
                    <span className="font-medium line-clamp-1">{k.title}</span>
                    {k.startDate && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(k.startDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                        {k.location && ` · ${k.location}`}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada kegiatan</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
