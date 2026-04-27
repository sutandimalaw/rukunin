import { useMutation, useQueryClient } from '@tanstack/react-query';
import { keamananApi } from '@/lib/api/keamanan';

export function useCreateInsiden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof keamananApi.createInsiden>[0]) =>
      keamananApi.createInsiden(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['keamanan', 'insiden'] });
      qc.invalidateQueries({ queryKey: ['keamanan', 'summary'] });
    },
  });
}

export function useUpdateInsidenStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { status: 'DITINDAK' | 'SELESAI' | 'DITUTUP'; adminNotes?: string };
    }) => keamananApi.updateInsidenStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['keamanan', 'insiden'] });
      qc.invalidateQueries({ queryKey: ['keamanan', 'summary'] });
    },
  });
}

export function useCancelInsiden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => keamananApi.cancelInsiden(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['keamanan', 'insiden'] });
      qc.invalidateQueries({ queryKey: ['keamanan', 'summary'] });
    },
  });
}
