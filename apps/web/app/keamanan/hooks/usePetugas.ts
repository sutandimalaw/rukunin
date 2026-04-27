import { useMutation, useQueryClient } from '@tanstack/react-query';
import { keamananApi } from '@/lib/api/keamanan';

export function useCreatePetugas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof keamananApi.createPetugas>[0]) =>
      keamananApi.createPetugas(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['keamanan', 'petugas'] }),
  });
}

export function useUpdatePetugas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      keamananApi.updatePetugas(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['keamanan', 'petugas'] });
      qc.invalidateQueries({ queryKey: ['keamanan', 'summary'] });
    },
  });
}

export function useDeletePetugas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => keamananApi.deletePetugas(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['keamanan', 'petugas'] });
      qc.invalidateQueries({ queryKey: ['keamanan', 'summary'] });
    },
  });
}
