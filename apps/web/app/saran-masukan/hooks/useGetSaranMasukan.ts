import { useQuery } from '@tanstack/react-query';
import { saranMasukanApi, type SaranStatus, type SaranCategory } from '@/lib/api/saran-masukan';

export function useGetSaranList(params?: { page?: number; limit?: number; status?: SaranStatus; category?: SaranCategory }) {
  return useQuery({
    queryKey: ['saran-masukan', params],
    queryFn: () => saranMasukanApi.getAll(params),
  });
}

export function useGetSaranSummary() {
  return useQuery({
    queryKey: ['saran-masukan-summary'],
    queryFn: () => saranMasukanApi.getSummary(),
  });
}

export function useGetMySaran(params?: { page?: number; limit?: number; status?: SaranStatus }) {
  return useQuery({
    queryKey: ['saran-masukan-mine', params],
    queryFn: () => saranMasukanApi.getMine(params),
  });
}
