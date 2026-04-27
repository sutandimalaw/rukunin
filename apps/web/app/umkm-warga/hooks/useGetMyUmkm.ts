import { umkmApi } from '@/lib/api/umkm'
import { useQuery } from '@tanstack/react-query'

export function useGetMyUmkm() {
  return useQuery({
    queryKey: ['umkm', 'my'],
    queryFn: () => umkmApi.getMy(),
  })
}
