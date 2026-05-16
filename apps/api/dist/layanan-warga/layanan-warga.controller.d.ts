import { LayananWargaService } from './layanan-warga.service';
import { CreateLayananWargaDto } from './dto/create-layanan-warga.dto';
import { UpdateLayananStatusDto } from './dto/update-layanan-status.dto';
import { QueryLayananWargaDto } from './dto/query-layanan-warga.dto';
export declare class LayananWargaController {
    private readonly service;
    constructor(service: LayananWargaService);
    findAll(query: QueryLayananWargaDto, user: {
        id: string;
        role: string;
    }): Promise<{
        data: ({
            requester: {
                profile: {
                    fullName: string | null;
                } | null;
                email: string;
                id: string;
            };
            processor: {
                profile: {
                    fullName: string | null;
                } | null;
                email: string;
                id: string;
            } | null;
        } & {
            type: string;
            description: string;
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            subject: string;
            purpose: string | null;
            adminNotes: string | null;
            requestedBy: string;
            processedBy: string | null;
            processedAt: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, user: {
        id: string;
        role: string;
    }): Promise<{
        requester: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
        processor: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        } | null;
    } & {
        type: string;
        description: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        location: string | null;
        subject: string;
        purpose: string | null;
        adminNotes: string | null;
        requestedBy: string;
        processedBy: string | null;
        processedAt: Date | null;
    }>;
    create(dto: CreateLayananWargaDto, user: {
        id: string;
    }): Promise<{
        requester: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
        processor: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        } | null;
    } & {
        type: string;
        description: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        location: string | null;
        subject: string;
        purpose: string | null;
        adminNotes: string | null;
        requestedBy: string;
        processedBy: string | null;
        processedAt: Date | null;
    }>;
    updateStatus(id: string, dto: UpdateLayananStatusDto, user: {
        id: string;
    }): Promise<{
        requester: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
        processor: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        } | null;
    } & {
        type: string;
        description: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        location: string | null;
        subject: string;
        purpose: string | null;
        adminNotes: string | null;
        requestedBy: string;
        processedBy: string | null;
        processedAt: Date | null;
    }>;
    remove(id: string, user: {
        id: string;
        role: string;
    }): Promise<{
        type: string;
        description: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        location: string | null;
        subject: string;
        purpose: string | null;
        adminNotes: string | null;
        requestedBy: string;
        processedBy: string | null;
        processedAt: Date | null;
    }>;
}
