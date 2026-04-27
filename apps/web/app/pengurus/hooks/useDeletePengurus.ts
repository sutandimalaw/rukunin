import { pengurusApi } from '@/lib/api/pengurus'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeletePengurus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => pengurusApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengurus'] })
    },
  })
}
