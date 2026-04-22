import { apiFetch } from './client';

export interface ResidentHousehold {
  id: string;
  kkNumber: string;
  blok: string | null;
  rt: string | null;
  houseNumber: string | null;
  houseType: string | null;
  ownershipStatus: string | null;
}

export interface Resident {
  id: string;
  fullName: string;
  idNumber: string | null;
  gender: string;
  dateOfBirth: string | null;
  maritalStatus: string | null;
  occupation: string | null;
  email: string | null;
  familyRelation: string;
  householdId: string;
  household: ResidentHousehold;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResidentListResponse {
  data: Resident[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ResidentSummary {
  totalJiwa: number;
  totalKK: number;
  totalLakiLaki: number;
  totalPerempuan: number;
  totalBalita: number;
  totalLansia: number;
}

export interface CreateResidentData {
  fullName: string;
  idNumber?: string;
  gender: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  occupation?: string;
  email?: string;
  householdId: string;
  familyRelation: string;
}

export interface UpsertMyProfileData {
  kkNumber: string;
  blok?: string;
  rt?: string;
  houseNumber?: string;
  houseType?: string;
  ownershipStatus?: string;

  fullName: string;
  idNumber?: string;
  gender: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  occupation?: string;
}

export const residentsApi = {
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
    return apiFetch<ResidentListResponse>(`/residents${qs ? `?${qs}` : ''}`);
  },

  getSummary: () => apiFetch<ResidentSummary>('/residents/summary'),

  getById: (id: string) => apiFetch<Resident>(`/residents/${id}`),

  create: (data: CreateResidentData) =>
    apiFetch<Resident>('/residents', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateResidentData>) =>
    apiFetch<Resident>(`/residents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/residents/${id}`, { method: 'DELETE' }),

  getMyProfile: () => apiFetch<Resident>('/residents/my-profile'),

  upsertMyProfile: (data: UpsertMyProfileData) =>
    apiFetch<Resident>('/residents/my-profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
