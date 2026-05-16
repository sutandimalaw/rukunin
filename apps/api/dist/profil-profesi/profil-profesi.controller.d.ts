import { ProfilProfesiService } from './profil-profesi.service';
import { UpsertProfilProfesiDto } from './dto/upsert-profil-profesi.dto';
import { QueryProfilProfesiDto } from './dto/query-profil-profesi.dto';
export declare class ProfilProfesiController {
    private readonly service;
    constructor(service: ProfilProfesiService);
    findAll(query: QueryProfilProfesiDto, user: {
        id: string;
        role: string;
    }): Promise<{
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
    findMine(user: {
        id: string;
    }): Promise<({
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
    upsert(dto: UpsertProfilProfesiDto, user: {
        id: string;
    }): Promise<{
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
    remove(user: {
        id: string;
    }): Promise<{
        message: string;
    }>;
}
