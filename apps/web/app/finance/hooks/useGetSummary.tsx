import { transactionsApi } from '@/lib/api/transactions'
import { useQuery } from "@tanstack/react-query"

export default function useGetSummary() {
    return useQuery({
        queryKey: ['transactions', 'summary'],
        queryFn: () => transactionsApi.getSummary(),
    })
}
