import { apiFetch } from './client';

export type KontakCategory =
  | 'RUMAH_SAKIT'
  | 'POLISI'
  | 'PEMADAM'
  | 'PLN'
  | 'PDAM'
  | 'AMBULANS'
  | 'LAINNYA';

export interface KontakDarurat {
  id: string;
  name: string;
  category: KontakCategory;
  phoneNumber: string;
  address: string | null;
  isActive: boolean;
  sortOrder: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKontakData {
  name: string;
  category: KontakCategory;
  phoneNumber: string;
  address?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export const kontakDaruratApi = {
  getAll: (params?: { category?: KontakCategory }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    const qs = query.toString();
    return apiFetch<KontakDarurat[]>(`/kontak-darurat${qs ? `?${qs}` : ''}`);
  },

  getAllAdmin: (params?: { category?: KontakCategory }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    const qs = query.toString();
    return apiFetch<KontakDarurat[]>(`/kontak-darurat/admin/all${qs ? `?${qs}` : ''}`);
  },

  create: (data: CreateKontakData) =>
    apiFetch<KontakDarurat>('/kontak-darurat', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateKontakData>) =>
    apiFetch<KontakDarurat>(`/kontak-darurat/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/kontak-darurat/${id}`, { method: 'DELETE' }),
};
