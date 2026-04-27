import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pollingApi, type CreatePollingData } from '@/lib/api/polling';

export function useCreatePolling() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePollingData) => pollingApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['polling'] }),
  });
}
