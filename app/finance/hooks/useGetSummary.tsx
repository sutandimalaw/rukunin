import { useQuery } from "@tanstack/react-query"
import { createClient } from '@/utils/supabase/client'

export default function useGetSummary () {
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
