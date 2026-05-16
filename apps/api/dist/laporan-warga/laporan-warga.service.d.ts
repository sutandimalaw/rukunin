import { PrismaService } from '../prisma/prisma.service';
import { CreateLaporanDto } from './dto/create-laporan.dto';
import { QueryLaporanDto } from './dto/query-laporan.dto';
import { UpdateStatusLaporanDto } from './dto/update-status-laporan.dto';
import { CreateKomentarDto } from './dto/create-komentar.dto';
export declare class LaporanWargaService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateNomorLaporan;
    private buildWhere;
    private buildOrderBy;
    findAll(query: QueryLaporanDto): Promise<{
        data: {
            submitterName: string;
            komentarCount: number;
            submitter: undefined;
            _count: undefined;
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            submittedBy: string | null;
            judul: string;
            kategori: string;
            prioritas: string;
            deskripsi: string;
            lokasi: string | null;
            namaPerlapor: string | null;
            rtPerlapor: string | null;
            fotoUrls: string[];
            nomorLaporan: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findMine(query: QueryLaporanDto, userId: string): Promise<{
        data: {
            komentarCount: number;
            _count: undefined;
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            submittedBy: string | null;
            judul: string;
            kategori: string;
            prioritas: string;
            deskripsi: string;
            lokasi: string | null;
            namaPerlapor: string | null;
            rtPerlapor: string | null;
            fotoUrls: string[];
            nomorLaporan: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getSummary(): Promise<{
        total: number;
        menunggu: number;
        diproses: number;
        selesai: number;
    }>;
    findOne(id: string, userId: string, role: string): Promise<{
        submitterName: string;
        komentar: {
            userName: string;
            userRole: import("@prisma/client").$Enums.UserRole;
            user: undefined;
            type: string;
            id: string;
            createdAt: Date;
            userId: string;
            isi: string;
            laporanId: string;
            statusBaru: string | null;
        }[];
        submitter: undefined;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        submittedBy: string | null;
        judul: string;
        kategori: string;
        prioritas: string;
        deskripsi: string;
        lokasi: string | null;
        namaPerlapor: string | null;
        rtPerlapor: string | null;
        fotoUrls: string[];
        nomorLaporan: string;
    }>;
    create(dto: CreateLaporanDto, userId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        submittedBy: string | null;
        judul: string;
        kategori: string;
        prioritas: string;
        deskripsi: string;
        lokasi: string | null;
        namaPerlapor: string | null;
        rtPerlapor: string | null;
        fotoUrls: string[];
        nomorLaporan: string;
    }>;
    updateStatus(id: string, dto: UpdateStatusLaporanDto, adminId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        submittedBy: string | null;
        judul: string;
        kategori: string;
        prioritas: string;
        deskripsi: string;
        lokasi: string | null;
        namaPerlapor: string | null;
        rtPerlapor: string | null;
        fotoUrls: string[];
        nomorLaporan: string;
    }>;
    addKomentar(id: string, dto: CreateKomentarDto, userId: string): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        userId: string;
        isi: string;
        laporanId: string;
        statusBaru: string | null;
    }>;
}
