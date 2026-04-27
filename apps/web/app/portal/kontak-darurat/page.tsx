'use client'

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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Phone, Hospital, Shield, Flame, Zap, Droplets, Ambulance, HelpCircle } from 'lucide-react'
import { useGetKontakDarurat } from '@/app/kontak-darurat/hooks/useGetKontakDarurat'
import type { KontakCategory, KontakDarurat } from '@/lib/api/kontak-darurat'

const CATEGORY_CONFIG: Record<KontakCategory, { label: string; icon: React.ElementType; color: string }> = {
  RUMAH_SAKIT: { label: 'Rumah Sakit', icon: Hospital, color: 'text-rose-500' },
  POLISI: { label: 'Polisi', icon: Shield, color: 'text-blue-500' },
  PEMADAM: { label: 'Pemadam Kebakaran', icon: Flame, color: 'text-orange-500' },
  PLN: { label: 'PLN', icon: Zap, color: 'text-yellow-500' },
  PDAM: { label: 'PDAM', icon: Droplets, color: 'text-cyan-500' },
  AMBULANS: { label: 'Ambulans', icon: Ambulance, color: 'text-emerald-500' },
  LAINNYA: { label: 'Lainnya', icon: HelpCircle, color: 'text-muted-foreground' },
}

const CATEGORY_ORDER: KontakCategory[] = [
  'AMBULANS', 'RUMAH_SAKIT', 'POLISI', 'PEMADAM', 'PLN', 'PDAM', 'LAINNYA',
]

function KontakCard({ kontak }: { kontak: KontakDarurat }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-3 gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{kontak.name}</p>
        {kontak.address && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{kontak.address}</p>
        )}
      </div>
      <Button asChild size="sm" className="gap-1.5 shrink-0">
        <a href={`tel:${kontak.phoneNumber}`}>
          <Phone className="w-3.5 h-3.5" />
          {kontak.phoneNumber}
        </a>
      </Button>
    </div>
  )
}

export default function PortalKontakDaruratPage() {
  const { data: contacts, isLoading } = useGetKontakDarurat()

  const grouped = (contacts ?? []).reduce<Record<string, KontakDarurat[]>>((acc, k) => {
    if (!acc[k.category]) acc[k.category] = []
    acc[k.category].push(k)
    return acc
  }, {})

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
                <BreadcrumbPage>Kontak Darurat</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-4 p-4 pt-0">
        <div>
          <h1 className="text-2xl font-bold">Kontak Darurat</h1>
          <p className="text-muted-foreground text-sm">Nomor telepon penting di lingkungan RT</p>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Memuat...</p>
        ) : !contacts?.length ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Belum ada kontak darurat terdaftar.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {CATEGORY_ORDER.filter((cat) => grouped[cat]?.length).map((cat) => {
              const { label, icon: Icon, color } = CATEGORY_CONFIG[cat]
              return (
                <Card key={cat}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Icon className={`w-5 h-5 ${color}`} />
                      {label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {grouped[cat].map((k) => (
                      <KontakCard key={k.id} kontak={k} />
                    ))}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </SidebarInset>
  )
}
