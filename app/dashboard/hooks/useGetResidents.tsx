import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

const useGetResidents = () => {
    return useQuery({
        queryKey: ['residents'],
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('residents')
                .select('*')

            if (error) throw error

            return data // array residents
        },
    })
}

export default useGetResidents
