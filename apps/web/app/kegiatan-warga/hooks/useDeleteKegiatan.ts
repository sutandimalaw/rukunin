import { kegiatanWargaApi } from '@/lib/api/kegiatan-warga'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeleteKegiatan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => kegiatanWargaApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan-warga'] })
    },
  })
}
