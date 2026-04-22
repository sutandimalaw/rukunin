import { transactionsApi } from '@/lib/api/transactions'
import { useQuery } from '@tanstack/react-query'

export default function useGetTransaction(params?: {
  type?: string
  category?: string
  startDate?: string
  endDate?: string
}) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => transactionsApi.getAll(params),
  })
}
