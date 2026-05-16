import { apiFetch } from './client';

export type LaporanKategori = 'INFRASTRUKTUR' | 'KEBERSIHAN' | 'KEAMANAN' | 'SOSIAL' | 'LAINNYA';
export type LaporanPrioritas = 'PENTING' | 'NORMAL' | 'RENDAH';
export type LaporanStatus = 'MENUNGGU' | 'DIPROSES' | 'SELESAI';

export interface LaporanKomentar {
  id: string;
  laporanId: string;
  userId: string;
  type: 'KOMENTAR' | 'STATUS_CHANGE';
  isi: string;
  statusBaru: string | null;
  createdAt: string;
  userName: string;
  userRole: string;
}

export interface LaporanWarga {
  id: string;
  nomorLaporan: string;
  judul: string;
  kategori: LaporanKategori;
  prioritas: LaporanPrioritas;
  deskripsi: string;
  lokasi: string | null;
  status: LaporanStatus;
  namaPerlapor: string | null;
  rtPerlapor: string | null;
  fotoUrls: string[];
  submittedBy: string | null;
  submitterName: string;
  komentarCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LaporanDetail extends LaporanWarga {
  komentar: LaporanKomentar[];
}

export interface LaporanListResponse {
  data: LaporanWarga[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface LaporanSummary {
  total: number;
  menunggu: number;
  diproses: number;
  selesai: number;
}

export interface CreateLaporanData {
  judul: string;
  kategori: LaporanKategori;
  prioritas?: LaporanPrioritas;
  deskripsi: string;
  lokasi?: string;
  namaPerlapor?: string;
  rtPerlapor?: string;
  fotoUrls?: string[];
}

export const laporanWargaApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    kategori?: string;
    prioritas?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    sort?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    if (params?.kategori) query.set('kategori', params.kategori);
    if (params?.prioritas) query.set('prioritas', params.prioritas);
    if (params?.search) query.set('search', params.search);
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);
    if (params?.sort) query.set('sort', params.sort);
    const qs = query.toString();
    return apiFetch<LaporanListResponse>(`/laporan-warga${qs ? `?${qs}` : ''}`);
  },

  getSummary: () => apiFetch<LaporanSummary>('/laporan-warga/summary'),

  getMine: (params?: { page?: number; limit?: number; status?: string; sort?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    if (params?.sort) query.set('sort', params.sort);
    const qs = query.toString();
    return apiFetch<LaporanListResponse>(`/laporan-warga/mine${qs ? `?${qs}` : ''}`);
  },

  getOne: (id: string) => apiFetch<LaporanDetail>(`/laporan-warga/${id}`),

  create: (data: CreateLaporanData) =>
    apiFetch<LaporanWarga>('/laporan-warga', { method: 'POST', body: JSON.stringify(data) }),

  updateStatus: (id: string, status: string) =>
    apiFetch<LaporanWarga>(`/laporan-warga/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  addKomentar: (id: string, isi: string) =>
    apiFetch<LaporanKomentar>(`/laporan-warga/${id}/komentar`, {
      method: 'POST',
      body: JSON.stringify({ isi }),
    }),
};
