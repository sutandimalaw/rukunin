import { useQuery } from '@tanstack/react-query';
import { keamananApi } from '@/lib/api/keamanan';

export function useGetBukuTamu(params?: {
  page?: number;
  limit?: number;
  date?: string;
}) {
  return useQuery({
    queryKey: ['keamanan', 'tamu', params],
    queryFn: () => keamananApi.getAllTamu(params),
  });
}
