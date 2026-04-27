import { layananWargaApi, UpdateLayananStatusData } from '@/lib/api/layanan-warga'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateLayananStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLayananStatusData }) =>
      layananWargaApi.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['layanan-warga'] })
    },
  })
}
