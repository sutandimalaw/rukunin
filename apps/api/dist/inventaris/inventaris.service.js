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
exports.InventarisService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InventarisService = class InventarisService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    borrowerSelect = {
        borrower: {
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
        inventaris: {
            select: { id: true, name: true, category: true },
        },
    };
    async findAllInventaris(query) {
        const { page = 1, limit = 20, category, search } = query;
        const where = {};
        if (category)
            where.category = category;
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        const [data, total] = await Promise.all([
            this.prisma.inventaris.findMany({
                where,
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.inventaris.count({ where }),
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
    async findOneInventaris(id) {
        const item = await this.prisma.inventaris.findUnique({
            where: { id },
            include: {
                peminjaman: {
                    where: { status: { in: ['DISETUJUI', 'DIPINJAM'] } },
                    include: this.borrowerSelect,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!item)
            throw new common_1.NotFoundException('Inventaris tidak ditemukan');
        return item;
    }
    async createInventaris(dto, userId) {
        return this.prisma.inventaris.create({
            data: {
                name: dto.name,
                category: dto.category,
                description: dto.description ?? null,
                quantity: dto.quantity ?? 1,
                condition: dto.condition ?? 'BAIK',
                createdBy: userId,
            },
        });
    }
    async updateInventaris(id, dto) {
        const item = await this.prisma.inventaris.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Inventaris tidak ditemukan');
        return this.prisma.inventaris.update({
            where: { id },
            data: dto,
        });
    }
    async deleteInventaris(id) {
        const item = await this.prisma.inventaris.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Inventaris tidak ditemukan');
        const activeBorrow = await this.prisma.peminjamanInventaris.count({
            where: {
                inventarisId: id,
                status: { in: ['DISETUJUI', 'DIPINJAM'] },
            },
        });
        if (activeBorrow > 0) {
            throw new common_1.BadRequestException('Tidak bisa menghapus, masih ada peminjaman aktif');
        }
        return this.prisma.inventaris.delete({ where: { id } });
    }
    async findAllPeminjaman(query, currentUser) {
        const { page = 1, limit = 10, status } = query;
        const where = {};
        if (status)
            where.status = status;
        if (currentUser.role !== 'ADMIN') {
            where.borrowerId = currentUser.id;
        }
        const [data, total] = await Promise.all([
            this.prisma.peminjamanInventaris.findMany({
                where,
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                include: this.borrowerSelect,
            }),
            this.prisma.peminjamanInventaris.count({ where }),
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
    async findOnePeminjaman(id, currentUser) {
        const peminjaman = await this.prisma.peminjamanInventaris.findUnique({
            where: { id },
            include: this.borrowerSelect,
        });
        if (!peminjaman)
            throw new common_1.NotFoundException('Peminjaman tidak ditemukan');
        if (currentUser.role !== 'ADMIN' &&
            peminjaman.borrowerId !== currentUser.id) {
            throw new common_1.ForbiddenException('Anda tidak punya akses');
        }
        return peminjaman;
    }
    async createPeminjaman(dto, userId) {
        const inventaris = await this.prisma.inventaris.findUnique({
            where: { id: dto.inventarisId },
        });
        if (!inventaris)
            throw new common_1.NotFoundException('Inventaris tidak ditemukan');
        if (!inventaris.isAvailable) {
            throw new common_1.BadRequestException('Inventaris sedang tidak tersedia');
        }
        const existingRequest = await this.prisma.peminjamanInventaris.findFirst({
            where: {
                inventarisId: dto.inventarisId,
                borrowerId: userId,
                status: { in: ['PENDING', 'DISETUJUI', 'DIPINJAM'] },
            },
        });
        if (existingRequest) {
            throw new common_1.BadRequestException(`Anda sudah memiliki peminjaman aktif untuk barang ini (status: ${existingRequest.status})`);
        }
        const borrowed = await this.prisma.peminjamanInventaris.aggregate({
            where: {
                inventarisId: dto.inventarisId,
                status: { in: ['DISETUJUI', 'DIPINJAM'] },
            },
            _sum: { quantity: true },
        });
        const available = inventaris.quantity - (borrowed._sum.quantity ?? 0);
        if (dto.quantity > available) {
            throw new common_1.BadRequestException(`Stok tersedia hanya ${available} unit`);
        }
        const borrowDate = new Date(dto.borrowDate);
        const returnDate = new Date(dto.returnDate);
        if (returnDate <= borrowDate) {
            throw new common_1.BadRequestException('Tanggal kembali harus setelah tanggal pinjam');
        }
        return this.prisma.peminjamanInventaris.create({
            data: {
                inventarisId: dto.inventarisId,
                borrowerId: userId,
                quantity: dto.quantity,
                borrowDate,
                returnDate,
                purpose: dto.purpose,
                status: 'PENDING',
            },
            include: this.borrowerSelect,
        });
    }
    async updatePeminjamanStatus(id, dto, adminId) {
        const peminjaman = await this.prisma.peminjamanInventaris.findUnique({
            where: { id },
        });
        if (!peminjaman)
            throw new common_1.NotFoundException('Peminjaman tidak ditemukan');
        const validTransitions = {
            PENDING: ['DISETUJUI', 'DITOLAK'],
            DISETUJUI: ['DIPINJAM', 'DITOLAK'],
            DIPINJAM: ['DIKEMBALIKAN'],
        };
        const allowed = validTransitions[peminjaman.status] ?? [];
        if (!allowed.includes(dto.status)) {
            throw new common_1.BadRequestException(`Tidak bisa mengubah status dari ${peminjaman.status} ke ${dto.status}`);
        }
        return this.prisma.peminjamanInventaris.update({
            where: { id },
            data: {
                status: dto.status,
                adminNotes: dto.adminNotes ?? peminjaman.adminNotes,
                processedBy: adminId,
                processedAt: new Date(),
                actualReturn: dto.status === 'DIKEMBALIKAN' ? new Date() : undefined,
            },
            include: this.borrowerSelect,
        });
    }
    async cancelPeminjaman(id, currentUser) {
        const peminjaman = await this.prisma.peminjamanInventaris.findUnique({
            where: { id },
        });
        if (!peminjaman)
            throw new common_1.NotFoundException('Peminjaman tidak ditemukan');
        if (currentUser.role !== 'ADMIN' &&
            peminjaman.borrowerId !== currentUser.id) {
            throw new common_1.ForbiddenException('Anda tidak punya akses');
        }
        if (peminjaman.status !== 'PENDING') {
            throw new common_1.BadRequestException('Hanya peminjaman berstatus PENDING yang bisa dibatalkan');
        }
        return this.prisma.peminjamanInventaris.delete({ where: { id } });
    }
};
exports.InventarisService = InventarisService;
exports.InventarisService = InventarisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventarisService);
//# sourceMappingURL=inventaris.service.js.map