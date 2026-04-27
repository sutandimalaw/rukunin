import { transactionsApi } from '@/lib/api/transactions'
import { useQuery } from '@tanstack/react-query'

export function useGetTransactionSummary() {
  return useQuery({
    queryKey: ['transactions', 'summary'],
    queryFn: () => transactionsApi.getSummary(),
  })
}
