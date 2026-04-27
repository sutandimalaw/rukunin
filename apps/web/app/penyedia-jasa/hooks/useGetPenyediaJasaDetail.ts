import { penyediaJasaApi } from '@/lib/api/penyedia-jasa'
import { useQuery } from '@tanstack/react-query'

export function useGetPenyediaJasaDetail(id: string | null) {
  return useQuery({
    queryKey: ['penyedia-jasa', 'detail', id],
    queryFn: () => penyediaJasaApi.getById(id as string),
    enabled: !!id,
  })
}
