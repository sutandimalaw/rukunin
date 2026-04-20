import { householdsApi, CreateHouseholdData, CreateWithHeadData } from '@/lib/api/households'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useGetHouseholds(params?: {
  page?: number
  limit?: number
  search?: string
  blok?: string
  rt?: string
}) {
  return useQuery({
    queryKey: ['households', params],
    queryFn: () => householdsApi.getAll(params),
  })
}

export function useGetHousehold(id: string) {
  return useQuery({
    queryKey: ['households', id],
    queryFn: () => householdsApi.getById(id),
    enabled: !!id,
  })
}

export function useGetHouseholdByKk(kkNumber: string, enabled = false) {
  return useQuery({
    queryKey: ['households', 'by-kk', kkNumber],
    queryFn: () => householdsApi.getByKkNumber(kkNumber),
    enabled: enabled && kkNumber.length >= 11,
    retry: false,
  })
}

export function useCreateHousehold() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateHouseholdData) => householdsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['households'] })
    },
  })
}

export function useCreateHouseholdWithHead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateWithHeadData) => householdsApi.createWithHead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['households'] })
      queryClient.invalidateQueries({ queryKey: ['residents'] })
    },
  })
}

export function useDeleteHousehold() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => householdsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['households'] })
      queryClient.invalidateQueries({ queryKey: ['residents'] })
    },
  })
}
