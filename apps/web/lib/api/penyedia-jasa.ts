import { apiFetch } from './client';

export const PENYEDIA_JASA_CATEGORIES = [
  { value: 'TUKANG', label: 'Tukang' },
  { value: 'ART', label: 'ART' },
  { value: 'BABY_SITTER', label: 'Baby Sitter' },
  { value: 'MONTIR', label: 'Montir' },
  { value: 'LAUNDRY', label: 'Laundry' },
  { value: 'KEBUN', label: 'Kebun/Taman' },
  { value: 'LAINNYA', label: 'Lainnya' },
] as const;

export type PenyediaJasaCategory =
  | 'TUKANG'
  | 'ART'
  | 'BABY_SITTER'
  | 'MONTIR'
  | 'LAUNDRY'
  | 'KEBUN'
  | 'LAINNYA';

export type PenyediaJasaStatus = 'PENDING' | 'ACTIVE' | 'REJECTED';

export interface PenyediaJasaUserInfo {
  id: string;
  email: string;
  profile?: { fullName: string | null } | null;
}

export interface PenyediaJasaReview {
  id: string;
  penyediaJasaId: string;
  reviewerId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  reviewer: PenyediaJasaUserInfo;
}

export interface PenyediaJasa {
  id: string;
  personName: string;
  category: PenyediaJasaCategory;
  whatsapp: string | null;
  description: string | null;
  area: string | null;
  status: PenyediaJasaStatus;
  adminNotes: string | null;
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
  submitter: PenyediaJasaUserInfo;
  averageRating?: number | null;
  reviewCount?: number;
}

export interface PenyediaJasaDetail extends PenyediaJasa {
  reviews: PenyediaJasaReview[];
}

export interface PenyediaJasaListResponse {
  data: PenyediaJasa[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CreatePenyediaJasaData {
  personName: string;
  category: PenyediaJasaCategory;
  whatsapp?: string;
  description?: string;
  area?: string;
}

export type UpdatePenyediaJasaData = Partial<CreatePenyediaJasaData>;

export interface UpdatePenyediaJasaStatusData {
  status: PenyediaJasaStatus;
  adminNotes?: string;
}

export interface UpsertReviewData {
  rating: number;
  comment?: string;
}

export const penyediaJasaApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: PenyediaJasaCategory;
    status?: PenyediaJasaStatus;
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.category) query.set('category', params.category);
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    const qs = query.toString();
    return apiFetch<PenyediaJasaListResponse>(
      `/penyedia-jasa${qs ? `?${qs}` : ''}`,
    );
  },

  getMy: () => apiFetch<PenyediaJasa[]>('/penyedia-jasa/saya'),

  getById: (id: string) =>
    apiFetch<PenyediaJasaDetail>(`/penyedia-jasa/${id}`),

  create: (data: CreatePenyediaJasaData) =>
    apiFetch<PenyediaJasa>('/penyedia-jasa', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdatePenyediaJasaData) =>
    apiFetch<PenyediaJasa>(`/penyedia-jasa/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, data: UpdatePenyediaJasaStatusData) =>
    apiFetch<PenyediaJasa>(`/penyedia-jasa/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/penyedia-jasa/${id}`, { method: 'DELETE' }),

  getReviews: (id: string) =>
    apiFetch<PenyediaJasaReview[]>(`/penyedia-jasa/${id}/reviews`),

  upsertReview: (id: string, data: UpsertReviewData) =>
    apiFetch<PenyediaJasaReview>(`/penyedia-jasa/${id}/reviews`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteMyReview: (id: string) =>
    apiFetch<void>(`/penyedia-jasa/${id}/reviews/saya`, { method: 'DELETE' }),

  adminDeleteReview: (reviewId: string) =>
    apiFetch<void>(`/penyedia-jasa/reviews/${reviewId}`, { method: 'DELETE' }),
};
