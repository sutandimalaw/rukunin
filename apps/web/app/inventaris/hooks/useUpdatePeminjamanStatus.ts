import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  inventarisApi,
  type UpdatePeminjamanStatusData,
} from '@/lib/api/inventaris';

export function useUpdatePeminjamanStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdatePeminjamanStatusData;
    }) => inventarisApi.updatePeminjamanStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['peminjaman'] });
      queryClient.invalidateQueries({ queryKey: ['inventaris'] });
    },
  });
}
