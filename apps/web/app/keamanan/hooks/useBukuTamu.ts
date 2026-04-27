import { useMutation, useQueryClient } from '@tanstack/react-query';
import { keamananApi } from '@/lib/api/keamanan';

export function useCreateTamu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof keamananApi.createTamu>[0]) =>
      keamananApi.createTamu(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['keamanan', 'tamu'] });
      qc.invalidateQueries({ queryKey: ['keamanan', 'summary'] });
    },
  });
}

export function useCheckOutTamu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => keamananApi.checkOutTamu(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['keamanan', 'tamu'] });
      qc.invalidateQueries({ queryKey: ['keamanan', 'summary'] });
    },
  });
}
