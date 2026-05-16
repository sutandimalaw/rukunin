import { LaporanWargaService } from './laporan-warga.service';
import { CreateLaporanDto } from './dto/create-laporan.dto';
import { QueryLaporanDto } from './dto/query-laporan.dto';
import { UpdateStatusLaporanDto } from './dto/update-status-laporan.dto';
import { CreateKomentarDto } from './dto/create-komentar.dto';
export declare class LaporanWargaController {
    private readonly service;
    constructor(service: LaporanWargaService);
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
    getSummary(): Promise<{
        total: number;
        menunggu: number;
        diproses: number;
        selesai: number;
    }>;
    findMine(query: QueryLaporanDto, user: {
        id: string;
    }): Promise<{
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
    create(dto: CreateLaporanDto, user: {
        id: string;
    }): Promise<{
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
    findOne(id: string, user: {
        id: string;
        role: string;
    }): Promise<{
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
    updateStatus(id: string, dto: UpdateStatusLaporanDto, user: {
        id: string;
    }): Promise<{
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
    addKomentar(id: string, dto: CreateKomentarDto, user: {
        id: string;
    }): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        userId: string;
        isi: string;
        laporanId: string;
        statusBaru: string | null;
    }>;
}
