'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { duesApi } from '@/lib/api/dues'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Wallet, CheckCircle, XCircle, Clock } from 'lucide-react'
import StatCard from '@/components/shared/StatCard'
import { useAuth } from '@/provider/auth-provider'
import { useRouter } from 'next/navigation'
import { useRequestPay } from '@/app/iuran-warga/hooks/useDues'
import Link from 'next/link'

function formatRupiah(amount: number | string) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(amount))
}

function formatPeriod(period: string) {
  const [year, month] = period.split('-')
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  })
}

export default function PortalWargaPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [yearFilter, setYearFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const { data, isLoading, error } = useQuery({
    queryKey: ['dues', 'my'],
    queryFn: () => duesApi.getMyDues(),
  })

  const requestPayMutation = useRequestPay()

  const summary = useMemo(() => {
    if (!data) return null
    const totalTagihan = data.billings.reduce((s, b) => s + Number(b.amount), 0)
    const sudahBayar = data.billings
      .filter((b) => b.status === 'PAID')
      .reduce((s, b) => s + Number(b.amount), 0)
    const menunggu = data.billings
      .filter((b) => b.status === 'PENDING')
      .reduce((s, b) => s + Number(b.amount), 0)
    const belumBayar = data.billings
      .filter((b) => b.status === 'UNPAID')
      .reduce((s, b) => s + Number(b.amount), 0)
    return { totalTagihan, sudahBayar, menunggu, belumBayar }
  }, [data])

  const years = useMemo(() => {
    if (!data) return []
    const set = new Set(data.billings.map((b) => b.period.split('-')[0]))
    return Array.from(set).sort().reverse()
  }, [data])

  const filteredBillings = useMemo(() => {
    if (!data) return []
    return data.billings.filter((b) => {
      if (yearFilter !== 'all' && !b.period.startsWith(yearFilter)) return false
      if (statusFilter !== 'all' && b.status !== statusFilter) return false
      return true
    })
  }, [data, yearFilter, statusFilter])

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Portal Warga Rukunin</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/account/profile">Ubah Data</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat data...</p>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
            Gagal memuat data. Pastikan email kamu terdaftar di data warga RT.
          </div>
        ) : data ? (
          <div className="flex flex-col gap-6">
            {/* Info KK */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi KK</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">No KK</dt>
                    <dd className="font-mono font-medium">{data.household.kkNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Blok/No Rumah</dt>
                    <dd className="font-medium">
                      {data.household.blok ?? '-'}/{data.household.houseNumber ?? '-'}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            {summary && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Total Tagihan"
                  value={formatRupiah(summary.totalTagihan)}
                  icon={<Wallet className="h-4 w-4" />}
                />
                <StatCard
                  title="Sudah Bayar"
                  value={formatRupiah(summary.sudahBayar)}
                  icon={<CheckCircle className="h-4 w-4 text-green-600" />}
                />
                <StatCard
                  title="Menunggu Konfirmasi"
                  value={formatRupiah(summary.menunggu)}
                  icon={<Clock className="h-4 w-4 text-amber-500" />}
                />
                <StatCard
                  title="Belum Bayar"
                  value={formatRupiah(summary.belumBayar)}
                  icon={<XCircle className="h-4 w-4 text-red-600" />}
                />
              </div>
            )}

            {/* Filters */}
            <div className="flex items-end gap-4">
              <div className="grid gap-1.5">
                <Label>Tahun</Label>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="PAID">Lunas</SelectItem>
                    <SelectItem value="PENDING">Menunggu</SelectItem>
                    <SelectItem value="UNPAID">Belum Bayar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* History Iuran */}
            <Card>
              <CardHeader>
                <CardTitle>History Iuran</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredBillings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Belum ada tagihan iuran.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10" />
                        <TableHead>Periode</TableHead>
                        <TableHead className="text-right">Nominal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tgl Bayar</TableHead>
                        <TableHead>Catatan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBillings.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell>
                            {b.status === 'UNPAID' && (
                              <Checkbox
                                checked={selectedIds.includes(b.id)}
                                onCheckedChange={(checked) => {
                                  setSelectedIds((prev) =>
                                    checked
                                      ? [...prev, b.id]
                                      : prev.filter((id) => id !== b.id)
                                  )
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell>{formatPeriod(b.period)}</TableCell>
                          <TableCell className="text-right">
                            {formatRupiah(b.amount)}
                          </TableCell>
                          <TableCell>
                            {b.status === 'PAID' ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                Lunas
                              </Badge>
                            ) : b.status === 'PENDING' ? (
                              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                Menunggu
                              </Badge>
                            ) : (
                              <Badge variant="destructive">Belum Bayar</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {b.paidAt
                              ? new Date(b.paidAt).toLocaleDateString('id-ID')
                              : '-'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {b.notes ?? '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {/* Tombol Sudah Bayar */}
                {selectedIds.length > 0 && (
                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <p className="text-sm text-muted-foreground">
                      {selectedIds.length} bulan dipilih
                    </p>
                    <Button
                      onClick={async () => {
                        await requestPayMutation.mutateAsync(selectedIds)
                        setSelectedIds([])
                      }}
                      disabled={requestPayMutation.isPending}
                    >
                      {requestPayMutation.isPending ? 'Mengirim...' : 'Sudah Bayar'}
                    </Button>
                  </div>
                )}

                {requestPayMutation.isSuccess && (
                  <p className="mt-3 text-sm text-green-600">
                    {requestPayMutation.data?.message}
                  </p>
                )}
                {requestPayMutation.isError && (
                  <p className="mt-3 text-sm text-red-500">
                    {(requestPayMutation.error as Error)?.message ?? 'Terjadi kesalahan'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </main>
    </div>
  )
}
