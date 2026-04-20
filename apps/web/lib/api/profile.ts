import { apiFetch } from './client';

export interface Profile {
  id: string;
  fullName: string | null;
  username: string | null;
  website: string | null;
  avatarUrl: string | null;
}

export interface UpdateProfileData {
  fullName?: string;
  username?: string;
  website?: string;
  avatarUrl?: string;
}

export const profileApi = {
  get: () => apiFetch<Profile>('/profile'),

  update: (data: UpdateProfileData) =>
    apiFetch<Profile>('/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
