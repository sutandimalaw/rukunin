import { layananWargaApi, LayananStatus, LayananType } from '@/lib/api/layanan-warga'
import { useQuery } from '@tanstack/react-query'

export function useGetLayananWarga(params?: {
  page?: number
  limit?: number
  type?: LayananType
  status?: LayananStatus
}) {
  return useQuery({
    queryKey: ['layanan-warga', params],
    queryFn: () => layananWargaApi.getAll(params),
  })
}
