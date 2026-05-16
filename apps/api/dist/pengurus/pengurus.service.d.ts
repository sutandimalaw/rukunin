import { PrismaService } from '../prisma/prisma.service';
import { CreatePengurusDto } from './dto/create-pengurus.dto';
import { UpdatePengurusDto } from './dto/update-pengurus.dto';
import { QueryPengurusDto } from './dto/query-pengurus.dto';
type CurrentUser = {
    id: string;
    role: string;
};
export declare class PengurusService {
    private prisma;
    constructor(prisma: PrismaService);
    private userInclude;
    findAll(query: QueryPengurusDto): Promise<({
        user: {
            profile: {
                fullName: string | null;
                avatarUrl: string | null;
            } | null;
            email: string;
            id: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        createdBy: string;
        notes: string | null;
        userId: string | null;
        whatsapp: string | null;
        isActive: boolean;
        posisi: string;
        customPosisi: string | null;
        urutan: number;
        photoUrl: string | null;
        periodeStart: number;
        periodeEnd: number;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            profile: {
                fullName: string | null;
                avatarUrl: string | null;
            } | null;
            email: string;
            id: string;
        } | null;
        creator: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        createdBy: string;
        notes: string | null;
        userId: string | null;
        whatsapp: string | null;
        isActive: boolean;
        posisi: string;
        customPosisi: string | null;
        urutan: number;
        photoUrl: string | null;
        periodeStart: number;
        periodeEnd: number;
    }>;
    create(dto: CreatePengurusDto, currentUser: CurrentUser): Promise<{
        user: {
            profile: {
                fullName: string | null;
                avatarUrl: string | null;
            } | null;
            email: string;
            id: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        createdBy: string;
        notes: string | null;
        userId: string | null;
        whatsapp: string | null;
        isActive: boolean;
        posisi: string;
        customPosisi: string | null;
        urutan: number;
        photoUrl: string | null;
        periodeStart: number;
        periodeEnd: number;
    }>;
    update(id: string, dto: UpdatePengurusDto, currentUser: CurrentUser): Promise<{
        user: {
            profile: {
                fullName: string | null;
                avatarUrl: string | null;
            } | null;
            email: string;
            id: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        createdBy: string;
        notes: string | null;
        userId: string | null;
        whatsapp: string | null;
        isActive: boolean;
        posisi: string;
        customPosisi: string | null;
        urutan: number;
        photoUrl: string | null;
        periodeStart: number;
        periodeEnd: number;
    }>;
    remove(id: string, currentUser: CurrentUser): Promise<{
        success: boolean;
    }>;
    private assertAdmin;
    private validatePosisi;
    private validatePeriode;
    private assertUserExists;
}
export {};
