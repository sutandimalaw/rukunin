import { penyediaJasaApi } from '@/lib/api/penyedia-jasa'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeletePenyediaJasa() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => penyediaJasaApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penyedia-jasa'] })
    },
  })
}
