'use client'

import { useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StatCard from '@/components/shared/StatCard'
import { MessageSquare, ThumbsUp, Eye, Clock, User } from 'lucide-react'
import { useGetSaranList, useGetSaranSummary } from './hooks/useGetSaranMasukan'
import { useRespondSaranMasukan } from './hooks/useSaranMasukanMutations'
import type { SaranMasukan, SaranStatus, SaranCategory } from '@/lib/api/saran-masukan'

const CATEGORY_LABELS: Record<SaranCategory, string> = {
  SARAN: 'Saran',
  KRITIK: 'Kritik',
  MASUKAN: 'Masukan',
  PUJIAN: 'Pujian',
}

const STATUS_CONFIG: Record<SaranStatus, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  BARU: { label: 'Baru', variant: 'default' },
  DIBACA: { label: 'Dibaca', variant: 'secondary' },
  DITANGGAPI: { label: 'Ditanggapi', variant: 'outline' },
}

// ─── Respond Dialog ───────────────────────────────────────────────────────────

function RespondDialog({ saran }: { saran: SaranMasukan }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<'DIBACA' | 'DITANGGAPI'>('DIBACA')
  const [response, setResponse] = useState(saran.adminResponse ?? '')
  const { mutateAsync, isPending, error } = useRespondSaranMasukan()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await mutateAsync({
        id: saran.id,
        data: {
          status,
          adminResponse: status === 'DITANGGAPI' ? response.trim() || undefined : undefined,
        },
      })
      setOpen(false)
    } catch {}
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          {saran.status === 'BARU' ? 'Tanggapi' : 'Edit Tanggapan'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tanggapi Saran & Masukan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm font-medium">{saran.subject}</p>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{saran.content}</p>
          </div>
          <div className="space-y-1.5">
            <Label>Ubah Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DIBACA">Tandai Dibaca</SelectItem>
                <SelectItem value="DITANGGAPI">Tandai Ditanggapi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {status === 'DITANGGAPI' && (
            <div className="space-y-1.5">
              <Label>Tanggapan Admin (opsional)</Label>
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Tulis tanggapan..."
                rows={4}
              />
            </div>
          )}
          {error && <p className="text-sm text-destructive">{String(error)}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Saran Card ───────────────────────────────────────────────────────────────

function SaranCard({ saran }: { saran: SaranMasukan }) {
  const statusCfg = STATUS_CONFIG[saran.status]
  const submitterName = saran.isAnonymous
    ? 'Anonim'
    : saran.submitter?.profile?.fullName ?? saran.submitter?.email ?? 'Pengguna'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base">{saran.subject}</CardTitle>
            <CardDescription className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline">{CATEGORY_LABELS[saran.category]}</Badge>
              <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-3.5 h-3.5" />
          {submitterName}
          <span>·</span>
          {new Date(saran.createdAt).toLocaleDateString('id-ID')}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-wrap">{saran.content}</p>
        {saran.adminResponse && (
          <div className="mt-3 p-3 rounded-md bg-muted text-sm">
            <p className="text-xs font-medium text-muted-foreground mb-1">Tanggapan Admin</p>
            <p className="whitespace-pre-wrap">{saran.adminResponse}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <RespondDialog saran={saran} />
      </CardFooter>
    </Card>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SaranMasukanPage() {
  const [tab, setTab] = useState<SaranStatus>('BARU')
  const { data: summary } = useGetSaranSummary()
  const { data, isLoading } = useGetSaranList({ status: tab, limit: 50 })
  const items = data?.data ?? []

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Saran & Masukan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-4 p-4 pt-0">
        <div>
          <h1 className="text-2xl font-bold">Saran & Masukan</h1>
          <p className="text-muted-foreground text-sm">Kelola aspirasi warga RT</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total"
            value={summary?.total ?? 0}
            subtitle="Semua masukan"
            icon={<MessageSquare className="text-muted-foreground w-4 h-4" />}
          />
          <StatCard
            title="Baru"
            value={summary?.baru ?? 0}
            subtitle="Menunggu ditanggapi"
            icon={<Clock className="text-muted-foreground w-4 h-4" />}
          />
          <StatCard
            title="Dibaca"
            value={summary?.dibaca ?? 0}
            subtitle="Sudah dibaca"
            icon={<Eye className="text-muted-foreground w-4 h-4" />}
          />
          <StatCard
            title="Ditanggapi"
            value={summary?.ditanggapi ?? 0}
            subtitle="Sudah ditanggapi"
            icon={<ThumbsUp className="text-muted-foreground w-4 h-4" />}
          />
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as SaranStatus)}>
          <TabsList>
            <TabsTrigger value="BARU" className="gap-1.5">
              Baru
              {(summary?.baru ?? 0) > 0 && (
                <Badge className="h-5 px-1.5 text-xs">{summary?.baru}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="DIBACA">Dibaca</TabsTrigger>
            <TabsTrigger value="DITANGGAPI">Ditanggapi</TabsTrigger>
          </TabsList>
          {(['BARU', 'DIBACA', 'DITANGGAPI'] as SaranStatus[]).map((status) => (
            <TabsContent key={status} value={status}>
              {isLoading ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Memuat...</p>
              ) : items.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Belum ada masukan.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((s) => (
                    <SaranCard key={s.id} saran={s} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </SidebarInset>
  )
}
