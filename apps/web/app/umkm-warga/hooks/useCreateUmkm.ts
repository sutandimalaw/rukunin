import { umkmApi, CreateUmkmUsahaData } from '@/lib/api/umkm'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateUmkm() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUmkmUsahaData) => umkmApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umkm'] })
    },
  })
}
