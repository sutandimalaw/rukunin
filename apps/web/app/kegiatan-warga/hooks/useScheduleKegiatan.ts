import { kegiatanWargaApi, ScheduleKegiatanData } from '@/lib/api/kegiatan-warga'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useScheduleKegiatan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ScheduleKegiatanData }) =>
      kegiatanWargaApi.schedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan-warga'] })
    },
  })
}
