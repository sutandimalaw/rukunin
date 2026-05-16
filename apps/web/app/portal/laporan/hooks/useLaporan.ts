import { laporanWargaApi, CreateLaporanData } from '@/lib/api/laporan-warga'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useGetMyLaporan(params?: {
  page?: number
  limit?: number
  status?: string
  sort?: string
}) {
  return useQuery({
    queryKey: ['laporan-mine', params],
    queryFn: () => laporanWargaApi.getMine(params),
  })
}

export function useGetLaporanDetail(id: string | null) {
  return useQuery({
    queryKey: ['laporan', id],
    queryFn: () => laporanWargaApi.getOne(id!),
    enabled: !!id,
  })
}

export function useCreateLaporan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateLaporanData) => laporanWargaApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laporan-mine'] })
    },
  })
}
