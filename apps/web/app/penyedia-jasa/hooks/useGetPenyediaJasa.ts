import {
  penyediaJasaApi,
  PenyediaJasaCategory,
  PenyediaJasaStatus,
} from '@/lib/api/penyedia-jasa'
import { useQuery } from '@tanstack/react-query'

export function useGetPenyediaJasa(params?: {
  page?: number
  limit?: number
  category?: PenyediaJasaCategory
  status?: PenyediaJasaStatus
  search?: string
}) {
  return useQuery({
    queryKey: ['penyedia-jasa', params],
    queryFn: () => penyediaJasaApi.getAll(params),
  })
}
