import { useQuery } from '@tanstack/react-query';
import { inventarisApi, type PeminjamanStatus } from '@/lib/api/inventaris';

export function useGetPeminjamanList(params?: {
  page?: number;
  limit?: number;
  status?: PeminjamanStatus;
}) {
  return useQuery({
    queryKey: ['peminjaman', params],
    queryFn: () => inventarisApi.getAllPeminjaman(params),
  });
}
