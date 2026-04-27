import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventarisApi, type UpdateInventarisData } from '@/lib/api/inventaris';

export function useUpdateInventaris() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventarisData }) =>
      inventarisApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventaris'] });
    },
  });
}
