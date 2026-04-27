'use client'

import { useMemo, useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Pencil, Trash2 } from 'lucide-react'
import { useGetPengurus } from './hooks/useGetPengurus'
import { useDeletePengurus } from './hooks/useDeletePengurus'
import { PosisiBadge } from './components/PosisiBadge'
import { PengurusForm } from './components/PengurusForm'
import type { Pengurus } from '@/lib/api/pengurus'

const ALL_PERIODE = '__all__'

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function PengurusAdminPage() {
  const [onlyActive, setOnlyActive] = useState(true)
  const [periode, setPeriode] = useState<string>(ALL_PERIODE)
  const [editing, setEditing] = useState<Pengurus | null>(null)

  const { data, isLoading, error } = useGetPengurus(
    onlyActive ? { active: true } : undefined,
  )
  const deleteMutation = useDeletePengurus()

  const periodeOptions = useMemo(() => {
    if (!data) return []
    const seen = new Set<string>()
    for (const p of data) {
      seen.add(`${p.periodeStart}-${p.periodeEnd}`)
    }
    return Array.from(seen).sort().reverse()
  }, [data])

  const filtered = useMemo(() => {
    if (!data) return []
    if (periode === ALL_PERIODE) return data
    const [start, end] = periode.split('-').map(Number)
    return data.filter(
      (p) => p.periodeStart === start && p.periodeEnd === end,
    )
  }, [data, periode])

  const handleDelete = (p: Pengurus) => {
    if (!window.confirm(`Hapus pengurus "${p.fullName}"?`)) return
    deleteMutation.mutate(p.id)
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
                <BreadcrumbPage>Pengurus RT</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="grid gap-1">
              <Label>Periode</Label>
              <Select value={periode} onValueChange={setPeriode}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_PERIODE}>Semua Periode</SelectItem>
                  {periodeOptions.map((p) => (
                    <SelectItem key={p} value={p}>
                      Periode {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <Checkbox
                id="only-active"
                checked={onlyActive}
                onCheckedChange={(v) => setOnlyActive(!!v)}
              />
              <Label htmlFor="only-active" className="cursor-pointer">
                Hanya aktif
              </Label>
            </div>
          </div>
          <PengurusForm />
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground">Memuat...</p>
        )}
        {error && (
          <p className="text-sm text-red-500">Gagal memuat: {error.message}</p>
        )}
        {data && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Belum ada pengurus dengan filter ini.
          </p>
        )}

        {filtered.length > 0 && (
          <div className="grid gap-3">
            {filtered.map((p) => {
              const photoUrl = p.photoUrl ?? p.user?.profile?.avatarUrl ?? undefined
              return (
                <Card key={p.id}>
                  <CardContent className="flex flex-wrap items-center gap-4 py-4">
                    <Avatar className="h-12 w-12">
                      {photoUrl && (
                        <AvatarImage src={photoUrl} alt={p.fullName} />
                      )}
                      <AvatarFallback>{initials(p.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-[200px] space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{p.fullName}</p>
                        <PosisiBadge
                          posisi={p.posisi}
                          customPosisi={p.customPosisi}
                        />
                        {!p.isActive && (
                          <Badge variant="outline">Tidak Aktif</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Periode {p.periodeStart}–{p.periodeEnd}
                        {p.whatsapp && <> · WA {p.whatsapp}</>}
                        {p.user && (
                          <>
                            {' '}
                            · Akun: {p.user.profile?.fullName ?? p.user.email}
                          </>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditing(p)}
                      >
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(p)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Hapus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {editing && (
        <PengurusForm
          initial={editing}
          open={!!editing}
          onOpenChange={(o) => !o && setEditing(null)}
        />
      )}
    </SidebarInset>
  )
}
