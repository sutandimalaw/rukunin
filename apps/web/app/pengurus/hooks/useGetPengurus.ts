import { pengurusApi } from '@/lib/api/pengurus'
import { useQuery } from '@tanstack/react-query'

export function useGetPengurus(params?: {
  active?: boolean
  periodeStart?: number
}) {
  return useQuery({
    queryKey: ['pengurus', params],
    queryFn: () => pengurusApi.getAll(params),
  })
}
