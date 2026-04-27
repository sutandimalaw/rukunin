import { useQuery } from '@tanstack/react-query';
import { inventarisApi, type InventarisCategory } from '@/lib/api/inventaris';

export function useGetInventarisList(params?: {
  page?: number;
  limit?: number;
  category?: InventarisCategory;
  search?: string;
}) {
  return useQuery({
    queryKey: ['inventaris', params],
    queryFn: () => inventarisApi.getAll(params),
  });
}
