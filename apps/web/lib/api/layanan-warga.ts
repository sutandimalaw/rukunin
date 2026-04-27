import { apiFetch } from './client';

export type LayananType =
  | 'SURAT_KETERANGAN'
  | 'LAPORAN_KERUSAKAN'
  | 'LAPORAN_KEAMANAN'
  | 'PENGADUAN_UMUM';

export type LayananStatus = 'PENDING' | 'PROSES' | 'SELESAI' | 'DITOLAK';

export interface LayananUserInfo {
  id: string;
  email: string;
  profile?: { fullName: string | null } | null;
}

export interface LayananWarga {
  id: string;
  type: LayananType;
  subject: string;
  description: string;
  purpose: string | null;
  location: string | null;
  status: LayananStatus;
  adminNotes: string | null;
  requestedBy: string;
  processedBy: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  requester: LayananUserInfo;
  processor: LayananUserInfo | null;
}

export interface LayananWargaListResponse {
  data: LayananWarga[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CreateLayananWargaData {
  type: LayananType;
  subject: string;
  description: string;
  purpose?: string;
  location?: string;
}

export interface UpdateLayananStatusData {
  status: 'PROSES' | 'SELESAI' | 'DITOLAK';
  adminNotes?: string;
}

export const layananWargaApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    type?: LayananType;
    status?: LayananStatus;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.type) query.set('type', params.type);
    if (params?.status) query.set('status', params.status);
    const qs = query.toString();
    return apiFetch<LayananWargaListResponse>(
      `/layanan-warga${qs ? `?${qs}` : ''}`,
    );
  },

  getById: (id: string) => apiFetch<LayananWarga>(`/layanan-warga/${id}`),

  create: (data: CreateLayananWargaData) =>
    apiFetch<LayananWarga>('/layanan-warga', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, data: UpdateLayananStatusData) =>
    apiFetch<LayananWarga>(`/layanan-warga/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/layanan-warga/${id}`, { method: 'DELETE' }),
};
