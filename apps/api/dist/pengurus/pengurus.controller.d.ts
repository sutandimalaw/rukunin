import { PengurusService } from './pengurus.service';
import { CreatePengurusDto } from './dto/create-pengurus.dto';
import { UpdatePengurusDto } from './dto/update-pengurus.dto';
import { QueryPengurusDto } from './dto/query-pengurus.dto';
export declare class PengurusController {
    private readonly service;
    constructor(service: PengurusService);
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
    create(dto: CreatePengurusDto, user: {
        id: string;
        role: string;
    }): Promise<{
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
    update(id: string, dto: UpdatePengurusDto, user: {
        id: string;
        role: string;
    }): Promise<{
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
    remove(id: string, user: {
        id: string;
        role: string;
    }): Promise<{
        success: boolean;
    }>;
}
