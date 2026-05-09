import { kegiatanWargaApi } from '@/lib/api/kegiatan-warga'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useRsvpKegiatan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'rsvp' | 'unrsvp' }) => {
      if (action === 'rsvp') return kegiatanWargaApi.rsvp(id)
      return kegiatanWargaApi.unrsvp(id) as Promise<unknown>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan-warga'] })
    },
  })
}
