import { apiFetch } from './client';

export const FAMILY_RELATIONS = [
  { value: 'KEPALA_KELUARGA', label: 'Kepala Keluarga' },
  { value: 'ISTRI', label: 'Istri' },
  { value: 'SUAMI', label: 'Suami' },
  { value: 'ANAK', label: 'Anak' },
  { value: 'ORANG_TUA', label: 'Orang Tua' },
  { value: 'MERTUA', label: 'Mertua' },
  { value: 'MENANTU', label: 'Menantu' },
  { value: 'CUCU', label: 'Cucu' },
  { value: 'ART', label: 'ART (Pembantu)' },
  { value: 'FAMILI_LAIN', label: 'Famili Lain' },
  { value: 'LAINNYA', label: 'Lainnya' },
] as const;

export type FamilyRelationValue = (typeof FAMILY_RELATIONS)[number]['value'];

export function getFamilyRelationLabel(value: string): string {
  return FAMILY_RELATIONS.find((r) => r.value === value)?.label ?? value;
}

export interface HouseholdMember {
  id: string;
  fullName: string;
  gender: string;
  familyRelation: string;
  dateOfBirth: string | null;
}

export interface Household {
  id: string;
  kkNumber: string;
  blok: string | null;
  rt: string | null;
  houseNumber: string | null;
  houseType: string | null;
  ownershipStatus: string | null;
  startDateOfOccupancy: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface HouseholdWithMembers extends Household {
  members: HouseholdMember[];
}

export interface HouseholdListItem extends Household {
  memberCount: number;
  kepalaKeluarga: { fullName: string; gender: string } | null;
}

export interface HouseholdListResponse {
  data: HouseholdListItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CreateHouseholdData {
  kkNumber: string;
  blok?: string;
  rt?: string;
  houseNumber?: string;
  houseType?: string;
  ownershipStatus?: string;
  startDateOfOccupancy?: string;
}

export interface CreateWithHeadData {
  household: CreateHouseholdData;
  head: {
    fullName: string;
    idNumber?: string;
    gender: string;
    dateOfBirth?: string;
    maritalStatus?: string;
    occupation?: string;
    email?: string;
  };
}

export const householdsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    blok?: string;
    rt?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search) query.set('search', params.search);
    if (params?.blok) query.set('blok', params.blok);
    if (params?.rt) query.set('rt', params.rt);
    const qs = query.toString();
    return apiFetch<HouseholdListResponse>(`/households${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string) =>
    apiFetch<HouseholdWithMembers>(`/households/${id}`),

  getByKkNumber: (kkNumber: string) =>
    apiFetch<HouseholdWithMembers | null>(`/households/by-kk/${kkNumber}`),

  create: (data: CreateHouseholdData) =>
    apiFetch<Household>('/households', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createWithHead: (data: CreateWithHeadData) =>
    apiFetch<{ household: Household; head: HouseholdMember }>('/households/with-head', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateHouseholdData>) =>
    apiFetch<Household>(`/households/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/households/${id}`, { method: 'DELETE' }),
};
