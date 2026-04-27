import { umkmApi, UmkmCategory, UmkmStatus } from '@/lib/api/umkm'
import { useQuery } from '@tanstack/react-query'

export function useGetUmkmList(params?: {
  page?: number
  limit?: number
  category?: UmkmCategory
  status?: UmkmStatus
  search?: string
}) {
  return useQuery({
    queryKey: ['umkm', params],
    queryFn: () => umkmApi.getAll(params),
  })
}
