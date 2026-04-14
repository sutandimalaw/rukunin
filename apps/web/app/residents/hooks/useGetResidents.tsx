import { residentsApi } from '@/lib/api/residents'
import { useQuery } from '@tanstack/react-query'

const useGetResidents = () => {
    return useQuery({
        queryKey: ['residents'],
        queryFn: () => residentsApi.getAll(),
    })
}

export default useGetResidents
