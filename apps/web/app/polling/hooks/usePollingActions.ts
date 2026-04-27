import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pollingApi } from '@/lib/api/polling';

export function useVotePolling() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pollingId, optionId }: { pollingId: string; optionId: string }) =>
      pollingApi.vote(pollingId, optionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['polling'] }),
  });
}

export function useClosePolling() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'SELESAI' | 'DIBATALKAN' }) =>
      pollingApi.close(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['polling'] }),
  });
}

export function useDeletePolling() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pollingApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['polling'] }),
  });
}
