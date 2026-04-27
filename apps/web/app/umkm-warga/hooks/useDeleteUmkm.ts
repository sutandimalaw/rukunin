import { umkmApi } from '@/lib/api/umkm'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeleteUmkm() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => umkmApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umkm'] })
    },
  })
}
