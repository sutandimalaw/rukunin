import { reportsApi } from '@/lib/api/reports'
import { useQuery } from '@tanstack/react-query'

export function useGetFinancialReport(params?: {
  startDate?: string
  endDate?: string
}) {
  return useQuery({
    queryKey: ['reports', 'financial', params],
    queryFn: () => reportsApi.getFinancial(params),
  })
}

export function useGetResidentsReport() {
  return useQuery({
    queryKey: ['reports', 'residents'],
    queryFn: () => reportsApi.getResidents(),
  })
}
