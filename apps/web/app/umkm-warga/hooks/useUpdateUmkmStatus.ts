import { umkmApi, UpdateUsahaStatusData } from '@/lib/api/umkm'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateUmkmStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUsahaStatusData }) =>
      umkmApi.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umkm'] })
    },
  })
}
