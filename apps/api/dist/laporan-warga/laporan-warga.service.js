"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaporanWargaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const PRIORITAS_ORDER = { PENTING: 0, NORMAL: 1, RENDAH: 2 };
const STATUS_ORDER = { MENUNGGU: 0, DIPROSES: 1, SELESAI: 2 };
let LaporanWargaService = class LaporanWargaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateNomorLaporan() {
        const count = await this.prisma.laporanWarga.count();
        return `RPT-${String(count + 1).padStart(3, '0')}`;
    }
    buildWhere(query) {
        const where = {};
        if (query.status)
            where.status = query.status;
        if (query.kategori)
            where.kategori = query.kategori;
        if (query.prioritas)
            where.prioritas = query.prioritas;
        if (query.startDate || query.endDate) {
            where.createdAt = {};
            if (query.startDate)
                where.createdAt.gte = new Date(query.startDate);
            if (query.endDate)
                where.createdAt.lte = new Date(query.endDate);
        }
        if (query.search) {
            where.OR = [
                { judul: { contains: query.search, mode: 'insensitive' } },
                { deskripsi: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        return where;
    }
    buildOrderBy(sort) {
        switch (sort) {
            case 'TERLAMA':
                return { createdAt: 'asc' };
            case 'STATUS':
                return { status: 'asc' };
            case 'PRIORITAS':
                return { prioritas: 'asc' };
            default:
                return { createdAt: 'desc' };
        }
    }
    async findAll(query) {
        const { page = 1, limit = 10, sort = 'TERBARU' } = query;
        const where = this.buildWhere(query);
        const orderBy = this.buildOrderBy(sort);
        const [data, total] = await Promise.all([
            this.prisma.laporanWarga.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy,
                include: {
                    submitter: { select: { profile: { select: { fullName: true } } } },
                    _count: { select: { komentar: true } },
                },
            }),
            this.prisma.laporanWarga.count({ where }),
        ]);
        return {
            data: data.map((l) => ({
                ...l,
                submitterName: l.submitter?.profile?.fullName ?? l.namaPerlapor ?? 'Anonim',
                komentarCount: l._count.komentar,
                submitter: undefined,
                _count: undefined,
            })),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findMine(query, userId) {
        const { page = 1, limit = 10, sort = 'TERBARU' } = query;
        const where = {
            ...this.buildWhere(query),
            submittedBy: userId,
        };
        const orderBy = this.buildOrderBy(sort);
        const [data, total] = await Promise.all([
            this.prisma.laporanWarga.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy,
                include: { _count: { select: { komentar: true } } },
            }),
            this.prisma.laporanWarga.count({ where }),
        ]);
        return {
            data: data.map((l) => ({
                ...l,
                komentarCount: l._count.komentar,
                _count: undefined,
            })),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async getSummary() {
        const [total, menunggu, diproses, selesai] = await Promise.all([
            this.prisma.laporanWarga.count(),
            this.prisma.laporanWarga.count({ where: { status: 'MENUNGGU' } }),
            this.prisma.laporanWarga.count({ where: { status: 'DIPROSES' } }),
            this.prisma.laporanWarga.count({ where: { status: 'SELESAI' } }),
        ]);
        return { total, menunggu, diproses, selesai };
    }
    async findOne(id, userId, role) {
        const laporan = await this.prisma.laporanWarga.findUnique({
            where: { id },
            include: {
                submitter: { select: { profile: { select: { fullName: true } } } },
                komentar: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        user: { select: { profile: { select: { fullName: true } }, role: true } },
                    },
                },
            },
        });
        if (!laporan)
            throw new common_1.NotFoundException('Laporan tidak ditemukan');
        if (role === 'WARGA' && laporan.submittedBy !== userId) {
            throw new common_1.ForbiddenException('Anda tidak berhak mengakses laporan ini');
        }
        return {
            ...laporan,
            submitterName: laporan.submitter?.profile?.fullName ?? laporan.namaPerlapor ?? 'Anonim',
            komentar: laporan.komentar.map((k) => ({
                ...k,
                userName: k.user.profile?.fullName ?? 'Admin',
                userRole: k.user.role,
                user: undefined,
            })),
            submitter: undefined,
        };
    }
    async create(dto, userId) {
        const nomorLaporan = await this.generateNomorLaporan();
        return this.prisma.laporanWarga.create({
            data: {
                nomorLaporan,
                judul: dto.judul,
                kategori: dto.kategori,
                prioritas: dto.prioritas ?? 'NORMAL',
                deskripsi: dto.deskripsi,
                lokasi: dto.lokasi,
                status: 'MENUNGGU',
                namaPerlapor: dto.namaPerlapor,
                rtPerlapor: dto.rtPerlapor,
                fotoUrls: dto.fotoUrls ?? [],
                submittedBy: userId,
            },
        });
    }
    async updateStatus(id, dto, adminId) {
        const laporan = await this.prisma.laporanWarga.findUnique({ where: { id } });
        if (!laporan)
            throw new common_1.NotFoundException('Laporan tidak ditemukan');
        const statusLabel = {
            MENUNGGU: 'Menunggu',
            DIPROSES: 'Diproses',
            SELESAI: 'Selesai',
        };
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.laporanWarga.update({
                where: { id },
                data: { status: dto.status },
            });
            await tx.laporanKomentar.create({
                data: {
                    laporanId: id,
                    userId: adminId,
                    type: 'STATUS_CHANGE',
                    isi: `Status diubah menjadi ${statusLabel[dto.status] ?? dto.status}`,
                    statusBaru: dto.status,
                },
            });
            return updated;
        });
    }
    async addKomentar(id, dto, userId) {
        const laporan = await this.prisma.laporanWarga.findUnique({ where: { id } });
        if (!laporan)
            throw new common_1.NotFoundException('Laporan tidak ditemukan');
        return this.prisma.laporanKomentar.create({
            data: {
                laporanId: id,
                userId,
                type: 'KOMENTAR',
                isi: dto.isi,
            },
        });
    }
};
exports.LaporanWargaService = LaporanWargaService;
exports.LaporanWargaService = LaporanWargaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LaporanWargaService);
//# sourceMappingURL=laporan-warga.service.js.map