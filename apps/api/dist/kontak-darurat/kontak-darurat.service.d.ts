import { PrismaService } from '../prisma/prisma.service';
import { CreateKontakDaruratDto } from './dto/create-kontak-darurat.dto';
import { UpdateKontakDaruratDto } from './dto/update-kontak-darurat.dto';
import { QueryKontakDaruratDto } from './dto/query-kontak-darurat.dto';
export declare class KontakDaruratService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryKontakDaruratDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        createdBy: string;
        category: string;
        address: string | null;
        isActive: boolean;
        sortOrder: number;
        phoneNumber: string;
    }[]>;
    findAllAdmin(query: QueryKontakDaruratDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        createdBy: string;
        category: string;
        address: string | null;
        isActive: boolean;
        sortOrder: number;
        phoneNumber: string;
    }[]>;
    create(dto: CreateKontakDaruratDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        createdBy: string;
        category: string;
        address: string | null;
        isActive: boolean;
        sortOrder: number;
        phoneNumber: string;
    }>;
    update(id: string, dto: UpdateKontakDaruratDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        createdBy: string;
        category: string;
        address: string | null;
        isActive: boolean;
        sortOrder: number;
        phoneNumber: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        createdBy: string;
        category: string;
        address: string | null;
        isActive: boolean;
        sortOrder: number;
        phoneNumber: string;
    }>;
}
