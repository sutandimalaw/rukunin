import { useQuery } from '@tanstack/react-query';
import { kontakDaruratApi, type KontakCategory } from '@/lib/api/kontak-darurat';

export function useGetKontakDarurat(params?: { category?: KontakCategory }) {
  return useQuery({
    queryKey: ['kontak-darurat', params],
    queryFn: () => kontakDaruratApi.getAll(params),
  });
}

export function useGetKontakDaruratAdmin(params?: { category?: KontakCategory }) {
  return useQuery({
    queryKey: ['kontak-darurat-admin', params],
    queryFn: () => kontakDaruratApi.getAllAdmin(params),
  });
}
