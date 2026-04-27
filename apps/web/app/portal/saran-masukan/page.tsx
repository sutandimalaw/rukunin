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
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Send } from 'lucide-react'
import { useGetMySaran } from '@/app/saran-masukan/hooks/useGetSaranMasukan'
import { useCreateSaranMasukan } from '@/app/saran-masukan/hooks/useSaranMasukanMutations'
import type { SaranCategory, SaranStatus, SaranMasukan } from '@/lib/api/saran-masukan'

const CATEGORY_OPTIONS: { value: SaranCategory; label: string }[] = [
  { value: 'SARAN', label: 'Saran' },
  { value: 'KRITIK', label: 'Kritik' },
  { value: 'MASUKAN', label: 'Masukan' },
  { value: 'PUJIAN', label: 'Pujian' },
]

const STATUS_CONFIG: Record<SaranStatus, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  BARU: { label: 'Baru', variant: 'default' },
  DIBACA: { label: 'Dibaca', variant: 'secondary' },
  DITANGGAPI: { label: 'Ditanggapi', variant: 'outline' },
}

// ─── My Saran Card ────────────────────────────────────────────────────────────

function MySaranCard({ saran }: { saran: SaranMasukan }) {
  const statusCfg = STATUS_CONFIG[saran.status]
  const categoryLabel = CATEGORY_OPTIONS.find((c) => c.value === saran.category)?.label ?? saran.category

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{saran.subject}</CardTitle>
          <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
        </div>
        <CardDescription className="flex gap-2">
          <Badge variant="outline">{categoryLabel}</Badge>
          {saran.isAnonymous && <Badge variant="secondary">Anonim</Badge>}
          <span className="text-xs">{new Date(saran.createdAt).toLocaleDateString('id-ID')}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm whitespace-pre-wrap">{saran.content}</p>
        {saran.adminResponse && (
          <div className="p-3 rounded-md bg-muted text-sm">
            <p className="text-xs font-medium text-muted-foreground mb-1">Tanggapan RT</p>
            <p className="whitespace-pre-wrap">{saran.adminResponse}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Kirim Form ───────────────────────────────────────────────────────────────

function KirimSaranForm() {
  const [category, setCategory] = useState<SaranCategory>('SARAN')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [sent, setSent] = useState(false)
  const { mutateAsync, isPending, error } = useCreateSaranMasukan()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await mutateAsync({
        category,
        subject: subject.trim(),
        content: content.trim(),
        isAnonymous,
      })
      setCategory('SARAN')
      setSubject('')
      setContent('')
      setIsAnonymous(false)
      setSent(true)
      setTimeout(() => setSent(false), 3000)
    } catch {}
  }

  if (sent) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-lg font-medium text-primary mb-1">Terima kasih!</p>
          <p className="text-sm text-muted-foreground">Masukan Anda telah dikirim ke pengurus RT.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Kirim Saran atau Masukan</CardTitle>
        <CardDescription>Sampaikan aspirasi Anda kepada pengurus RT</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Jenis *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as SaranCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Subjek *</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Judul singkat"
              maxLength={200}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Isi *</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Tuliskan masukan Anda di sini..."
              rows={4}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Kirim Anonim</Label>
              <p className="text-xs text-muted-foreground">Nama Anda tidak akan ditampilkan</p>
            </div>
            <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
          </div>
          {error && <p className="text-sm text-destructive">{String(error)}</p>}
          <Button type="submit" disabled={isPending} className="w-full gap-2">
            <Send className="w-4 h-4" />
            {isPending ? 'Mengirim...' : 'Kirim'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PortalSaranMasukanPage() {
  const { data, isLoading } = useGetMySaran({ limit: 50 })
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
                <BreadcrumbLink href="/portal">Portal</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Saran & Masukan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-6 p-4 pt-0">
        <div>
          <h1 className="text-2xl font-bold">Saran & Masukan</h1>
          <p className="text-muted-foreground text-sm">Sampaikan aspirasi kepada pengurus RT</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <KirimSaranForm />
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Riwayat Saya</h2>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Memuat...</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada masukan yang dikirim.</p>
            ) : (
              <div className="space-y-3">
                {items.map((s) => (
                  <MySaranCard key={s.id} saran={s} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
