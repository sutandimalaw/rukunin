import { apiFetch } from './client';

export interface FinancialReportSummary {
  totalIn: number;
  totalOut: number;
  netBalance: number;
  currentBalance: number;
  transactionCount: number;
}

export interface MonthlyBreakdown {
  month: string;
  in: number;
  out: number;
  net: number;
}

export interface CategoryBreakdown {
  category: string;
  in: number;
  out: number;
  net: number;
}

export interface FinancialReport {
  summary: FinancialReportSummary;
  byMonth: MonthlyBreakdown[];
  byCategory: CategoryBreakdown[];
}

export interface ResidentsReport {
  total: number;
  byBlok: { blok: string; count: number }[];
  byOwnership: { ownershipStatus: string; count: number }[];
  byGender: { gender: string; count: number }[];
}

export const reportsApi = {
  getFinancial: (params?: { startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams();
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);
    const qs = query.toString();
    return apiFetch<FinancialReport>(`/reports/financial${qs ? `?${qs}` : ''}`);
  },

  getResidents: () => apiFetch<ResidentsReport>('/reports/residents'),
};
