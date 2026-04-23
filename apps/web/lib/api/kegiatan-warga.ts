import { apiFetch } from './client';

export type KegiatanStatus =
  | 'OPEN_VOTE'
  | 'SCHEDULED'
  | 'ONGOING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface KegiatanPeserta {
  id: string;
  kegiatanId: string;
  userId: string;
  type: 'VOTE' | 'RSVP' | 'ATTENDED';
  createdAt: string;
  user?: {
    id: string;
    email: string;
    profile?: { fullName: string | null } | null;
  };
}

export interface KegiatanWarga {
  id: string;
  title: string;
  description: string;
  category: string;
  status: KegiatanStatus;
  minParticipants: number | null;
  voteDeadline: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  isRecurring: boolean;
  recurrenceRule: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  voteCount: number;
  rsvpCount: number;
  participants?: KegiatanPeserta[];
  myParticipation?: { hasVoted: boolean; hasRsvp: boolean };
}

export interface KegiatanWargaListResponse {
  data: KegiatanWarga[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CreateKegiatanWargaData {
  title: string;
  description: string;
  category?: string;
  minParticipants?: number;
  voteDeadline?: string;
  isRecurring?: boolean;
  recurrenceRule?: string;
}

export interface ScheduleKegiatanData {
  startDate: string;
  endDate?: string;
  location?: string;
  force?: boolean;
}

export const kegiatanWargaApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: KegiatanStatus;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.category) query.set('category', params.category);
    if (params?.status) query.set('status', params.status);
    const qs = query.toString();
    return apiFetch<KegiatanWargaListResponse>(
      `/kegiatan-warga${qs ? `?${qs}` : ''}`,
    );
  },

  getById: (id: string) => apiFetch<KegiatanWarga>(`/kegiatan-warga/${id}`),

  create: (data: CreateKegiatanWargaData) =>
    apiFetch<KegiatanWarga>('/kegiatan-warga', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateKegiatanWargaData>) =>
    apiFetch<KegiatanWarga>(`/kegiatan-warga/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/kegiatan-warga/${id}`, { method: 'DELETE' }),

  vote: (id: string) =>
    apiFetch<KegiatanPeserta>(`/kegiatan-warga/${id}/vote`, { method: 'POST' }),

  unvote: (id: string) =>
    apiFetch<{ success: boolean }>(`/kegiatan-warga/${id}/vote`, { method: 'DELETE' }),

  schedule: (id: string, data: ScheduleKegiatanData) =>
    apiFetch<KegiatanWarga>(`/kegiatan-warga/${id}/schedule`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  rsvp: (id: string) =>
    apiFetch<KegiatanPeserta>(`/kegiatan-warga/${id}/rsvp`, { method: 'POST' }),

  unrsvp: (id: string) =>
    apiFetch<{ success: boolean }>(`/kegiatan-warga/${id}/rsvp`, { method: 'DELETE' }),

  cancel: (id: string) =>
    apiFetch<KegiatanWarga>(`/kegiatan-warga/${id}/cancel`, { method: 'POST' }),

  complete: (id: string) =>
    apiFetch<KegiatanWarga>(`/kegiatan-warga/${id}/complete`, { method: 'POST' }),
};
