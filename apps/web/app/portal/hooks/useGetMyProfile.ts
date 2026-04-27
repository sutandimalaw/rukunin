import { residentsApi } from '@/lib/api/residents'
import { useQuery } from '@tanstack/react-query'

export function useGetMyProfile() {
  return useQuery({
    queryKey: ['residents', 'my-profile'],
    queryFn: () => residentsApi.getMyProfile(),
    retry: false,
  })
}
