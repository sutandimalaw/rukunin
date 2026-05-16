import { PrismaService } from '../prisma/prisma.service';
import { UpsertProfilProfesiDto } from './dto/upsert-profil-profesi.dto';
import { QueryProfilProfesiDto } from './dto/query-profil-profesi.dto';
export declare class ProfilProfesiService {
    private prisma;
    constructor(prisma: PrismaService);
    private userSelect;
    findAll(query: QueryProfilProfesiDto): Promise<{
        data: ({
            user: {
                profile: {
                    fullName: string | null;
                    avatarUrl: string | null;
                } | null;
                email: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            category: import("@prisma/client").$Enums.ProfilKategori;
            isPublished: boolean;
            userId: string;
            whatsapp: string | null;
            jobTitle: string;
            skills: string;
            bio: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findAllAdmin(query: QueryProfilProfesiDto): Promise<{
        data: ({
            user: {
                profile: {
                    fullName: string | null;
                    avatarUrl: string | null;
                } | null;
                email: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            category: import("@prisma/client").$Enums.ProfilKategori;
            isPublished: boolean;
            userId: string;
            whatsapp: string | null;
            jobTitle: string;
            skills: string;
            bio: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        user: {
            profile: {
                fullName: string | null;
                avatarUrl: string | null;
            } | null;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: import("@prisma/client").$Enums.ProfilKategori;
        isPublished: boolean;
        userId: string;
        whatsapp: string | null;
        jobTitle: string;
        skills: string;
        bio: string | null;
    }>;
    findMine(userId: string): Promise<({
        user: {
            profile: {
                fullName: string | null;
                avatarUrl: string | null;
            } | null;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: import("@prisma/client").$Enums.ProfilKategori;
        isPublished: boolean;
        userId: string;
        whatsapp: string | null;
        jobTitle: string;
        skills: string;
        bio: string | null;
    }) | null>;
    upsert(userId: string, dto: UpsertProfilProfesiDto): Promise<{
        user: {
            profile: {
                fullName: string | null;
                avatarUrl: string | null;
            } | null;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: import("@prisma/client").$Enums.ProfilKategori;
        isPublished: boolean;
        userId: string;
        whatsapp: string | null;
        jobTitle: string;
        skills: string;
        bio: string | null;
    }>;
    remove(userId: string): Promise<{
        message: string;
    }>;
}
