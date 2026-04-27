'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CirclePlus } from 'lucide-react'
import { useCreatePenyediaJasa } from '@/app/penyedia-jasa/hooks/useCreatePenyediaJasa'
import { CATEGORY_OPTIONS } from '@/app/penyedia-jasa/components/PenyediaJasaBadges'
import type { PenyediaJasaCategory } from '@/lib/api/penyedia-jasa'

export function CreatePenyediaJasaModal() {
  const [open, setOpen] = useState(false)
  const [personName, setPersonName] = useState('')
  const [category, setCategory] = useState<PenyediaJasaCategory>('TUKANG')
  const [whatsapp, setWhatsapp] = useState('')
  const [area, setArea] = useState('')
  const [description, setDescription] = useState('')
  const { mutateAsync, isPending, error } = useCreatePenyediaJasa()

  const reset = () => {
    setPersonName('')
    setCategory('TUKANG')
    setWhatsapp('')
    setArea('')
    setDescription('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await mutateAsync({
        personName,
        category,
        whatsapp: whatsapp || undefined,
        area: area || undefined,
        description: description || undefined,
      })
      reset()
      setOpen(false)
    } catch {
      // ditampilkan via state
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Rekomendasikan <CirclePlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rekomendasikan Penyedia Jasa</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-5 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid gap-2">
              <Label htmlFor="personName">Nama Penyedia Jasa</Label>
              <Input
                id="personName"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="Contoh: Pak Budi"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as PenyediaJasaCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
              <Input
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="08xx-xxxx-xxxx"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="area">Area Layanan / Domisili</Label>
              <Input
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Contoh: Sekitar RT 04"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi / Pengalaman</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Tukang bangunan, pernah renovasi rumah saya, hasilnya rapi"
                rows={4}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
            <p className="text-xs text-muted-foreground">
              Entry akan ditinjau admin sebelum tampil di direktori publik.
            </p>
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Mengirim...' : 'Kirim'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
