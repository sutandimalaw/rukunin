import { kegiatanWargaApi } from '@/lib/api/kegiatan-warga'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCancelKegiatan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => kegiatanWargaApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan-warga'] })
    },
  })
}
