import { kegiatanWargaApi } from '@/lib/api/kegiatan-warga'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCompleteKegiatan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => kegiatanWargaApi.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan-warga'] })
    },
  })
}
