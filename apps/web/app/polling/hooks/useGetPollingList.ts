import { useQuery } from '@tanstack/react-query';
import { pollingApi, type PollingStatus } from '@/lib/api/polling';

export function useGetPollingList(params?: { page?: number; limit?: number; status?: PollingStatus }) {
  return useQuery({
    queryKey: ['polling', params],
    queryFn: () => pollingApi.getAll(params),
  });
}
