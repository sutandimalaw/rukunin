import { umkmApi, CreateUmkmProdukData, UpdateUmkmProdukData } from '@/lib/api/umkm'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateProduk(usahaId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUmkmProdukData) => umkmApi.createProduk(usahaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umkm'] })
    },
  })
}

export function useUpdateProduk() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUmkmProdukData }) =>
      umkmApi.updateProduk(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umkm'] })
    },
  })
}

export function useDeleteProduk() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => umkmApi.deleteProduk(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umkm'] })
    },
  })
}
