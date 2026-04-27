import { useQuery } from '@tanstack/react-query';
import { inventarisApi } from '@/lib/api/inventaris';

export function useGetInventarisDetail(id: string) {
  return useQuery({
    queryKey: ['inventaris', id],
    queryFn: () => inventarisApi.getById(id),
    enabled: !!id,
  });
}
