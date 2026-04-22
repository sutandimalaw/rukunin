import { apiFetch } from './client';

export interface DuesBilling {
  id: string;
  householdId: string;
  period: string;
  amount: string;
  status: 'UNPAID' | 'PENDING' | 'PAID';
  paidAt: string | null;
  paidBy: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  household: {
    id: string;
    kkNumber: string;
    blok: string | null;
    houseNumber: string | null;
    kepalaKeluarga: string;
  };
}

export interface DuesSummary {
  totalKK: number;
  paid: number;
  pending: number;
  unpaid: number;
  totalCollected: number;
  totalExpected: number;
}

export interface DuesListResponse {
  data: DuesBilling[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface GenerateDuesData {
  period: string;
  amount: number;
}

export interface DelinquentHousehold {
  household: {
    id: string
    kkNumber: string
    blok: string | null
    houseNumber: string | null
    kepalaKeluarga: string
  }
  unpaidPeriods: { id: string; period: string }[]
  totalAmount: number
}

export interface MyDuesResponse {
  household: {
    id: string
    kkNumber: string
    blok: string | null
    houseNumber: string | null
  }
  billings: {
    id: string
    period: string
    amount: string
    status: 'UNPAID' | 'PENDING' | 'PAID'
    paidAt: string | null
    notes: string | null
  }[]
}

export const duesApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    period?: string;
    status?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.period) query.set('period', params.period);
    if (params?.status) query.set('status', params.status);
    const qs = query.toString();
    return apiFetch<DuesListResponse>(`/dues${qs ? `?${qs}` : ''}`);
  },

  getSummary: (period?: string) =>
    apiFetch<DuesSummary>(period ? `/dues/summary?period=${period}` : '/dues/summary'),

  generate: (data: GenerateDuesData) =>
    apiFetch<{ created: number; message: string }>('/dues/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  pay: (id: string, notes?: string) =>
    apiFetch<DuesBilling>(`/dues/${id}/pay`, {
      method: 'PATCH',
      body: JSON.stringify({ notes }),
    }),

  unpay: (id: string) =>
    apiFetch<DuesBilling>(`/dues/${id}/unpay`, {
      method: 'PATCH',
    }),

  getDelinquent: (params?: { minMonths?: number; lookback?: number }) => {
    const query = new URLSearchParams()
    if (params?.minMonths) query.set('minMonths', String(params.minMonths))
    if (params?.lookback) query.set('lookback', String(params.lookback))
    const qs = query.toString()
    return apiFetch<DelinquentHousehold[]>(`/dues/delinquent${qs ? `?${qs}` : ''}`)
  },

  getMyDues: () => apiFetch<MyDuesResponse>('/dues/my'),

  batchPay: (ids: string[], notes?: string) =>
    apiFetch<{ updated: number; message: string }>('/dues/batch-pay', {
      method: 'PATCH',
      body: JSON.stringify({ ids, notes }),
    }),

  requestPay: (ids: string[]) =>
    apiFetch<{ updated: number; message: string }>('/dues/request-pay', {
      method: 'PATCH',
      body: JSON.stringify({ ids }),
    }),

  rejectPay: (id: string) =>
    apiFetch<DuesBilling>(`/dues/${id}/reject`, {
      method: 'PATCH',
    }),
};
