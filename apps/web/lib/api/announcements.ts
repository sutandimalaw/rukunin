import { apiFetch } from './client';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  isPublished: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementListResponse {
  data: Announcement[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  category?: string;
  isPublished?: boolean;
}

export const announcementsApi = {
  getAll: (params?: { page?: number; limit?: number; category?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.category) query.set('category', params.category);
    const qs = query.toString();
    return apiFetch<AnnouncementListResponse>(
      `/announcements${qs ? `?${qs}` : ''}`,
    );
  },

  getById: (id: string) => apiFetch<Announcement>(`/announcements/${id}`),

  create: (data: CreateAnnouncementData) =>
    apiFetch<Announcement>('/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateAnnouncementData>) =>
    apiFetch<Announcement>(`/announcements/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/announcements/${id}`, { method: 'DELETE' }),
};
