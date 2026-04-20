import { residentsApi } from '@/lib/api/residents'
import { useQuery } from '@tanstack/react-query'

const useGetResidents = () => {
    return useQuery({
        queryKey: ['residents'],
        queryFn: () => residentsApi.getAll(),
    })
}

export const useGetResidentSummary = () => {
    return useQuery({
        queryKey: ['residents', 'summary'],
        queryFn: () => residentsApi.getSummary(),
    })
}

export default useGetResidents
