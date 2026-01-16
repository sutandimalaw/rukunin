import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

const useGetTransaction = () => {
  return useQuery({
        queryKey: ['transaction'],
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('transaction')
                .select('*')

            if (error) throw error
            return data // array residents
        },
    })
}

export default useGetTransaction
