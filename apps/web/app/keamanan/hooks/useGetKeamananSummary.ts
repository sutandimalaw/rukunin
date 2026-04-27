import { useQuery } from '@tanstack/react-query';
import { keamananApi } from '@/lib/api/keamanan';

export function useGetKeamananSummary() {
  return useQuery({
    queryKey: ['keamanan', 'summary'],
    queryFn: () => keamananApi.getSummary(),
  });
}
