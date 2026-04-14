import { transactionsApi } from '@/lib/api/transactions'
import { useQuery } from '@tanstack/react-query'

export default function useGetTransaction() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsApi.getAll(),
  })
}
