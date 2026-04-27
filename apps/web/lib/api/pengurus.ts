import { apiFetch } from './client';

export type PosisiPengurus =
  | 'KETUA'
  | 'WAKIL_KETUA'
  | 'SEKRETARIS'
  | 'BENDAHARA'
  | 'SEKSI_KEAMANAN'
  | 'SEKSI_SOSIAL'
  | 'SEKSI_PEMUDA'
  | 'SEKSI_KEBERSIHAN'
  | 'SEKSI_HUMAS'
  | 'ANGGOTA'
  | 'LAINNYA';

export interface PosisiOption {
  value: PosisiPengurus;
  label: string;
  level: number;
}

export const POSISI_OPTIONS: readonly PosisiOption[] = [
  { value: 'KETUA', label: 'Ketua RT', level: 0 },
  { value: 'WAKIL_KETUA', label: 'Wakil Ketua RT', level: 1 },
  { value: 'SEKRETARIS', label: 'Sekretaris', level: 2 },
  { value: 'BENDAHARA', label: 'Bendahara', level: 2 },
  { value: 'SEKSI_KEAMANAN', label: 'Seksi Keamanan', level: 3 },
  { value: 'SEKSI_SOSIAL', label: 'Seksi Sosial', level: 3 },
  { value: 'SEKSI_PEMUDA', label: 'Seksi Pemuda', level: 3 },
  { value: 'SEKSI_KEBERSIHAN', label: 'Seksi Kebersihan', level: 3 },
  { value: 'SEKSI_HUMAS', label: 'Seksi Humas', level: 3 },
  { value: 'ANGGOTA', label: 'Anggota', level: 4 },
  { value: 'LAINNYA', label: 'Lainnya', level: 4 },
] as const;

export interface PengurusUserInfo {
  id: string;
  email: string;
  profile?: { fullName: string | null; avatarUrl: string | null } | null;
}

export interface Pengurus {
  id: string;
  posisi: PosisiPengurus;
  customPosisi: string | null;
  urutan: number;
  userId: string | null;
  fullName: string;
  whatsapp: string | null;
  photoUrl: string | null;
  periodeStart: number;
  periodeEnd: number;
  isActive: boolean;
  notes: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  user?: PengurusUserInfo | null;
  creator?: PengurusUserInfo;
}

export interface CreatePengurusData {
  posisi: PosisiPengurus;
  customPosisi?: string;
  urutan?: number;
  userId?: string;
  fullName: string;
  whatsapp?: string;
  photoUrl?: string;
  periodeStart: number;
  periodeEnd: number;
  isActive?: boolean;
  notes?: string;
}

export type UpdatePengurusData = Partial<Omit<CreatePengurusData, 'userId'>> & {
  userId?: string | null;
};

export const pengurusApi = {
  getAll: (params?: { active?: boolean; periodeStart?: number }) => {
    const query = new URLSearchParams();
    if (params?.active !== undefined) query.set('active', String(params.active));
    if (params?.periodeStart !== undefined)
      query.set('periodeStart', String(params.periodeStart));
    const qs = query.toString();
    return apiFetch<Pengurus[]>(`/pengurus${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string) => apiFetch<Pengurus>(`/pengurus/${id}`),

  create: (data: CreatePengurusData) =>
    apiFetch<Pengurus>('/pengurus', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdatePengurusData) =>
    apiFetch<Pengurus>(`/pengurus/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/pengurus/${id}`, { method: 'DELETE' }),
};

export function getPosisiLabel(
  posisi: PosisiPengurus,
  customPosisi?: string | null,
): string {
  if (posisi === 'LAINNYA' && customPosisi) return customPosisi;
  return POSISI_OPTIONS.find((p) => p.value === posisi)?.label ?? posisi;
}

export function getPosisiLevel(posisi: PosisiPengurus): number {
  return POSISI_OPTIONS.find((p) => p.value === posisi)?.level ?? 4;
}
