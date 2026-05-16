import { UmkmService } from './umkm.service';
import { CreateUmkmUsahaDto } from './dto/create-umkm-usaha.dto';
import { UpdateUmkmUsahaDto } from './dto/update-umkm-usaha.dto';
import { QueryUmkmDto } from './dto/query-umkm.dto';
import { UpdateUsahaStatusDto } from './dto/update-usaha-status.dto';
import { CreateUmkmProdukDto } from './dto/create-umkm-produk.dto';
import { UpdateUmkmProdukDto } from './dto/update-umkm-produk.dto';
export declare class UmkmController {
    private readonly service;
    constructor(service: UmkmService);
    findAll(query: QueryUmkmDto, user: {
        id: string;
        role: string;
    }): Promise<{
        data: ({
            _count: {
                products: number;
            };
            owner: {
                profile: {
                    fullName: string | null;
                } | null;
                email: string;
                id: string;
            };
        } & {
            description: string;
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            category: string;
            adminNotes: string | null;
            address: string | null;
            whatsapp: string;
            isActive: boolean;
            ownerId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findMy(user: {
        id: string;
    }): Promise<({
        _count: {
            products: number;
        };
        products: {
            type: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            price: import("@prisma/client/runtime/library").Decimal;
            isAvailable: boolean;
            usahaId: string;
        }[];
    } & {
        description: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        adminNotes: string | null;
        address: string | null;
        whatsapp: string;
        isActive: boolean;
        ownerId: string;
    })[]>;
    findOne(id: string): Promise<{
        owner: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
        products: {
            type: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            price: import("@prisma/client/runtime/library").Decimal;
            isAvailable: boolean;
            usahaId: string;
        }[];
    } & {
        description: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        adminNotes: string | null;
        address: string | null;
        whatsapp: string;
        isActive: boolean;
        ownerId: string;
    }>;
    create(dto: CreateUmkmUsahaDto, user: {
        id: string;
    }): Promise<{
        owner: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
    } & {
        description: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        adminNotes: string | null;
        address: string | null;
        whatsapp: string;
        isActive: boolean;
        ownerId: string;
    }>;
    update(id: string, dto: UpdateUmkmUsahaDto, user: {
        id: string;
        role: string;
    }): Promise<{
        owner: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
    } & {
        description: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        adminNotes: string | null;
        address: string | null;
        whatsapp: string;
        isActive: boolean;
        ownerId: string;
    }>;
    updateStatus(id: string, dto: UpdateUsahaStatusDto): Promise<{
        owner: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
    } & {
        description: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        adminNotes: string | null;
        address: string | null;
        whatsapp: string;
        isActive: boolean;
        ownerId: string;
    }>;
    remove(id: string, user: {
        id: string;
        role: string;
    }): Promise<{
        description: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        adminNotes: string | null;
        address: string | null;
        whatsapp: string;
        isActive: boolean;
        ownerId: string;
    }>;
    findProduk(id: string): Promise<{
        type: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        isAvailable: boolean;
        usahaId: string;
    }[]>;
    createProduk(usahaId: string, dto: CreateUmkmProdukDto, user: {
        id: string;
        role: string;
    }): Promise<{
        type: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        isAvailable: boolean;
        usahaId: string;
    }>;
    updateProduk(produkId: string, dto: UpdateUmkmProdukDto, user: {
        id: string;
        role: string;
    }): Promise<{
        type: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        isAvailable: boolean;
        usahaId: string;
    }>;
    deleteProduk(produkId: string, user: {
        id: string;
        role: string;
    }): Promise<{
        type: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        isAvailable: boolean;
        usahaId: string;
    }>;
}
