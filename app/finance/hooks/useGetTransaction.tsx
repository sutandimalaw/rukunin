import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

const useGetTransaction = () => {
  return useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('transactions')
                .select('*')

            if (error) throw error
            return data // array residents
        },
    })
}

export default useGetTransaction
