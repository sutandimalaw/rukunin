import { apiFetch } from './client';

// ─── Types ─────────────────────────────────────────────────────────────────

export type InventarisCategory =
  | 'ELEKTRONIK'
  | 'FURNITURE'
  | 'ALAT_OLAHRAGA'
  | 'TENDA_DEKORASI'
  | 'DAPUR'
  | 'KEBERSIHAN'
  | 'LAINNYA';

export type InventarisCondition = 'BAIK' | 'RUSAK_RINGAN' | 'RUSAK_BERAT';

export type PeminjamanStatus =
  | 'PENDING'
  | 'DISETUJUI'
  | 'DIPINJAM'
  | 'DIKEMBALIKAN'
  | 'DITOLAK';

export interface Inventaris {
  id: string;
  name: string;
  category: InventarisCategory;
  description: string | null;
  quantity: number;
  condition: InventarisCondition;
  isAvailable: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PeminjamanUserInfo {
  id: string;
  email: string;
  profile?: { fullName: string | null } | null;
}

export interface PeminjamanInventaris {
  id: string;
  inventarisId: string;
  borrowerId: string;
  quantity: number;
  borrowDate: string;
  returnDate: string;
  actualReturn: string | null;
  purpose: string;
  status: PeminjamanStatus;
  adminNotes: string | null;
  processedBy: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  borrower: PeminjamanUserInfo;
  processor: PeminjamanUserInfo | null;
  inventaris: { id: string; name: string; category: string };
}

export interface InventarisListResponse {
  data: Inventaris[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface PeminjamanListResponse {
  data: PeminjamanInventaris[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CreateInventarisData {
  name: string;
  category: InventarisCategory;
  description?: string;
  quantity?: number;
  condition?: InventarisCondition;
}

export interface UpdateInventarisData {
  name?: string;
  category?: InventarisCategory;
  description?: string;
  quantity?: number;
  condition?: InventarisCondition;
  isAvailable?: boolean;
}

export interface CreatePeminjamanData {
  inventarisId: string;
  quantity: number;
  borrowDate: string;
  returnDate: string;
  purpose: string;
}

export interface UpdatePeminjamanStatusData {
  status: 'DISETUJUI' | 'DIPINJAM' | 'DIKEMBALIKAN' | 'DITOLAK';
  adminNotes?: string;
}

// ─── API ───────────────────────────────────────────────────────────────────

export const inventarisApi = {
  // Inventaris CRUD
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: InventarisCategory;
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    const qs = query.toString();
    return apiFetch<InventarisListResponse>(
      `/inventaris${qs ? `?${qs}` : ''}`,
    );
  },

  getById: (id: string) => apiFetch<Inventaris>(`/inventaris/${id}`),

  create: (data: CreateInventarisData) =>
    apiFetch<Inventaris>('/inventaris', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateInventarisData) =>
    apiFetch<Inventaris>(`/inventaris/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/inventaris/${id}`, { method: 'DELETE' }),

  // Peminjaman
  getAllPeminjaman: (params?: {
    page?: number;
    limit?: number;
    status?: PeminjamanStatus;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    const qs = query.toString();
    return apiFetch<PeminjamanListResponse>(
      `/inventaris/peminjaman/list${qs ? `?${qs}` : ''}`,
    );
  },

  getOnePeminjaman: (id: string) =>
    apiFetch<PeminjamanInventaris>(`/inventaris/peminjaman/${id}`),

  createPeminjaman: (data: CreatePeminjamanData) =>
    apiFetch<PeminjamanInventaris>('/inventaris/peminjaman', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updatePeminjamanStatus: (id: string, data: UpdatePeminjamanStatusData) =>
    apiFetch<PeminjamanInventaris>(`/inventaris/peminjaman/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  cancelPeminjaman: (id: string) =>
    apiFetch<void>(`/inventaris/peminjaman/${id}`, { method: 'DELETE' }),
};
