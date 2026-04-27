import { apiFetch } from './client';

export const PROFIL_KATEGORI = [
  { value: 'TEKNOLOGI', label: 'Teknologi & IT' },
  { value: 'KESEHATAN', label: 'Kesehatan & Medis' },
  { value: 'PENDIDIKAN', label: 'Pendidikan & Pengajaran' },
  { value: 'HUKUM', label: 'Hukum & Advokasi' },
  { value: 'KEUANGAN', label: 'Keuangan & Akuntansi' },
  { value: 'TEKNIK', label: 'Teknik & Konstruksi' },
  { value: 'SENI_KREATIF', label: 'Seni & Kreatif' },
  { value: 'KULINER', label: 'Kuliner & Catering' },
  { value: 'PERDAGANGAN', label: 'Perdagangan & Bisnis' },
  { value: 'LAINNYA', label: 'Lainnya' },
] as const;

export type ProfilKategori =
  | 'TEKNOLOGI'
  | 'KESEHATAN'
  | 'PENDIDIKAN'
  | 'HUKUM'
  | 'KEUANGAN'
  | 'TEKNIK'
  | 'SENI_KREATIF'
  | 'KULINER'
  | 'PERDAGANGAN'
  | 'LAINNYA';

export interface ProfilProfesiUser {
  id: string;
  email: string;
  profile?: { fullName: string | null; avatarUrl: string | null } | null;
}

export interface ProfilProfesi {
  id: string;
  userId: string;
  category: ProfilKategori;
  jobTitle: string;
  skills: string;
  bio: string | null;
  whatsapp: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  user: ProfilProfesiUser;
}

export interface ProfilProfesiListResponse {
  data: ProfilProfesi[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface UpsertProfilProfesiData {
  category: ProfilKategori;
  jobTitle: string;
  skills: string;
  bio?: string;
  whatsapp?: string;
  isPublished?: boolean;
}

export const profilProfesiApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: ProfilKategori;
    search?: string;
  }): Promise<ProfilProfesiListResponse> => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    const qs = query.toString();
    return apiFetch(`/profil-profesi${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string): Promise<ProfilProfesi> =>
    apiFetch(`/profil-profesi/${id}`),

  getMine: (): Promise<ProfilProfesi | null> =>
    apiFetch('/profil-profesi/me'),

  upsert: (data: UpsertProfilProfesiData): Promise<ProfilProfesi> =>
    apiFetch('/profil-profesi', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  remove: (): Promise<{ message: string }> =>
    apiFetch('/profil-profesi', { method: 'DELETE' }),
};
