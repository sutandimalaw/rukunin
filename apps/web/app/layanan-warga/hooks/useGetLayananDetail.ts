import { layananWargaApi } from '@/lib/api/layanan-warga'
import { useQuery } from '@tanstack/react-query'

export function useGetLayananDetail(id: string | null) {
  return useQuery({
    queryKey: ['layanan-warga', 'detail', id],
    queryFn: () => layananWargaApi.getById(id as string),
    enabled: !!id,
  })
}
