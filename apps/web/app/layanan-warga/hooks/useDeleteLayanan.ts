import { layananWargaApi } from '@/lib/api/layanan-warga'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeleteLayanan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => layananWargaApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['layanan-warga'] })
    },
  })
}
