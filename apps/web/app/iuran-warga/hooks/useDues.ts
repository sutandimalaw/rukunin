import { duesApi } from '@/lib/api/dues'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useGetDues(params?: {
  period?: string
  status?: string
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: ['dues', params],
    queryFn: () => duesApi.getAll(params),
  })
}

// Global pending count across ALL periods — for notification badge/banner
export function useGetPendingCount() {
  return useQuery({
    queryKey: ['dues', 'pending-count'],
    queryFn: () => duesApi.getAll({ status: 'PENDING', limit: 1 }),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    select: (data) => data.meta.total,
  })
}

export function useGetDuesSummary(period: string) {
  const p = period === 'all' ? undefined : period
  return useQuery({
    queryKey: ['dues', 'summary', period],
    queryFn: () => duesApi.getSummary(p),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  })
}

export function useGenerateDues() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { period: string; amount: number }) =>
      duesApi.generate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dues'] })
    },
  })
}

export function usePayDues() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      duesApi.pay(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dues'] })
    },
  })
}

export function useUnpayDues() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => duesApi.unpay(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dues'] })
    },
  })
}

export function useGetDelinquent(params?: { minMonths?: number; lookback?: number }) {
  return useQuery({
    queryKey: ['dues', 'delinquent', params],
    queryFn: () => duesApi.getDelinquent(params),
  })
}

export function useBatchPayDues() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, notes }: { ids: string[]; notes?: string }) =>
      duesApi.batchPay(ids, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dues'] })
    },
  })
}

export function useRequestPay() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => duesApi.requestPay(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dues'] })
    },
  })
}

export function useRejectPay() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => duesApi.rejectPay(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dues'] })
    },
  })
}
