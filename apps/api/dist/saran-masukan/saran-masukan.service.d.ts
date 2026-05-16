import { PrismaService } from '../prisma/prisma.service';
import { CreateSaranMasukanDto } from './dto/create-saran-masukan.dto';
import { RespondSaranMasukanDto } from './dto/respond-saran-masukan.dto';
import { QuerySaranMasukanDto } from './dto/query-saran-masukan.dto';
export declare class SaranMasukanService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: QuerySaranMasukanDto): Promise<{
        data: {
            submitter: {
                profile: {
                    fullName: string | null;
                } | null;
                email: string;
                id: string;
            } | null;
            submittedBy: string | null;
            responder: {
                profile: {
                    fullName: string | null;
                } | null;
                email: string;
                id: string;
            } | null;
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            category: string;
            content: string;
            subject: string;
            isAnonymous: boolean;
            adminResponse: string | null;
            respondedBy: string | null;
            respondedAt: Date | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findMine(query: QuerySaranMasukanDto, userId: string): Promise<{
        data: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            category: string;
            content: string;
            subject: string;
            submittedBy: string | null;
            isAnonymous: boolean;
            adminResponse: string | null;
            respondedBy: string | null;
            respondedAt: Date | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(dto: CreateSaranMasukanDto, userId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        content: string;
        subject: string;
        submittedBy: string | null;
        isAnonymous: boolean;
        adminResponse: string | null;
        respondedBy: string | null;
        respondedAt: Date | null;
    }>;
    respond(id: string, dto: RespondSaranMasukanDto, adminId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        content: string;
        subject: string;
        submittedBy: string | null;
        isAnonymous: boolean;
        adminResponse: string | null;
        respondedBy: string | null;
        respondedAt: Date | null;
    }>;
    getSummary(): Promise<{
        baru: number;
        dibaca: number;
        ditanggapi: number;
        total: number;
    }>;
}
