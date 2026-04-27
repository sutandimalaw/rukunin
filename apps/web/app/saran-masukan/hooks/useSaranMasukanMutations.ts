import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saranMasukanApi, type CreateSaranData } from '@/lib/api/saran-masukan';

export function useCreateSaranMasukan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSaranData) => saranMasukanApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saran-masukan-mine'] });
      queryClient.invalidateQueries({ queryKey: ['saran-masukan'] });
    },
  });
}

export function useRespondSaranMasukan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { status: 'DIBACA' | 'DITANGGAPI'; adminResponse?: string };
    }) => saranMasukanApi.respond(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saran-masukan'] });
      queryClient.invalidateQueries({ queryKey: ['saran-masukan-summary'] });
    },
  });
}
