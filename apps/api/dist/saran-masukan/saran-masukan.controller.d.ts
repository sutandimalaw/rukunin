import { SaranMasukanService } from './saran-masukan.service';
import { CreateSaranMasukanDto } from './dto/create-saran-masukan.dto';
import { RespondSaranMasukanDto } from './dto/respond-saran-masukan.dto';
import { QuerySaranMasukanDto } from './dto/query-saran-masukan.dto';
export declare class SaranMasukanController {
    private readonly service;
    constructor(service: SaranMasukanService);
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
    getSummary(): Promise<{
        baru: number;
        dibaca: number;
        ditanggapi: number;
        total: number;
    }>;
    findMine(query: QuerySaranMasukanDto, user: {
        id: string;
    }): Promise<{
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
    create(dto: CreateSaranMasukanDto, user: {
        id: string;
    }): Promise<{
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
    respond(id: string, dto: RespondSaranMasukanDto, user: {
        id: string;
    }): Promise<{
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
}
