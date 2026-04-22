import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { Clock } from 'lucide-react'

export default function PendingApprovalPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <CardTitle className="text-xl">Menunggu Persetujuan</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground space-y-3">
            <p>
              Akun kamu berhasil dibuat dan sedang menunggu persetujuan dari admin RT.
            </p>
            <p>
              Kamu akan bisa login setelah admin menyetujui akunmu.
            </p>
            <div className="pt-2">
              <Link
                href="/auth/login"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Kembali ke halaman login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
