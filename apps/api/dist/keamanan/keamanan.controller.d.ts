import { KeamananService } from './keamanan.service';
import { CreatePetugasDto } from './dto/create-petugas.dto';
import { UpdatePetugasDto } from './dto/update-petugas.dto';
import { CreateBukuTamuDto } from './dto/create-buku-tamu.dto';
import { QueryBukuTamuDto } from './dto/query-buku-tamu.dto';
import { CreateLaporanInsidenDto } from './dto/create-laporan-insiden.dto';
import { UpdateInsidenStatusDto } from './dto/update-insiden-status.dto';
import { QueryLaporanInsidenDto } from './dto/query-laporan-insiden.dto';
export declare class KeamananController {
    private readonly service;
    constructor(service: KeamananService);
    getSummary(): Promise<{
        tamuHariIni: number;
        insidenAktif: number;
        panicButton: number;
        petugasBertugas: number;
    }>;
    findAllPetugas(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        shift: string;
        createdBy: string;
        whatsapp: string | null;
        isActive: boolean;
        shiftTime: string;
        isOnDuty: boolean;
    }[]>;
    createPetugas(dto: CreatePetugasDto, user: {
        id: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        shift: string;
        createdBy: string;
        whatsapp: string | null;
        isActive: boolean;
        shiftTime: string;
        isOnDuty: boolean;
    }>;
    updatePetugas(id: string, dto: UpdatePetugasDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        shift: string;
        createdBy: string;
        whatsapp: string | null;
        isActive: boolean;
        shiftTime: string;
        isOnDuty: boolean;
    }>;
    deletePetugas(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        shift: string;
        createdBy: string;
        whatsapp: string | null;
        isActive: boolean;
        shiftTime: string;
        isOnDuty: boolean;
    }>;
    findAllTamu(query: QueryBukuTamuDto): Promise<{
        data: ({
            recorder: {
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
            notes: string | null;
            purpose: string;
            guestName: string;
            destinationBlock: string | null;
            vehicleType: string | null;
            vehicleNumber: string | null;
            checkInTime: Date;
            checkOutTime: Date | null;
            recordedBy: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createTamu(dto: CreateBukuTamuDto, user: {
        id: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        purpose: string;
        guestName: string;
        destinationBlock: string | null;
        vehicleType: string | null;
        vehicleNumber: string | null;
        checkInTime: Date;
        checkOutTime: Date | null;
        recordedBy: string;
    }>;
    checkOutTamu(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        purpose: string;
        guestName: string;
        destinationBlock: string | null;
        vehicleType: string | null;
        vehicleNumber: string | null;
        checkInTime: Date;
        checkOutTime: Date | null;
        recordedBy: string;
    }>;
    findAllInsiden(query: QueryLaporanInsidenDto, user: {
        id: string;
        role: string;
    }): Promise<{
        data: ({
            processor: {
                profile: {
                    fullName: string | null;
                } | null;
                email: string;
                id: string;
            } | null;
            reporter: {
                profile: {
                    fullName: string | null;
                } | null;
                email: string;
                id: string;
            };
        } & {
            description: string;
            title: string;
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            category: string;
            location: string | null;
            adminNotes: string | null;
            processedBy: string | null;
            processedAt: Date | null;
            severity: string;
            incidentDate: Date;
            reportedBy: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createInsiden(dto: CreateLaporanInsidenDto, user: {
        id: string;
    }): Promise<{
        processor: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        } | null;
        reporter: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
    } & {
        description: string;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        location: string | null;
        adminNotes: string | null;
        processedBy: string | null;
        processedAt: Date | null;
        severity: string;
        incidentDate: Date;
        reportedBy: string;
    }>;
    updateInsidenStatus(id: string, dto: UpdateInsidenStatusDto, user: {
        id: string;
    }): Promise<{
        processor: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        } | null;
        reporter: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
    } & {
        description: string;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        location: string | null;
        adminNotes: string | null;
        processedBy: string | null;
        processedAt: Date | null;
        severity: string;
        incidentDate: Date;
        reportedBy: string;
    }>;
    cancelInsiden(id: string, user: {
        id: string;
        role: string;
    }): Promise<{
        description: string;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        location: string | null;
        adminNotes: string | null;
        processedBy: string | null;
        processedAt: Date | null;
        severity: string;
        incidentDate: Date;
        reportedBy: string;
    }>;
}
