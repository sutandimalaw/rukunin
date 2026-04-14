import { announcementsApi, CreateAnnouncementData } from '@/lib/api/announcements'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateAnnouncement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAnnouncementData) => announcementsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}
