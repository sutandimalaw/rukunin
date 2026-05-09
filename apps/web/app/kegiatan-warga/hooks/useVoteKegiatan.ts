import { kegiatanWargaApi } from '@/lib/api/kegiatan-warga'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useVoteKegiatan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'vote' | 'unvote' }) => {
      if (action === 'vote') return kegiatanWargaApi.vote(id)
      return kegiatanWargaApi.unvote(id) as Promise<unknown>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan-warga'] })
    },
  })
}
