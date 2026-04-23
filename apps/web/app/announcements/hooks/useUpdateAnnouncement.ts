import { announcementsApi } from '@/lib/api/announcements'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title: string; content: string; category: string } }) =>
      announcementsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}
