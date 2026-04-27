import { apiFetch } from './client';

// ─── Types ─────────────────────────────────────────────────────────────────

export type InsidenCategory =
  | 'PENCURIAN'
  | 'VANDALISME'
  | 'GANGGUAN_KETERTIBAN'
  | 'ORANG_MENCURIGAKAN'
  | 'KECELAKAAN'
  | 'KEBAKARAN'
  | 'LAINNYA';

export type InsidenSeverity = 'RENDAH' | 'SEDANG' | 'TINGGI' | 'DARURAT';
export type InsidenStatus = 'DILAPORKAN' | 'DITINDAK' | 'SELESAI' | 'DITUTUP';

export interface KeamananSummary {
  tamuHariIni: number;
  insidenAktif: number;
  panicButton: number;
  petugasBertugas: number;
}

export interface PetugasKeamanan {
  id: string;
  fullName: string;
  shift: string;
  shiftTime: string;
  whatsapp: string | null;
  isOnDuty: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface BukuTamu {
  id: string;
  guestName: string;
  purpose: string;
  destinationBlock: string | null;
  vehicleType: string | null;
  vehicleNumber: string | null;
  checkInTime: string;
  checkOutTime: string | null;
  notes: string | null;
  recordedBy: string;
  recorder: { id: string; email: string; profile?: { fullName: string | null } | null };
}

export interface UserInfo {
  id: string;
  email: string;
  profile?: { fullName: string | null } | null;
}

export interface LaporanInsiden {
  id: string;
  category: InsidenCategory;
  title: string;
  description: string;
  location: string | null;
  severity: InsidenSeverity;
  status: InsidenStatus;
  incidentDate: string;
  adminNotes: string | null;
  reportedBy: string;
  processedBy: string | null;
  processedAt: string | null;
  createdAt: string;
  reporter: UserInfo;
  processor: UserInfo | null;
}

export interface BukuTamuListResponse {
  data: BukuTamu[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface LaporanInsidenListResponse {
  data: LaporanInsiden[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ─── API ───────────────────────────────────────────────────────────────────

export const keamananApi = {
  getSummary: () => apiFetch<KeamananSummary>('/keamanan/summary'),

  // Petugas
  getAllPetugas: () => apiFetch<PetugasKeamanan[]>('/keamanan/petugas'),

  createPetugas: (data: {
    fullName: string;
    shift: string;
    shiftTime: string;
    whatsapp?: string;
    isOnDuty?: boolean;
  }) =>
    apiFetch<PetugasKeamanan>('/keamanan/petugas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updatePetugas: (id: string, data: Partial<PetugasKeamanan>) =>
    apiFetch<PetugasKeamanan>(`/keamanan/petugas/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deletePetugas: (id: string) =>
    apiFetch<void>(`/keamanan/petugas/${id}`, { method: 'DELETE' }),

  // Buku Tamu
  getAllTamu: (params?: { page?: number; limit?: number; date?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.date) query.set('date', params.date);
    const qs = query.toString();
    return apiFetch<BukuTamuListResponse>(
      `/keamanan/tamu${qs ? `?${qs}` : ''}`,
    );
  },

  createTamu: (data: {
    guestName: string;
    purpose: string;
    destinationBlock?: string;
    vehicleType?: string;
    vehicleNumber?: string;
    notes?: string;
  }) =>
    apiFetch<BukuTamu>('/keamanan/tamu', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  checkOutTamu: (id: string) =>
    apiFetch<BukuTamu>(`/keamanan/tamu/${id}/checkout`, { method: 'PATCH' }),

  // Insiden
  getAllInsiden: (params?: {
    page?: number;
    limit?: number;
    status?: InsidenStatus;
    category?: InsidenCategory;
    severity?: InsidenSeverity;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    if (params?.category) query.set('category', params.category);
    if (params?.severity) query.set('severity', params.severity);
    const qs = query.toString();
    return apiFetch<LaporanInsidenListResponse>(
      `/keamanan/insiden${qs ? `?${qs}` : ''}`,
    );
  },

  createInsiden: (data: {
    category: InsidenCategory;
    title: string;
    description: string;
    location?: string;
    severity?: InsidenSeverity;
    incidentDate: string;
  }) =>
    apiFetch<LaporanInsiden>('/keamanan/insiden', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateInsidenStatus: (
    id: string,
    data: { status: 'DITINDAK' | 'SELESAI' | 'DITUTUP'; adminNotes?: string },
  ) =>
    apiFetch<LaporanInsiden>(`/keamanan/insiden/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  cancelInsiden: (id: string) =>
    apiFetch<void>(`/keamanan/insiden/${id}`, { method: 'DELETE' }),
};
