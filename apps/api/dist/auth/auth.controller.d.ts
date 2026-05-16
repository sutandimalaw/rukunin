import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, response: Response): Promise<{
        message: string | undefined;
        pending: boolean;
        accessToken?: undefined;
        user?: undefined;
    } | {
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            status: import("@prisma/client").$Enums.UserStatus;
            profile: {
                id: string;
                updatedAt: Date;
                fullName: string | null;
                username: string | null;
                website: string | null;
                avatarUrl: string | null;
            } | null;
            isProfileComplete: boolean;
        };
        message?: undefined;
        pending?: undefined;
    }>;
    login(_dto: LoginDto, request: Request, response: Response): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: string;
            profile: unknown;
        };
    }>;
    logout(response: Response): Promise<{
        message: string;
    }>;
    refresh(user: {
        id: string;
        email: string;
    }, response: Response): Promise<{
        accessToken: string;
    }>;
    getMe(user: {
        id: string;
    }): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        status: import("@prisma/client").$Enums.UserStatus;
        profile: {
            id: string;
            updatedAt: Date;
            fullName: string | null;
            username: string | null;
            website: string | null;
            avatarUrl: string | null;
        } | null;
        isProfileComplete: boolean;
    }>;
    getPendingUsers(): Promise<{
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
    }[]>;
    getActiveUsers(): Promise<{
        profile: {
            fullName: string | null;
            avatarUrl: string | null;
        } | null;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
    }[]>;
    approveUser(id: string): Promise<{
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
    }>;
    rejectUser(id: string): Promise<{
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
    }>;
    private setRefreshTokenCookie;
}
