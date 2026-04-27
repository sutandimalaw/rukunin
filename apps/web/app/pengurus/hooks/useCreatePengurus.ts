import { CreatePengurusData, pengurusApi } from '@/lib/api/pengurus'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreatePengurus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePengurusData) => pengurusApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengurus'] })
    },
  })
}
