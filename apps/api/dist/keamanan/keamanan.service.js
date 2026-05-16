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
exports.KeamananService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let KeamananService = class KeamananService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    reporterSelect = {
        reporter: {
            select: {
                id: true,
                email: true,
                profile: { select: { fullName: true } },
            },
        },
        processor: {
            select: {
                id: true,
                email: true,
                profile: { select: { fullName: true } },
            },
        },
    };
    async getSummary() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const [tamuHariIni, insidenAktif, panicButton, petugasBertugas] = await Promise.all([
            this.prisma.bukuTamu.count({
                where: {
                    checkInTime: { gte: today, lt: tomorrow },
                },
            }),
            this.prisma.laporanInsiden.count({
                where: { status: { in: ['DILAPORKAN', 'DITINDAK'] } },
            }),
            this.prisma.laporanInsiden.count({
                where: {
                    severity: 'DARURAT',
                    status: { in: ['DILAPORKAN', 'DITINDAK'] },
                },
            }),
            this.prisma.petugasKeamanan.count({
                where: { isOnDuty: true, isActive: true },
            }),
        ]);
        return { tamuHariIni, insidenAktif, panicButton, petugasBertugas };
    }
    async findAllPetugas() {
        return this.prisma.petugasKeamanan.findMany({
            where: { isActive: true },
            orderBy: [
                { shift: 'asc' },
                { fullName: 'asc' },
            ],
        });
    }
    async createPetugas(dto, userId) {
        return this.prisma.petugasKeamanan.create({
            data: {
                fullName: dto.fullName,
                shift: dto.shift,
                shiftTime: dto.shiftTime,
                whatsapp: dto.whatsapp ?? null,
                isOnDuty: dto.isOnDuty ?? false,
                createdBy: userId,
            },
        });
    }
    async updatePetugas(id, dto) {
        const petugas = await this.prisma.petugasKeamanan.findUnique({
            where: { id },
        });
        if (!petugas)
            throw new common_1.NotFoundException('Petugas tidak ditemukan');
        return this.prisma.petugasKeamanan.update({
            where: { id },
            data: dto,
        });
    }
    async deletePetugas(id) {
        const petugas = await this.prisma.petugasKeamanan.findUnique({
            where: { id },
        });
        if (!petugas)
            throw new common_1.NotFoundException('Petugas tidak ditemukan');
        return this.prisma.petugasKeamanan.delete({ where: { id } });
    }
    async findAllTamu(query) {
        const { page = 1, limit = 20, date } = query;
        const where = {};
        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setDate(end.getDate() + 1);
            where.checkInTime = { gte: start, lt: end };
        }
        const [data, total] = await Promise.all([
            this.prisma.bukuTamu.findMany({
                where,
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                orderBy: { checkInTime: 'desc' },
                include: {
                    recorder: {
                        select: {
                            id: true,
                            email: true,
                            profile: { select: { fullName: true } },
                        },
                    },
                },
            }),
            this.prisma.bukuTamu.count({ where }),
        ]);
        return {
            data,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        };
    }
    async createTamu(dto, userId) {
        return this.prisma.bukuTamu.create({
            data: {
                guestName: dto.guestName,
                purpose: dto.purpose,
                destinationBlock: dto.destinationBlock ?? null,
                vehicleType: dto.vehicleType ?? null,
                vehicleNumber: dto.vehicleNumber ?? null,
                notes: dto.notes ?? null,
                recordedBy: userId,
            },
        });
    }
    async checkOutTamu(id) {
        const tamu = await this.prisma.bukuTamu.findUnique({ where: { id } });
        if (!tamu)
            throw new common_1.NotFoundException('Data tamu tidak ditemukan');
        if (tamu.checkOutTime) {
            throw new common_1.BadRequestException('Tamu sudah tercatat keluar');
        }
        return this.prisma.bukuTamu.update({
            where: { id },
            data: { checkOutTime: new Date() },
        });
    }
    async findAllInsiden(query, currentUser) {
        const { page = 1, limit = 10, status, category, severity } = query;
        const where = {};
        if (status)
            where.status = status;
        if (category)
            where.category = category;
        if (severity)
            where.severity = severity;
        if (currentUser.role !== 'ADMIN') {
            where.reportedBy = currentUser.id;
        }
        const [data, total] = await Promise.all([
            this.prisma.laporanInsiden.findMany({
                where,
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                include: this.reporterSelect,
            }),
            this.prisma.laporanInsiden.count({ where }),
        ]);
        return {
            data,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        };
    }
    async createInsiden(dto, userId) {
        return this.prisma.laporanInsiden.create({
            data: {
                category: dto.category,
                title: dto.title,
                description: dto.description,
                location: dto.location ?? null,
                severity: dto.severity ?? 'SEDANG',
                incidentDate: new Date(dto.incidentDate),
                reportedBy: userId,
            },
            include: this.reporterSelect,
        });
    }
    async updateInsidenStatus(id, dto, adminId) {
        const insiden = await this.prisma.laporanInsiden.findUnique({
            where: { id },
        });
        if (!insiden)
            throw new common_1.NotFoundException('Laporan tidak ditemukan');
        if (insiden.status === 'SELESAI' || insiden.status === 'DITUTUP') {
            throw new common_1.BadRequestException(`Laporan sudah ${insiden.status}, tidak bisa diubah lagi`);
        }
        return this.prisma.laporanInsiden.update({
            where: { id },
            data: {
                status: dto.status,
                adminNotes: dto.adminNotes ?? insiden.adminNotes,
                processedBy: adminId,
                processedAt: new Date(),
            },
            include: this.reporterSelect,
        });
    }
    async cancelInsiden(id, currentUser) {
        const insiden = await this.prisma.laporanInsiden.findUnique({
            where: { id },
        });
        if (!insiden)
            throw new common_1.NotFoundException('Laporan tidak ditemukan');
        if (currentUser.role !== 'ADMIN' &&
            insiden.reportedBy !== currentUser.id) {
            throw new common_1.ForbiddenException('Anda tidak punya akses');
        }
        if (insiden.status !== 'DILAPORKAN') {
            throw new common_1.BadRequestException('Hanya laporan berstatus DILAPORKAN yang bisa dibatalkan');
        }
        return this.prisma.laporanInsiden.delete({ where: { id } });
    }
};
exports.KeamananService = KeamananService;
exports.KeamananService = KeamananService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KeamananService);
//# sourceMappingURL=keamanan.service.js.map