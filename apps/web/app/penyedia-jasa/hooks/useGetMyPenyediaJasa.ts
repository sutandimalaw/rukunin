import { penyediaJasaApi } from '@/lib/api/penyedia-jasa'
import { useQuery } from '@tanstack/react-query'

export function useGetMyPenyediaJasa() {
  return useQuery({
    queryKey: ['penyedia-jasa', 'mine'],
    queryFn: () => penyediaJasaApi.getMy(),
  })
}
