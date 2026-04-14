import { announcementsApi } from '@/lib/api/announcements'
import { useQuery } from '@tanstack/react-query'

export function useGetAnnouncements(params?: {
  page?: number
  limit?: number
  category?: string
}) {
  return useQuery({
    queryKey: ['announcements', params],
    queryFn: () => announcementsApi.getAll(params),
  })
}
