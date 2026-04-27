import { penyediaJasaApi } from '@/lib/api/penyedia-jasa'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useAdminDeleteReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reviewId: string) => penyediaJasaApi.adminDeleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penyedia-jasa'] })
    },
  })
}
