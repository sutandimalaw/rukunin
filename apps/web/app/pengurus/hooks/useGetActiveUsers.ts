import { authApi } from '@/lib/api/auth'
import { useQuery } from '@tanstack/react-query'

export function useGetActiveUsers() {
  return useQuery({
    queryKey: ['auth', 'active-users'],
    queryFn: () => authApi.getActiveUsers(),
  })
}
