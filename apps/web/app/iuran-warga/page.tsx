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
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Users, CheckCircle, XCircle, Wallet, AlertTriangle, Clock } from 'lucide-react'
import StatCard from '@/components/shared/StatCard'
import type { DelinquentHousehold } from '@/lib/api/dues'
import {
  useGetDues,
  useGetDuesSummary,
  useGetPendingCount,
  useGenerateDues,
  usePayDues,
  useUnpayDues,
  useGetDelinquent,
  useBatchPayDues,
  useRejectPay,
  useGetHouseholdDues,
} from './hooks/useDues'
import { useAuth } from '@/provider/auth-provider'

function formatRupiah(amount: number | string) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(amount))
}

function getCurrentPeriod() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function formatPeriod(period: string) {
  const [year, month] = period.split('-')
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  })
}

function getPeriodOptions() {
  const options: { label: string; value: string }[] = []
  const now = new Date()
  for (let i = -12; i <= 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    options.push({ value, label })
  }
  return options
}

export default function IuranWargaPage() {
  const { user } = useAuth()
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'
  const [period, setPeriod] = useState(getCurrentPeriod())
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [generateOpen, setGenerateOpen] = useState(false)
  const [generateAmount, setGenerateAmount] = useState('')
  const [activeTab, setActiveTab] = useState('daftar')
  const [minMonths, setMinMonths] = useState(3)
  const [lookback, setLookback] = useState(6)
  const [batchPayOpen, setBatchPayOpen] = useState(false)
  const [selectedHousehold, setSelectedHousehold] = useState<DelinquentHousehold | null>(null)
  const [selectedBillingIds, setSelectedBillingIds] = useState<string[]>([])
  const [batchPayNotes, setBatchPayNotes] = useState('')
  const [historyHouseholdId, setHistoryHouseholdId] = useState<string | null>(null)
  const [historyHouseholdName, setHistoryHouseholdName] = useState('')

  const queryParams = {
    period: (period && period !== 'all') ? period : undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
  }

  const { data: duesData, isLoading } = useGetDues(queryParams)
  const { data: summary } = useGetDuesSummary(period)
  const { data: pendingCount = 0 } = useGetPendingCount()
  const generateMutation = useGenerateDues()
  const payMutation = usePayDues()
  const unpayMutation = useUnpayDues()
  const { data: delinquentData, isLoading: isDelinquentLoading } = useGetDelinquent({ minMonths, lookback })
  const batchPayMutation = useBatchPayDues()
  const rejectPayMutation = useRejectPay()
  const { data: householdHistory, isLoading: isHistoryLoading } = useGetHouseholdDues(historyHouseholdId)

  const periodOptions = getPeriodOptions()

  const handleGenerate = async () => {
    if (!generateAmount || Number(generateAmount) <= 0) return
    await generateMutation.mutateAsync({
      period,
      amount: Number(generateAmount),
    })
    setGenerateOpen(false)
    setGenerateAmount('')
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
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Keuangan</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Iuran Warga</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="daftar">
              Daftar Iuran
              {pendingCount > 0 && (
                <span className="ml-2 rounded-full bg-amber-500 text-white text-xs px-1.5 py-0.5">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="tunggakan">
              Tunggakan
              {delinquentData && delinquentData.length > 0 && (
                <span className="ml-2 rounded-full bg-red-500 text-white text-xs px-1.5 py-0.5">
                  {delinquentData.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daftar" className="flex flex-col gap-6">
            {/* Pending alert banner */}
            {pendingCount > 0 && (
              <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
                <Clock className="h-5 w-5 shrink-0 text-amber-500" />
                <div className="flex-1">
                  <span className="font-semibold">{pendingCount} warga</span> telah mengklaim pembayaran dan menunggu konfirmasi Anda.
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-amber-300 text-amber-800 hover:bg-amber-100"
                  onClick={() => {
                    setPeriod('all')
                    setStatusFilter('PENDING')
                  }}
                >
                  Lihat Sekarang
                </Button>
              </div>
            )}
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div className="flex items-end gap-4">
                <div className="grid gap-1.5">
                  <Label>Periode</Label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-52">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Periode</SelectItem>
                      {periodOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
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
                      <SelectItem value="PENDING">Menunggu Konfirmasi</SelectItem>
                      <SelectItem value="UNPAID">Belum Bayar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {isSuperAdmin && (
                <Button onClick={() => setGenerateOpen(true)}>
                  Generate Tagihan
                </Button>
              )}
            </div>

            {/* Summary cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              <StatCard
                title="Total KK Ditagih"
                value={summary?.totalKK ?? 0}
                subtitle={formatPeriod(period)}
                icon={<Users className="h-4 w-4" />}
                onClick={() => setStatusFilter('all')}
              />
              <StatCard
                title="Sudah Bayar"
                value={summary?.paid ?? 0}
                subtitle="KK lunas"
                icon={<CheckCircle className="h-4 w-4 text-green-600" />}
                onClick={() => setStatusFilter('PAID')}
              />
              <StatCard
                title="Menunggu Konfirmasi"
                value={pendingCount}
                subtitle="Semua periode"
                icon={<Clock className="h-4 w-4 text-amber-500" />}
                onClick={() => {
                  setPeriod('all')
                  setStatusFilter('PENDING')
                }}
              />
              <StatCard
                title="Belum Bayar"
                value={summary?.unpaid ?? 0}
                subtitle="KK tertunggak"
                icon={<XCircle className="h-4 w-4 text-red-600" />}
                onClick={() => setStatusFilter('UNPAID')}
              />
              <StatCard
                title="Total Terkumpul"
                value={formatRupiah(summary?.totalCollected ?? 0)}
                subtitle="Dari yang sudah bayar"
                icon={<Wallet className="h-4 w-4 text-green-600" />}
                onClick={() => setStatusFilter('PAID')}
              />
              <StatCard
                title="Total Diharapkan"
                value={formatRupiah(summary?.totalExpected ?? 0)}
                subtitle="Dari semua tagihan"
                icon={<Wallet className="h-4 w-4" />}
                onClick={() => setStatusFilter('all')}
              />
            </div>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>Daftar Iuran{(period && period !== 'all') ? ` - ${formatPeriod(period)}` : ' - Semua Periode'}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Memuat data...</p>
                ) : !duesData?.data.length ? (
                  <p className="text-sm text-muted-foreground">
                    Belum ada tagihan untuk periode ini. Klik &quot;Generate Tagihan&quot; untuk membuat.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No KK</TableHead>
                        <TableHead>Kepala Keluarga</TableHead>
                        <TableHead>Blok/No</TableHead>
                        <TableHead>Periode</TableHead>
                        <TableHead className="text-right">Nominal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tgl Bayar</TableHead>
                        <TableHead>Catatan</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {duesData.data.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-mono text-sm">
                            {row.household.kkNumber}
                          </TableCell>
                          <TableCell>
                            <button
                              className="text-left font-medium hover:underline hover:text-primary"
                              onClick={() => {
                                setHistoryHouseholdId(row.household.id)
                                setHistoryHouseholdName(row.household.kepalaKeluarga)
                              }}
                            >
                              {row.household.kepalaKeluarga}
                            </button>
                          </TableCell>
                          <TableCell>
                            {row.household.blok ?? '-'}/{row.household.houseNumber ?? '-'}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatPeriod(row.period)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatRupiah(row.amount)}
                          </TableCell>
                          <TableCell>
                            {row.status === 'PAID' ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                Lunas
                              </Badge>
                            ) : row.status === 'PENDING' ? (
                              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                Menunggu Konfirmasi
                              </Badge>
                            ) : (
                              <Badge variant="destructive">Belum Bayar</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {row.paidAt
                              ? new Date(row.paidAt).toLocaleDateString('id-ID')
                              : '-'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {row.notes ?? '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {isSuperAdmin && (
                              row.status === 'UNPAID' ? (
                                <Button
                                  size="sm"
                                  onClick={() => payMutation.mutate({ id: row.id })}
                                  disabled={payMutation.isPending}
                                >
                                  Tandai Lunas
                                </Button>
                              ) : row.status === 'PENDING' ? (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => payMutation.mutate({ id: row.id })}
                                    disabled={payMutation.isPending}
                                  >
                                    Konfirmasi
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => rejectPayMutation.mutate(row.id)}
                                    disabled={rejectPayMutation.isPending}
                                  >
                                    Tolak
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => unpayMutation.mutate(row.id)}
                                  disabled={unpayMutation.isPending}
                                >
                                  Batalkan
                                </Button>
                              )
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tunggakan" className="flex flex-col gap-6">
            {/* Filter tunggakan */}
            <div className="flex items-end gap-4 flex-wrap">
              <div className="grid gap-1.5">
                <Label>Minimum Bulan Tunggak</Label>
                <Select
                  value={String(minMonths)}
                  onValueChange={(v) => setMinMonths(Number(v))}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5, 6].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        ≥ {n} bulan
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Lihat Berapa Bulan Terakhir</Label>
                <Select
                  value={String(lookback)}
                  onValueChange={(v) => setLookback(Number(v))}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 6, 9, 12].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} bulan terakhir
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Summary */}
            {delinquentData && delinquentData.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
                <AlertTriangle className="h-4 w-4" />
                {delinquentData.length} KK menunggak ≥ {minMonths} bulan dalam {lookback} bulan terakhir
              </div>
            )}

            {/* Tabel tunggakan */}
            <Card>
              <CardHeader>
                <CardTitle>KK yang Menunggak ≥ {minMonths} Bulan</CardTitle>
              </CardHeader>
              <CardContent>
                {isDelinquentLoading ? (
                  <p className="text-sm text-muted-foreground">Memuat data...</p>
                ) : !delinquentData?.length ? (
                  <p className="text-sm text-muted-foreground">
                    Tidak ada KK yang menunggak ≥ {minMonths} bulan dalam {lookback} bulan terakhir.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No KK</TableHead>
                        <TableHead>Kepala Keluarga</TableHead>
                        <TableHead>Blok/No</TableHead>
                        <TableHead>Bulan Belum Bayar</TableHead>
                        <TableHead className="text-right">Total Tunggakan</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {delinquentData.map((row) => (
                        <TableRow key={row.household.id}>
                          <TableCell className="font-mono text-sm">
                            {row.household.kkNumber}
                          </TableCell>
                          <TableCell>{row.household.kepalaKeluarga}</TableCell>
                          <TableCell>
                            {row.household.blok ?? '-'}/{row.household.houseNumber ?? '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {row.unpaidPeriods.map((p) => (
                                <Badge key={p.id} variant="destructive" className="text-xs">
                                  {formatPeriod(p.period)}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium text-red-600">
                            {formatRupiah(row.totalAmount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {isSuperAdmin && (
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    batchPayMutation.mutate({
                                      ids: row.unpaidPeriods.map((p) => p.id),
                                    })
                                  }
                                  disabled={batchPayMutation.isPending}
                                >
                                  Lunasi Semua
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedHousehold(row)
                                    setSelectedBillingIds(row.unpaidPeriods.map((p) => p.id))
                                    setBatchPayNotes('')
                                    setBatchPayOpen(true)
                                  }}
                                >
                                  Pilih Bulan
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Generate Dialog */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Generate Tagihan Iuran</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label>Periode</Label>
              <Input value={formatPeriod(period)} disabled />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="amount">Nominal Iuran per KK</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Contoh: 100000"
                value={generateAmount}
                onChange={(e) => setGenerateAmount(e.target.value)}
              />
            </div>
            {generateMutation.isSuccess && (
              <p className="text-sm text-green-600">
                {generateMutation.data?.message}
              </p>
            )}
            {generateMutation.isError && (
              <p className="text-sm text-red-500">
                {(generateMutation.error as Error)?.message ?? 'Terjadi kesalahan'}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending || !generateAmount}
            >
              {generateMutation.isPending ? 'Memproses...' : 'Generate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Pay Dialog */}
      <Dialog open={batchPayOpen} onOpenChange={setBatchPayOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              Bayar Tunggakan - {selectedHousehold?.household.kepalaKeluarga}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <p className="text-sm text-muted-foreground">
              Pilih bulan yang akan dilunasi:
            </p>
            {selectedHousehold?.unpaidPeriods.map((p) => (
              <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedBillingIds.includes(p.id)}
                  onCheckedChange={(checked) => {
                    setSelectedBillingIds((prev) =>
                      checked
                        ? [...prev, p.id]
                        : prev.filter((id) => id !== p.id)
                    )
                  }}
                />
                <span className="text-sm">{formatPeriod(p.period)}</span>
              </label>
            ))}
            <div className="grid gap-1.5 mt-2">
              <Label>Catatan (opsional)</Label>
              <Input
                value={batchPayNotes}
                onChange={(e) => setBatchPayNotes(e.target.value)}
                placeholder="Contoh: Transfer via BCA"
              />
            </div>
            {batchPayMutation.isSuccess && (
              <p className="text-sm text-green-600">
                {batchPayMutation.data?.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchPayOpen(false)}>
              Batal
            </Button>
            <Button
              disabled={selectedBillingIds.length === 0 || batchPayMutation.isPending}
              onClick={async () => {
                await batchPayMutation.mutateAsync({
                  ids: selectedBillingIds,
                  notes: batchPayNotes || undefined,
                })
                setBatchPayOpen(false)
              }}
            >
              {batchPayMutation.isPending
                ? 'Memproses...'
                : `Bayar ${selectedBillingIds.length} Bulan`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* History Pembayaran Dialog */}
      <Dialog open={!!historyHouseholdId} onOpenChange={(open) => !open && setHistoryHouseholdId(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>History Pembayaran — {historyHouseholdName}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            {isHistoryLoading ? (
              <p className="text-sm text-muted-foreground">Memuat history...</p>
            ) : !householdHistory?.length ? (
              <p className="text-sm text-muted-foreground">Belum ada riwayat tagihan.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Periode</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tgl Bayar</TableHead>
                    <TableHead>Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {householdHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-sm">{formatPeriod(item.period)}</TableCell>
                      <TableCell className="text-right">{formatRupiah(item.amount)}</TableCell>
                      <TableCell>
                        {item.status === 'PAID' ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Lunas</Badge>
                        ) : item.status === 'PENDING' ? (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Menunggu</Badge>
                        ) : (
                          <Badge variant="destructive">Belum Bayar</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.paidAt ? new Date(item.paidAt).toLocaleDateString('id-ID') : '-'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.notes ?? '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </SidebarInset>
  )
}
