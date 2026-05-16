import { laporanWargaApi, CreateLaporanData } from '@/lib/api/laporan-warga'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useGetLaporan(params?: {
  page?: number
  limit?: number
  status?: string
  kategori?: string
  prioritas?: string
  search?: string
  startDate?: string
  endDate?: string
  sort?: string
}) {
  return useQuery({
    queryKey: ['laporan', params],
    queryFn: () => laporanWargaApi.getAll(params),
  })
}

export function useGetLaporanSummary() {
  return useQuery({
    queryKey: ['laporan', 'summary'],
    queryFn: () => laporanWargaApi.getSummary(),
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
      queryClient.invalidateQueries({ queryKey: ['laporan'] })
    },
  })
}

export function useUpdateLaporanStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      laporanWargaApi.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['laporan'] })
      queryClient.invalidateQueries({ queryKey: ['laporan', id] })
    },
  })
}

export function useAddKomentar(laporanId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (isi: string) => laporanWargaApi.addKomentar(laporanId, isi),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laporan', laporanId] })
      queryClient.invalidateQueries({ queryKey: ['laporan'] })
    },
  })
}
