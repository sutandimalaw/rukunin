import { announcementsApi } from '@/lib/api/announcements'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => announcementsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}
