import { penyediaJasaApi } from '@/lib/api/penyedia-jasa'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeleteMyReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => penyediaJasaApi.deleteMyReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penyedia-jasa'] })
    },
  })
}
