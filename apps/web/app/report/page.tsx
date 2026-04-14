'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { useState } from 'react'
import { useGetFinancialReport, useGetResidentsReport } from './hooks/useGetReport'
import { TrendingUp, TrendingDown, Wallet, Users } from 'lucide-react'

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatMonth(monthKey: string) {
  const [year, month] = monthKey.split('-')
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  })
}

export default function ReportPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filterParams, setFilterParams] = useState<{
    startDate?: string
    endDate?: string
  }>({})

  const { data: financial, isLoading: loadingFinancial } =
    useGetFinancialReport(filterParams)
  const { data: residents, isLoading: loadingResidents } =
    useGetResidentsReport()

  const handleFilter = () => {
    setFilterParams({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
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
                <BreadcrumbPage>Laporan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="m-6 space-y-6">

        {/* Filter tanggal */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Periode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 flex-wrap">
              <div className="grid gap-1.5">
                <Label htmlFor="startDate">Dari Tanggal</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-44"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="endDate">Sampai Tanggal</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-44"
                />
              </div>
              <Button onClick={handleFilter}>Terapkan</Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary keuangan */}
        {loadingFinancial ? (
          <p className="text-sm text-muted-foreground">Memuat laporan keuangan...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Pemasukan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-xl font-bold text-green-600">
                      {formatRupiah(financial?.summary.totalIn ?? 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Pengeluaran
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-xl font-bold text-red-600">
                      {formatRupiah(financial?.summary.totalOut ?? 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Saldo Kas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-blue-600" />
                    <span className="text-xl font-bold text-blue-600">
                      {formatRupiah(financial?.summary.currentBalance ?? 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Transaksi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-xl font-bold">
                    {financial?.summary.transactionCount ?? 0}
                  </span>
                </CardContent>
              </Card>
            </div>

            {/* Breakdown per bulan */}
            {financial && financial.byMonth.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Rekap per Bulan</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bulan</TableHead>
                        <TableHead className="text-right">Pemasukan</TableHead>
                        <TableHead className="text-right">Pengeluaran</TableHead>
                        <TableHead className="text-right">Selisih</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {financial.byMonth.map((row) => (
                        <TableRow key={row.month}>
                          <TableCell>{formatMonth(row.month)}</TableCell>
                          <TableCell className="text-right text-green-600">
                            {formatRupiah(row.in)}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {formatRupiah(row.out)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${row.net >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {formatRupiah(row.net)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Breakdown per kategori */}
            {financial && financial.byCategory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Rekap per Kategori</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kategori</TableHead>
                        <TableHead className="text-right">Pemasukan</TableHead>
                        <TableHead className="text-right">Pengeluaran</TableHead>
                        <TableHead className="text-right">Selisih</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {financial.byCategory.map((row) => (
                        <TableRow key={row.category}>
                          <TableCell className="capitalize">{row.category}</TableCell>
                          <TableCell className="text-right text-green-600">
                            {formatRupiah(row.in)}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {formatRupiah(row.out)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${row.net >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {formatRupiah(row.net)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Statistik warga */}
        {loadingResidents ? (
          <p className="text-sm text-muted-foreground">Memuat statistik warga...</p>
        ) : residents && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> Total Warga
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-3xl font-bold">{residents.total}</span>
                <p className="text-sm text-muted-foreground">warga terdaftar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Per Blok</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {residents.byBlok.map((r) => (
                      <TableRow key={r.blok}>
                        <TableCell>Blok {r.blok}</TableCell>
                        <TableCell className="text-right font-medium">
                          {r.count} warga
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Kepemilikan</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {residents.byOwnership.map((r) => (
                      <TableRow key={r.ownershipStatus}>
                        <TableCell className="capitalize">
                          {r.ownershipStatus}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {r.count}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </SidebarInset>
  )
}
