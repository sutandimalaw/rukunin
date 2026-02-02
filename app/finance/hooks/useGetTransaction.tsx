import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

export default function useGetTransaction() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error

      const balance =
        data && data.length > 0
          ? data[data.length - 1].balance
          : 0

      return {
        transactions: data ?? [],
        balance,
      }
    },
  })
}
