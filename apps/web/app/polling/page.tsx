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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CirclePlus, Trash2, CheckCircle, XCircle, Users, Calendar, Lock } from 'lucide-react'
import { useGetPollingList } from './hooks/useGetPollingList'
import { useCreatePolling } from './hooks/useCreatePolling'
import { useClosePolling, useDeletePolling } from './hooks/usePollingActions'
import type { Polling, PollingStatus } from '@/lib/api/polling'

// ─── Status Badge ───────────────────────────────────────────────────────────

function PollingStatusBadge({ status }: { status: PollingStatus }) {
  const map: Record<PollingStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    AKTIF: { label: 'Aktif', variant: 'default' },
    SELESAI: { label: 'Selesai', variant: 'secondary' },
    DIBATALKAN: { label: 'Dibatalkan', variant: 'destructive' },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

// ─── Vote Bar ───────────────────────────────────────────────────────────────

function VoteBar({ label, votes, total }: { label: string; votes: number; total: number }) {
  const pct = total > 0 ? Math.round((votes / total) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="truncate">{label}</span>
        <span className="text-muted-foreground shrink-0 ml-2">{votes} ({pct}%)</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ─── Polling Card ────────────────────────────────────────────────────────────

function PollingCard({ polling }: { polling: Polling }) {
  const { mutateAsync: close, isPending: closing } = useClosePolling()
  const { mutateAsync: remove, isPending: removing } = useDeletePolling()
  const totalVotes = polling._count.votes

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base">{polling.title}</CardTitle>
            {polling.description && (
              <CardDescription className="mt-1">{polling.description}</CardDescription>
            )}
          </div>
          <PollingStatusBadge status={polling.status} />
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" /> {totalVotes} suara
          </span>
          {polling.deadline && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(polling.deadline).toLocaleDateString('id-ID')}
            </span>
          )}
          {polling.isAnonymous && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Lock className="w-4 h-4" /> Anonim
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {polling.options.map((opt) => (
          <VoteBar
            key={opt.id}
            label={opt.label}
            votes={opt._count?.votes ?? 0}
            total={totalVotes}
          />
        ))}
      </CardContent>
      {polling.status === 'AKTIF' && (
        <CardFooter className="gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1" disabled={closing}>
                <CheckCircle className="w-4 h-4" /> Tutup
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tutup polling?</AlertDialogTitle>
                <AlertDialogDescription>
                  Polling akan ditandai selesai dan tidak dapat divoting lagi.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => close({ id: polling.id, status: 'SELESAI' })}>
                  Tutup
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1 text-destructive hover:text-destructive" disabled={closing}>
                <XCircle className="w-4 h-4" /> Batalkan
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Batalkan polling?</AlertDialogTitle>
                <AlertDialogDescription>
                  Polling akan dibatalkan dan tidak dapat divoting lagi.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => close({ id: polling.id, status: 'DIBATALKAN' })}
                >
                  Batalkan
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="ml-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" disabled={removing}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus polling?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Semua data suara akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => remove(polling.id)}
                  >
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter>
      )}
      {polling.status !== 'AKTIF' && (
        <CardFooter>
          <div className="ml-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" disabled={removing}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus polling?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Semua data suara akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => remove(polling.id)}
                  >
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

// ─── Buat Polling Modal ──────────────────────────────────────────────────────

function BuatPollingModal() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [options, setOptions] = useState(['', ''])
  const { mutateAsync, isPending, error } = useCreatePolling()

  const setOption = (idx: number, value: string) => {
    setOptions((prev) => prev.map((o, i) => (i === idx ? value : o)))
  }

  const addOption = () => setOptions((prev) => [...prev, ''])
  const removeOption = (idx: number) => {
    if (options.length <= 2) return
    setOptions((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const filteredOptions = options.map((o) => o.trim()).filter(Boolean)
    if (filteredOptions.length < 2) return
    try {
      await mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        deadline: deadline || undefined,
        isAnonymous,
        options: filteredOptions,
      })
      setTitle('')
      setDescription('')
      setDeadline('')
      setIsAnonymous(false)
      setOptions(['', ''])
      setOpen(false)
    } catch {}
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <CirclePlus className="w-4 h-4" /> Buat Polling
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Buat Polling Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Judul *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Judul polling" />
          </div>
          <div className="space-y-1.5">
            <Label>Deskripsi</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opsional" rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label>Batas Waktu (opsional)</Label>
            <Input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Voting Anonim</Label>
            <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
          </div>
          <div className="space-y-2">
            <Label>Pilihan (min. 2) *</Label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  value={opt}
                  onChange={(e) => setOption(idx, e.target.value)}
                  placeholder={`Pilihan ${idx + 1}`}
                />
                {options.length > 2 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(idx)}>
                    <XCircle className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addOption}>
              + Tambah Pilihan
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{String(error)}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Buat Polling'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function PollingPage() {
  const [tab, setTab] = useState<PollingStatus>('AKTIF')

  const { data, isLoading } = useGetPollingList({ status: tab, limit: 50 })
  const pollings = data?.data ?? []

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Polling Warga</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Polling Warga</h1>
            <p className="text-muted-foreground text-sm">Kelola polling dan voting warga RT</p>
          </div>
          <BuatPollingModal />
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as PollingStatus)}>
          <TabsList>
            <TabsTrigger value="AKTIF">Aktif</TabsTrigger>
            <TabsTrigger value="SELESAI">Selesai</TabsTrigger>
            <TabsTrigger value="DIBATALKAN">Dibatalkan</TabsTrigger>
          </TabsList>
          {(['AKTIF', 'SELESAI', 'DIBATALKAN'] as PollingStatus[]).map((status) => (
            <TabsContent key={status} value={status}>
              {isLoading ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Memuat...</p>
              ) : pollings.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Belum ada polling.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {pollings.map((p) => (
                    <PollingCard key={p.id} polling={p} />
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
