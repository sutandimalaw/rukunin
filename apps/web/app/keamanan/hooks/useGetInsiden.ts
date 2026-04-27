import { useQuery } from '@tanstack/react-query';
import { keamananApi, type InsidenStatus, type InsidenCategory, type InsidenSeverity } from '@/lib/api/keamanan';

export function useGetInsiden(params?: {
  page?: number;
  limit?: number;
  status?: InsidenStatus;
  category?: InsidenCategory;
  severity?: InsidenSeverity;
}) {
  return useQuery({
    queryKey: ['keamanan', 'insiden', params],
    queryFn: () => keamananApi.getAllInsiden(params),
  });
}
