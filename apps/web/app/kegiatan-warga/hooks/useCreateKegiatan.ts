import { kegiatanWargaApi, CreateKegiatanWargaData } from '@/lib/api/kegiatan-warga'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateKegiatan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateKegiatanWargaData) => kegiatanWargaApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan-warga'] })
    },
  })
}
