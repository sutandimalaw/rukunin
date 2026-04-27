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
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Calendar, Lock, CheckCircle2 } from 'lucide-react'
import { useGetPollingList } from '@/app/polling/hooks/useGetPollingList'
import { useVotePolling } from '@/app/polling/hooks/usePollingActions'
import type { Polling, PollingOption, PollingStatus } from '@/lib/api/polling'

// ─── Vote Bar ─────────────────────────────────────────────────────────────────

function VoteBar({ label, votes, total, isMyVote }: { label: string; votes: number; total: number; isMyVote: boolean }) {
  const pct = total > 0 ? Math.round((votes / total) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className={`truncate font-medium ${isMyVote ? 'text-primary' : ''}`}>
          {isMyVote && <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-primary" />}
          {label}
        </span>
        <span className="text-muted-foreground shrink-0 ml-2">{votes} ({pct}%)</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isMyVote ? 'bg-primary' : 'bg-primary/40'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Active Polling Card ──────────────────────────────────────────────────────

function ActivePollingCard({ polling }: { polling: Polling }) {
  const { mutate: vote, isPending } = useVotePolling()
  const myVoteOptionId = polling.votes?.[0]?.optionId
  const totalVotes = polling._count.votes

  const handleVote = (optionId: string) => {
    vote({ pollingId: polling.id, optionId })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{polling.title}</CardTitle>
        {polling.description && <CardDescription>{polling.description}</CardDescription>}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground pt-1">
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
            <span className="flex items-center gap-1">
              <Lock className="w-4 h-4" /> Anonim
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {myVoteOptionId ? (
          // Show results if already voted
          <>
            <p className="text-xs text-muted-foreground mb-2">Hasil voting (klik opsi untuk ganti pilihan):</p>
            <div className="space-y-2">
              {polling.options.map((opt) => (
                <button
                  key={opt.id}
                  className="w-full text-left"
                  onClick={() => handleVote(opt.id)}
                  disabled={isPending}
                >
                  <VoteBar
                    label={opt.label}
                    votes={opt._count?.votes ?? 0}
                    total={totalVotes}
                    isMyVote={opt.id === myVoteOptionId}
                  />
                </button>
              ))}
            </div>
          </>
        ) : (
          // Show option buttons to vote
          <>
            <p className="text-xs text-muted-foreground mb-2">Pilih salah satu:</p>
            <div className="space-y-2">
              {polling.options.map((opt) => (
                <Button
                  key={opt.id}
                  variant="outline"
                  className="w-full justify-start h-auto py-2.5 px-4"
                  onClick={() => handleVote(opt.id)}
                  disabled={isPending}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Completed Polling Card ───────────────────────────────────────────────────

function CompletedPollingCard({ polling }: { polling: Polling }) {
  const myVoteOptionId = polling.votes?.[0]?.optionId
  const totalVotes = polling._count.votes
  const statusLabel = polling.status === 'SELESAI' ? 'Selesai' : 'Dibatalkan'
  const statusVariant = polling.status === 'SELESAI' ? 'secondary' : 'destructive'

  return (
    <Card className="opacity-90">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{polling.title}</CardTitle>
            {polling.description && <CardDescription>{polling.description}</CardDescription>}
          </div>
          <Badge variant={statusVariant as 'secondary' | 'destructive'}>{statusLabel}</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
          <Users className="w-4 h-4" /> {totalVotes} suara
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {polling.options.map((opt) => (
          <VoteBar
            key={opt.id}
            label={opt.label}
            votes={opt._count?.votes ?? 0}
            total={totalVotes}
            isMyVote={opt.id === myVoteOptionId}
          />
        ))}
      </CardContent>
    </Card>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PortalPollingPage() {
  const { data: aktifData, isLoading: loadingAktif } = useGetPollingList({ status: 'AKTIF', limit: 50 })
  const { data: selesaiData, isLoading: loadingSelesai } = useGetPollingList({ status: 'SELESAI', limit: 20 })
  const { data: batalData } = useGetPollingList({ status: 'DIBATALKAN', limit: 20 })

  const aktifPollings = aktifData?.data ?? []
  const selesaiPollings = selesaiData?.data ?? []
  const batalPollings = batalData?.data ?? []
  const riwayat = [...selesaiPollings, ...batalPollings]

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
                <BreadcrumbPage>Polling</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-4 p-4 pt-0">
        <div>
          <h1 className="text-2xl font-bold">Polling Warga</h1>
          <p className="text-muted-foreground text-sm">Ikut bersuara dalam keputusan RT</p>
        </div>

        <Tabs defaultValue="aktif">
          <TabsList>
            <TabsTrigger value="aktif">
              Aktif
              {aktifPollings.length > 0 && (
                <Badge className="ml-1.5 h-5 px-1.5 text-xs">{aktifPollings.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="riwayat">Riwayat</TabsTrigger>
          </TabsList>

          <TabsContent value="aktif">
            {loadingAktif ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Memuat...</p>
            ) : aktifPollings.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Tidak ada polling aktif saat ini.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {aktifPollings.map((p) => (
                  <ActivePollingCard key={p.id} polling={p} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="riwayat">
            {loadingSelesai ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Memuat...</p>
            ) : riwayat.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Belum ada riwayat polling.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {riwayat.map((p) => (
                  <CompletedPollingCard key={p.id} polling={p} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
