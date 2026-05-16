import { PollingService } from './polling.service';
import { CreatePollingDto } from './dto/create-polling.dto';
import { QueryPollingDto } from './dto/query-polling.dto';
export declare class PollingController {
    private readonly service;
    constructor(service: PollingService);
    findAll(query: QueryPollingDto, user: {
        id: string;
    }): Promise<{
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
    findOne(id: string, user: {
        id: string;
    }): Promise<{
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
    create(dto: CreatePollingDto, user: {
        id: string;
    }): Promise<{
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
    vote(pollingId: string, optionId: string, user: {
        id: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        pollingId: string;
        optionId: string;
    } | {
        message: string;
    }>;
    close(id: string, status: 'SELESAI' | 'DIBATALKAN', user: {
        id: string;
    }): Promise<{
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
