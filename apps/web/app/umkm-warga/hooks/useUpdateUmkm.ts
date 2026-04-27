import { umkmApi, UpdateUmkmUsahaData } from '@/lib/api/umkm'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateUmkm() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUmkmUsahaData }) =>
      umkmApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umkm'] })
    },
  })
}
