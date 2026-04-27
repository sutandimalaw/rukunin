import { apiFetch } from './client';

export type SaranCategory = 'SARAN' | 'KRITIK' | 'MASUKAN' | 'PUJIAN';
export type SaranStatus = 'BARU' | 'DIBACA' | 'DITANGGAPI';

export interface SaranUserInfo {
  id: string;
  email: string;
  profile?: { fullName: string | null } | null;
}

export interface SaranMasukan {
  id: string;
  category: SaranCategory;
  subject: string;
  content: string;
  isAnonymous: boolean;
  status: SaranStatus;
  adminResponse: string | null;
  submittedBy: string | null;
  respondedBy: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  submitter: SaranUserInfo | null;
  responder: SaranUserInfo | null;
}

export interface SaranListResponse {
  data: SaranMasukan[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface SaranSummary {
  baru: number;
  dibaca: number;
  ditanggapi: number;
  total: number;
}

export interface CreateSaranData {
  category: SaranCategory;
  subject: string;
  content: string;
  isAnonymous?: boolean;
}

export const saranMasukanApi = {
  getAll: (params?: { page?: number; limit?: number; status?: SaranStatus; category?: SaranCategory }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    if (params?.category) query.set('category', params.category);
    const qs = query.toString();
    return apiFetch<SaranListResponse>(`/saran-masukan${qs ? `?${qs}` : ''}`);
  },

  getSummary: () => apiFetch<SaranSummary>('/saran-masukan/summary'),

  getMine: (params?: { page?: number; limit?: number; status?: SaranStatus }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    const qs = query.toString();
    return apiFetch<SaranListResponse>(`/saran-masukan/mine${qs ? `?${qs}` : ''}`);
  },

  create: (data: CreateSaranData) =>
    apiFetch<SaranMasukan>('/saran-masukan', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  respond: (id: string, data: { status: 'DIBACA' | 'DITANGGAPI'; adminResponse?: string }) =>
    apiFetch<SaranMasukan>(`/saran-masukan/${id}/respond`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
