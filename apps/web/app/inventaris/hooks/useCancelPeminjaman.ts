import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventarisApi } from '@/lib/api/inventaris';

export function useCancelPeminjaman() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => inventarisApi.cancelPeminjaman(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['peminjaman'] });
    },
  });
}
