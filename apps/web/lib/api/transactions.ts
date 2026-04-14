import { apiFetch } from './client';

export interface Transaction {
  id: string;
  date: string;
  type: string;
  category: string;
  amount: string;
  description: string | null;
  balance: string;
  createdBy: string;
  createdAt: string;
}

export interface TransactionListResponse {
  data: Transaction[];
  balance: string | number;
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface TransactionSummary {
  currentBalance: string | number;
  incomeThisMonth: string | number;
  expensesThisMonth: string | number;
}

export interface CreateTransactionData {
  type: 'IN' | 'OUT';
  category: string;
  amount: number;
  description: string;
  date?: string;
}

export const transactionsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.type) query.set('type', params.type);
    if (params?.category) query.set('category', params.category);
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);
    const qs = query.toString();
    return apiFetch<TransactionListResponse>(
      `/transactions${qs ? `?${qs}` : ''}`,
    );
  },

  getSummary: () => apiFetch<TransactionSummary>('/transactions/summary'),

  create: (data: CreateTransactionData) =>
    apiFetch<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/transactions/${id}`, { method: 'DELETE' }),
};
