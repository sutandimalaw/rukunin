import { kegiatanWargaApi } from '@/lib/api/kegiatan-warga'
import { useQuery } from '@tanstack/react-query'

export function useGetKegiatanDetail(id: string | null) {
  return useQuery({
    queryKey: ['kegiatan-warga', 'detail', id],
    queryFn: () => kegiatanWargaApi.getById(id as string),
    enabled: !!id,
  })
}
