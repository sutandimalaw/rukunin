import { kegiatanWargaApi, CreateKegiatanWargaData } from '@/lib/api/kegiatan-warga'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateKegiatan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateKegiatanWargaData> }) =>
      kegiatanWargaApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan-warga'] })
    },
  })
}
