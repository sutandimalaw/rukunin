import { kegiatanWargaApi, KegiatanStatus } from '@/lib/api/kegiatan-warga'
import { useQuery } from '@tanstack/react-query'

export function useGetKegiatanWarga(params?: {
  page?: number
  limit?: number
  category?: string
  status?: KegiatanStatus
}) {
  return useQuery({
    queryKey: ['kegiatan-warga', params],
    queryFn: () => kegiatanWargaApi.getAll(params),
  })
}
