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
exports.LayananWargaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LayananWargaService = class LayananWargaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    requesterSelect = {
        requester: {
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
    async findAll(query, currentUser) {
        const { page = 1, limit = 10, type, status } = query;
        const where = {};
        if (type)
            where.type = type;
        if (status)
            where.status = status;
        if (currentUser.role !== 'ADMIN') {
            where.requestedBy = currentUser.id;
        }
        const [data, total] = await Promise.all([
            this.prisma.layananWarga.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: this.requesterSelect,
            }),
            this.prisma.layananWarga.count({ where }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, currentUser) {
        const layanan = await this.prisma.layananWarga.findUnique({
            where: { id },
            include: this.requesterSelect,
        });
        if (!layanan) {
            throw new common_1.NotFoundException('Layanan tidak ditemukan');
        }
        if (currentUser.role !== 'ADMIN' &&
            layanan.requestedBy !== currentUser.id) {
            throw new common_1.ForbiddenException('Anda tidak punya akses ke layanan ini');
        }
        return layanan;
    }
    async create(dto, userId) {
        return this.prisma.layananWarga.create({
            data: {
                type: dto.type,
                subject: dto.subject,
                description: dto.description,
                purpose: dto.purpose ?? null,
                location: dto.location ?? null,
                status: 'PENDING',
                requestedBy: userId,
            },
            include: this.requesterSelect,
        });
    }
    async updateStatus(id, dto, adminId) {
        const layanan = await this.prisma.layananWarga.findUnique({ where: { id } });
        if (!layanan)
            throw new common_1.NotFoundException('Layanan tidak ditemukan');
        if (layanan.status === 'SELESAI' || layanan.status === 'DITOLAK') {
            throw new common_1.BadRequestException(`Layanan sudah ${layanan.status}, tidak bisa diubah lagi`);
        }
        return this.prisma.layananWarga.update({
            where: { id },
            data: {
                status: dto.status,
                adminNotes: dto.adminNotes ?? layanan.adminNotes,
                processedBy: adminId,
                processedAt: new Date(),
            },
            include: this.requesterSelect,
        });
    }
    async remove(id, currentUser) {
        const layanan = await this.prisma.layananWarga.findUnique({ where: { id } });
        if (!layanan)
            throw new common_1.NotFoundException('Layanan tidak ditemukan');
        if (currentUser.role !== 'ADMIN') {
            if (layanan.requestedBy !== currentUser.id) {
                throw new common_1.ForbiddenException('Anda tidak punya akses');
            }
            if (layanan.status !== 'PENDING') {
                throw new common_1.BadRequestException('Hanya layanan dengan status PENDING yang bisa dibatalkan');
            }
        }
        return this.prisma.layananWarga.delete({ where: { id } });
    }
};
exports.LayananWargaService = LayananWargaService;
exports.LayananWargaService = LayananWargaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LayananWargaService);
//# sourceMappingURL=layanan-warga.service.js.map