import { SetMetadata } from '@nestjs/common';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'WARGA';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
