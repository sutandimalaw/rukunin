import { umkmApi } from '@/lib/api/umkm'
import { useQuery } from '@tanstack/react-query'

export function useGetUmkmDetail(id: string | null) {
  return useQuery({
    queryKey: ['umkm', 'detail', id],
    queryFn: () => umkmApi.getById(id as string),
    enabled: !!id,
  })
}
