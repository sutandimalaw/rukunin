'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useUpdateAnnouncement } from '../hooks/useUpdateAnnouncement'
import type { Announcement } from '@/lib/api/announcements'

const CATEGORIES = [
  { value: 'umum', label: 'Umum' },
  { value: 'keamanan', label: 'Keamanan' },
  { value: 'kebersihan', label: 'Kebersihan' },
  { value: 'keuangan', label: 'Keuangan' },
  { value: 'sosial', label: 'Sosial' },
]

interface Props {
  announcement: Announcement
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditAnnouncementModal({ announcement, open, onOpenChange }: Props) {
  const [title, setTitle] = useState(announcement.title)
  const [content, setContent] = useState(announcement.content)
  const [category, setCategory] = useState(announcement.category)
  const { mutateAsync, isPending, error } = useUpdateAnnouncement()

  useEffect(() => {
    if (open) {
      setTitle(announcement.title)
      setContent(announcement.content)
      setCategory(announcement.category)
    }
  }, [open, announcement])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await mutateAsync({ id: announcement.id, data: { title, content, category } })
      onOpenChange(false)
    } catch {
      // error ditampilkan via error state
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Pengumuman</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-5">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Judul</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Kategori</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Isi Pengumuman</Label>
              <Textarea
                id="edit-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button type="button" variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
