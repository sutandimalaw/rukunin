import { apiFetch } from './client';

export type PollingStatus = 'AKTIF' | 'SELESAI' | 'DIBATALKAN';

export interface PollingOption {
  id: string;
  pollingId: string;
  label: string;
  sortOrder: number;
  _count?: { votes: number };
}

export interface Polling {
  id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  status: PollingStatus;
  isAnonymous: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  options: PollingOption[];
  _count: { votes: number };
  votes: { optionId: string }[]; // current user's vote
}

export interface PollingListResponse {
  data: Polling[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CreatePollingData {
  title: string;
  description?: string;
  deadline?: string;
  isAnonymous?: boolean;
  options: string[];
}

export const pollingApi = {
  getAll: (params?: { page?: number; limit?: number; status?: PollingStatus }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    const qs = query.toString();
    return apiFetch<PollingListResponse>(`/polling${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string) => apiFetch<Polling>(`/polling/${id}`),

  create: (data: CreatePollingData) =>
    apiFetch<Polling>('/polling', { method: 'POST', body: JSON.stringify(data) }),

  vote: (pollingId: string, optionId: string) =>
    apiFetch<unknown>(`/polling/${pollingId}/vote/${optionId}`, { method: 'POST' }),

  close: (id: string, status: 'SELESAI' | 'DIBATALKAN') =>
    apiFetch<Polling>(`/polling/${id}/close`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) => apiFetch<void>(`/polling/${id}`, { method: 'DELETE' }),
};
