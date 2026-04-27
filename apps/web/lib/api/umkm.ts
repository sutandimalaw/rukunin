import { apiFetch } from './client';

export const UMKM_CATEGORIES = [
  'MAKANAN',
  'MINUMAN',
  'JASA',
  'KERAJINAN',
  'FASHION',
  'ELEKTRONIK',
  'LAINNYA',
] as const;

export type UmkmCategory = (typeof UMKM_CATEGORIES)[number];
export type UmkmStatus = 'PENDING' | 'ACTIVE' | 'REJECTED';
export type ProdukType = 'BARANG' | 'JASA';

export interface UmkmProduk {
  id: string;
  name: string;
  description: string | null;
  price: string;
  type: ProdukType;
  isAvailable: boolean;
  usahaId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UmkmOwner {
  id: string;
  email: string;
  profile?: { fullName: string | null } | null;
}

export interface UmkmUsaha {
  id: string;
  name: string;
  description: string;
  category: UmkmCategory;
  address: string | null;
  whatsapp: string;
  isActive: boolean;
  status: UmkmStatus;
  adminNotes: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: UmkmOwner;
  products?: UmkmProduk[];
  _count?: { products: number };
}

export interface UmkmUsahaListResponse {
  data: UmkmUsaha[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CreateUmkmUsahaData {
  name: string;
  description: string;
  category: UmkmCategory;
  address?: string;
  whatsapp: string;
}

export interface UpdateUmkmUsahaData extends Partial<CreateUmkmUsahaData> {
  isActive?: boolean;
}

export interface UpdateUsahaStatusData {
  status: 'ACTIVE' | 'REJECTED';
  adminNotes?: string;
}

export interface CreateUmkmProdukData {
  name: string;
  description?: string;
  price: number;
  type: ProdukType;
}

export interface UpdateUmkmProdukData extends Partial<CreateUmkmProdukData> {
  isAvailable?: boolean;
}

export const umkmApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: UmkmCategory;
    status?: UmkmStatus;
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.category) query.set('category', params.category);
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    const qs = query.toString();
    return apiFetch<UmkmUsahaListResponse>(`/umkm${qs ? `?${qs}` : ''}`);
  },

  getMy: () => apiFetch<UmkmUsaha[]>('/umkm/my'),

  getById: (id: string) => apiFetch<UmkmUsaha>(`/umkm/${id}`),

  create: (data: CreateUmkmUsahaData) =>
    apiFetch<UmkmUsaha>('/umkm', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: UpdateUmkmUsahaData) =>
    apiFetch<UmkmUsaha>(`/umkm/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  updateStatus: (id: string, data: UpdateUsahaStatusData) =>
    apiFetch<UmkmUsaha>(`/umkm/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),

  delete: (id: string) => apiFetch<void>(`/umkm/${id}`, { method: 'DELETE' }),

  getProduk: (usahaId: string) => apiFetch<UmkmProduk[]>(`/umkm/${usahaId}/produk`),

  createProduk: (usahaId: string, data: CreateUmkmProdukData) =>
    apiFetch<UmkmProduk>(`/umkm/${usahaId}/produk`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduk: (produkId: string, data: UpdateUmkmProdukData) =>
    apiFetch<UmkmProduk>(`/umkm/produk/${produkId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteProduk: (produkId: string) =>
    apiFetch<void>(`/umkm/produk/${produkId}`, { method: 'DELETE' }),
};
