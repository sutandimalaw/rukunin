import { pengurusApi, UpdatePengurusData } from '@/lib/api/pengurus'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdatePengurus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePengurusData }) =>
      pengurusApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengurus'] })
    },
  })
}
