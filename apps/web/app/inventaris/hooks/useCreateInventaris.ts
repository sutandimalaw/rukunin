import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventarisApi, type CreateInventarisData } from '@/lib/api/inventaris';

export function useCreateInventaris() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInventarisData) => inventarisApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventaris'] });
    },
  });
}
