import { useQuery } from '@tanstack/react-query';
import { pollingApi } from '@/lib/api/polling';

export function useGetPollingDetail(id: string) {
  return useQuery({
    queryKey: ['polling', id],
    queryFn: () => pollingApi.getById(id),
    enabled: !!id,
  });
}
