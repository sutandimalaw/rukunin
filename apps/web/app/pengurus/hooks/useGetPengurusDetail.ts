import { pengurusApi } from '@/lib/api/pengurus'
import { useQuery } from '@tanstack/react-query'

export function useGetPengurusDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['pengurus', id],
    queryFn: () => pengurusApi.getById(id!),
    enabled: !!id,
  })
}
