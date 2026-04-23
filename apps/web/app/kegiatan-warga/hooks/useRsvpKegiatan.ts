import { kegiatanWargaApi } from '@/lib/api/kegiatan-warga'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useRsvpKegiatan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'rsvp' | 'unrsvp' }) =>
      action === 'rsvp' ? kegiatanWargaApi.rsvp(id) : kegiatanWargaApi.unrsvp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan-warga'] })
    },
  })
}
