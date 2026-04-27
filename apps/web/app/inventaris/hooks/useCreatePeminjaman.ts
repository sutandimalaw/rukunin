import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventarisApi, type CreatePeminjamanData } from '@/lib/api/inventaris';

export function useCreatePeminjaman() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePeminjamanData) =>
      inventarisApi.createPeminjaman(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['peminjaman'] });
      queryClient.invalidateQueries({ queryKey: ['inventaris'] });
    },
  });
}
