import { layananWargaApi, CreateLayananWargaData } from '@/lib/api/layanan-warga'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateLayanan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateLayananWargaData) => layananWargaApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['layanan-warga'] })
    },
  })
}
