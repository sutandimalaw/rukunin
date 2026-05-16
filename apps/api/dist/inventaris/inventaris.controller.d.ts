import { InventarisService } from './inventaris.service';
import { CreateInventarisDto } from './dto/create-inventaris.dto';
import { UpdateInventarisDto } from './dto/update-inventaris.dto';
import { QueryInventarisDto } from './dto/query-inventaris.dto';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';
import { UpdatePeminjamanStatusDto } from './dto/update-peminjaman-status.dto';
import { QueryPeminjamanDto } from './dto/query-peminjaman.dto';
export declare class InventarisController {
    private readonly service;
    constructor(service: InventarisService);
    findAllInventaris(query: QueryInventarisDto): Promise<{
        data: {
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            createdBy: string;
            category: string;
            isAvailable: boolean;
            quantity: number;
            condition: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOneInventaris(id: string): Promise<{
        peminjaman: ({
            inventaris: {
                id: string;
                name: string;
                category: string;
            };
            processor: {
                profile: {
                    fullName: string | null;
                } | null;
                email: string;
                id: string;
            } | null;
            borrower: {
                profile: {
                    fullName: string | null;
                } | null;
                email: string;
                id: string;
            };
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            purpose: string;
            adminNotes: string | null;
            processedBy: string | null;
            processedAt: Date | null;
            quantity: number;
            inventarisId: string;
            borrowDate: Date;
            returnDate: Date;
            borrowerId: string;
            actualReturn: Date | null;
        })[];
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        createdBy: string;
        category: string;
        isAvailable: boolean;
        quantity: number;
        condition: string;
    }>;
    createInventaris(dto: CreateInventarisDto, user: {
        id: string;
    }): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        createdBy: string;
        category: string;
        isAvailable: boolean;
        quantity: number;
        condition: string;
    }>;
    updateInventaris(id: string, dto: UpdateInventarisDto): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        createdBy: string;
        category: string;
        isAvailable: boolean;
        quantity: number;
        condition: string;
    }>;
    deleteInventaris(id: string): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        createdBy: string;
        category: string;
        isAvailable: boolean;
        quantity: number;
        condition: string;
    }>;
    findAllPeminjaman(query: QueryPeminjamanDto, user: {
        id: string;
        role: string;
    }): Promise<{
        data: ({
            inventaris: {
                id: string;
                name: string;
                category: string;
            };
            processor: {
                profile: {
                    fullName: string | null;
                } | null;
                email: string;
                id: string;
            } | null;
            borrower: {
                profile: {
                    fullName: string | null;
                } | null;
                email: string;
                id: string;
            };
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            purpose: string;
            adminNotes: string | null;
            processedBy: string | null;
            processedAt: Date | null;
            quantity: number;
            inventarisId: string;
            borrowDate: Date;
            returnDate: Date;
            borrowerId: string;
            actualReturn: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOnePeminjaman(id: string, user: {
        id: string;
        role: string;
    }): Promise<{
        inventaris: {
            id: string;
            name: string;
            category: string;
        };
        processor: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        } | null;
        borrower: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        purpose: string;
        adminNotes: string | null;
        processedBy: string | null;
        processedAt: Date | null;
        quantity: number;
        inventarisId: string;
        borrowDate: Date;
        returnDate: Date;
        borrowerId: string;
        actualReturn: Date | null;
    }>;
    createPeminjaman(dto: CreatePeminjamanDto, user: {
        id: string;
    }): Promise<{
        inventaris: {
            id: string;
            name: string;
            category: string;
        };
        processor: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        } | null;
        borrower: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        purpose: string;
        adminNotes: string | null;
        processedBy: string | null;
        processedAt: Date | null;
        quantity: number;
        inventarisId: string;
        borrowDate: Date;
        returnDate: Date;
        borrowerId: string;
        actualReturn: Date | null;
    }>;
    updatePeminjamanStatus(id: string, dto: UpdatePeminjamanStatusDto, user: {
        id: string;
    }): Promise<{
        inventaris: {
            id: string;
            name: string;
            category: string;
        };
        processor: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        } | null;
        borrower: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        purpose: string;
        adminNotes: string | null;
        processedBy: string | null;
        processedAt: Date | null;
        quantity: number;
        inventarisId: string;
        borrowDate: Date;
        returnDate: Date;
        borrowerId: string;
        actualReturn: Date | null;
    }>;
    cancelPeminjaman(id: string, user: {
        id: string;
        role: string;
    }): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        purpose: string;
        adminNotes: string | null;
        processedBy: string | null;
        processedAt: Date | null;
        quantity: number;
        inventarisId: string;
        borrowDate: Date;
        returnDate: Date;
        borrowerId: string;
        actualReturn: Date | null;
    }>;
}
