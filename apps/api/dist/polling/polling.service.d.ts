import { PrismaService } from '../prisma/prisma.service';
import { CreatePollingDto } from './dto/create-polling.dto';
import { QueryPollingDto } from './dto/query-polling.dto';
export declare class PollingService {
    private prisma;
    constructor(prisma: PrismaService);
    private pollingInclude;
    findAll(query: QueryPollingDto, userId: string): Promise<{
        data: ({
            _count: {
                votes: number;
            };
            options: ({
                _count: {
                    votes: number;
                };
            } & {
                id: string;
                sortOrder: number;
                pollingId: string;
                label: string;
            })[];
            votes: {
                optionId: string;
            }[];
        } & {
            description: string | null;
            title: string;
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string;
            deadline: Date | null;
            isAnonymous: boolean;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, userId: string): Promise<{
        _count: {
            votes: number;
        };
        options: ({
            _count: {
                votes: number;
            };
        } & {
            id: string;
            sortOrder: number;
            pollingId: string;
            label: string;
        })[];
        votes: {
            optionId: string;
        }[];
    } & {
        description: string | null;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        deadline: Date | null;
        isAnonymous: boolean;
    }>;
    create(dto: CreatePollingDto, userId: string): Promise<{
        _count: {
            votes: number;
        };
        options: {
            id: string;
            sortOrder: number;
            pollingId: string;
            label: string;
        }[];
    } & {
        description: string | null;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        deadline: Date | null;
        isAnonymous: boolean;
    }>;
    vote(pollingId: string, optionId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        pollingId: string;
        optionId: string;
    } | {
        message: string;
    }>;
    closePolling(id: string, status: 'SELESAI' | 'DIBATALKAN', adminId: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        deadline: Date | null;
        isAnonymous: boolean;
    }>;
    delete(id: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        deadline: Date | null;
        isAnonymous: boolean;
    }>;
}
