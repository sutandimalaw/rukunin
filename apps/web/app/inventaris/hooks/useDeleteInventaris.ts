import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventarisApi } from '@/lib/api/inventaris';

export function useDeleteInventaris() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => inventarisApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventaris'] });
    },
  });
}
