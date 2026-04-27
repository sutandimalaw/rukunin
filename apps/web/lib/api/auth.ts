import { apiFetch } from './client';

export interface AuthUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'WARGA';
  status: 'PENDING' | 'ACTIVE' | 'REJECTED';
  isProfileComplete: boolean;
  profile: {
    id: string;
    fullName: string | null;
    username: string | null;
    avatarUrl: string | null;
    website: string | null;
  } | null;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface PendingResponse {
  message: string;
  pending: true;
}

export type RegisterResponse = AuthResponse | PendingResponse;

export interface PendingUser {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface ActiveUser {
  id: string;
  email: string;
  role: string;
  profile: { fullName: string | null; avatarUrl: string | null } | null;
}

export const authApi = {
  register: (email: string, password: string, role?: 'ADMIN' | 'WARGA') =>
    apiFetch<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    }),

  login: (email: string, password: string) =>
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch<{ message: string }>('/auth/logout', { method: 'POST' }),

  refresh: () =>
    apiFetch<{ accessToken: string }>('/auth/refresh', { method: 'POST' }),

  me: () => apiFetch<AuthUser>('/auth/me'),

  getPendingUsers: () =>
    apiFetch<PendingUser[]>('/auth/admin/pending-users'),

  getActiveUsers: () =>
    apiFetch<ActiveUser[]>('/auth/admin/active-users'),

  approveUser: (id: string) =>
    apiFetch<{ id: string; status: string }>('/auth/admin/users/' + id + '/approve', {
      method: 'PATCH',
    }),

  rejectUser: (id: string) =>
    apiFetch<{ id: string; status: string }>('/auth/admin/users/' + id + '/reject', {
      method: 'PATCH',
    }),
};
