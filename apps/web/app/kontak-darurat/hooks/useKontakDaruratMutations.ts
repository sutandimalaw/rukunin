import { useMutation, useQueryClient } from '@tanstack/react-query';
import { kontakDaruratApi, type CreateKontakData } from '@/lib/api/kontak-darurat';

export function useCreateKontakDarurat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateKontakData) => kontakDaruratApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kontak-darurat'] });
      queryClient.invalidateQueries({ queryKey: ['kontak-darurat-admin'] });
    },
  });
}

export function useUpdateKontakDarurat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateKontakData> }) =>
      kontakDaruratApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kontak-darurat'] });
      queryClient.invalidateQueries({ queryKey: ['kontak-darurat-admin'] });
    },
  });
}

export function useDeleteKontakDarurat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => kontakDaruratApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kontak-darurat'] });
      queryClient.invalidateQueries({ queryKey: ['kontak-darurat-admin'] });
    },
  });
}
