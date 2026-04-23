import { kegiatanWargaApi } from '@/lib/api/kegiatan-warga'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useVoteKegiatan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'vote' | 'unvote' }) =>
      action === 'vote' ? kegiatanWargaApi.vote(id) : kegiatanWargaApi.unvote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan-warga'] })
    },
  })
}
