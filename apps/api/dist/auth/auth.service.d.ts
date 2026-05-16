import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        pending: true;
        message: string;
    } | {
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
        accessToken: string;
        refreshToken: string;
        pending?: undefined;
        message?: undefined;
    }>;
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        status: "ACTIVE";
        profile: {
            id: string;
            updatedAt: Date;
            fullName: string | null;
            username: string | null;
            website: string | null;
            avatarUrl: string | null;
        } | null;
        isProfileComplete: boolean;
    } | null>;
    login(user: {
        id: string;
        email: string;
        role: string;
        profile: unknown;
    }): Promise<{
        user: {
            id: string;
            email: string;
            role: string;
            profile: unknown;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(userId: string, email: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(userId: string): Promise<{
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
    approveUser(userId: string): Promise<{
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
    }>;
    rejectUser(userId: string): Promise<{
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
    }>;
    private generateTokens;
}
