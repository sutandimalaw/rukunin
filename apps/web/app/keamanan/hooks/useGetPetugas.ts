import { useQuery } from '@tanstack/react-query';
import { keamananApi } from '@/lib/api/keamanan';

export function useGetPetugas() {
  return useQuery({
    queryKey: ['keamanan', 'petugas'],
    queryFn: () => keamananApi.getAllPetugas(),
  });
}
