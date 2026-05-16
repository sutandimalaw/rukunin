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
exports.UmkmService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UmkmService = class UmkmService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    ownerSelect = {
        owner: {
            select: {
                id: true,
                email: true,
                profile: { select: { fullName: true } },
            },
        },
    };
    async findAllUsaha(query, currentUser) {
        const { page = 1, limit = 12, category, status, search } = query;
        const where = {};
        if (category)
            where.category = category;
        if (search)
            where.name = { contains: search, mode: 'insensitive' };
        if (currentUser.role === 'ADMIN') {
            if (status)
                where.status = status;
        }
        else {
            where.OR = [
                { status: 'ACTIVE', ...(where.isActive !== undefined ? { isActive: true } : {}) },
                { ownerId: currentUser.id },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.umkmUsaha.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    ...this.ownerSelect,
                    _count: { select: { products: true } },
                },
            }),
            this.prisma.umkmUsaha.count({ where }),
        ]);
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOneUsaha(id) {
        const usaha = await this.prisma.umkmUsaha.findUnique({
            where: { id },
            include: {
                ...this.ownerSelect,
                products: { orderBy: { createdAt: 'asc' } },
            },
        });
        if (!usaha)
            throw new common_1.NotFoundException('Usaha tidak ditemukan');
        return usaha;
    }
    async findMyUsaha(userId) {
        return this.prisma.umkmUsaha.findMany({
            where: { ownerId: userId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { products: true } },
                products: { orderBy: { createdAt: 'asc' } },
            },
        });
    }
    async createUsaha(dto, userId) {
        return this.prisma.umkmUsaha.create({
            data: {
                name: dto.name,
                description: dto.description,
                category: dto.category,
                address: dto.address ?? null,
                whatsapp: dto.whatsapp,
                status: 'PENDING',
                ownerId: userId,
            },
            include: this.ownerSelect,
        });
    }
    async updateUsaha(id, dto, currentUser) {
        const usaha = await this.prisma.umkmUsaha.findUnique({ where: { id } });
        if (!usaha)
            throw new common_1.NotFoundException('Usaha tidak ditemukan');
        if (currentUser.role !== 'ADMIN' && usaha.ownerId !== currentUser.id) {
            throw new common_1.ForbiddenException('Anda tidak punya akses ke usaha ini');
        }
        return this.prisma.umkmUsaha.update({
            where: { id },
            data: dto,
            include: this.ownerSelect,
        });
    }
    async updateUsahaStatus(id, dto) {
        const usaha = await this.prisma.umkmUsaha.findUnique({ where: { id } });
        if (!usaha)
            throw new common_1.NotFoundException('Usaha tidak ditemukan');
        return this.prisma.umkmUsaha.update({
            where: { id },
            data: {
                status: dto.status,
                adminNotes: dto.adminNotes ?? usaha.adminNotes,
            },
            include: this.ownerSelect,
        });
    }
    async deleteUsaha(id, currentUser) {
        const usaha = await this.prisma.umkmUsaha.findUnique({ where: { id } });
        if (!usaha)
            throw new common_1.NotFoundException('Usaha tidak ditemukan');
        if (currentUser.role !== 'ADMIN') {
            if (usaha.ownerId !== currentUser.id) {
                throw new common_1.ForbiddenException('Anda tidak punya akses');
            }
            if (usaha.status === 'ACTIVE') {
                throw new common_1.BadRequestException('Nonaktifkan usaha terlebih dahulu sebelum menghapus');
            }
        }
        return this.prisma.umkmUsaha.delete({ where: { id } });
    }
    async findProdukByUsaha(usahaId) {
        const usaha = await this.prisma.umkmUsaha.findUnique({ where: { id: usahaId } });
        if (!usaha)
            throw new common_1.NotFoundException('Usaha tidak ditemukan');
        return this.prisma.umkmProduk.findMany({
            where: { usahaId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async createProduk(usahaId, dto, currentUser) {
        const usaha = await this.prisma.umkmUsaha.findUnique({ where: { id: usahaId } });
        if (!usaha)
            throw new common_1.NotFoundException('Usaha tidak ditemukan');
        if (currentUser.role !== 'ADMIN' && usaha.ownerId !== currentUser.id) {
            throw new common_1.ForbiddenException('Hanya pemilik usaha yang bisa menambah produk');
        }
        return this.prisma.umkmProduk.create({
            data: {
                name: dto.name,
                description: dto.description ?? null,
                price: dto.price,
                type: dto.type,
                usahaId,
            },
        });
    }
    async updateProduk(produkId, dto, currentUser) {
        const produk = await this.prisma.umkmProduk.findUnique({
            where: { id: produkId },
            include: { usaha: true },
        });
        if (!produk)
            throw new common_1.NotFoundException('Produk tidak ditemukan');
        if (currentUser.role !== 'ADMIN' && produk.usaha.ownerId !== currentUser.id) {
            throw new common_1.ForbiddenException('Hanya pemilik usaha yang bisa mengubah produk');
        }
        return this.prisma.umkmProduk.update({ where: { id: produkId }, data: dto });
    }
    async deleteProduk(produkId, currentUser) {
        const produk = await this.prisma.umkmProduk.findUnique({
            where: { id: produkId },
            include: { usaha: true },
        });
        if (!produk)
            throw new common_1.NotFoundException('Produk tidak ditemukan');
        if (currentUser.role !== 'ADMIN' && produk.usaha.ownerId !== currentUser.id) {
            throw new common_1.ForbiddenException('Hanya pemilik usaha yang bisa menghapus produk');
        }
        return this.prisma.umkmProduk.delete({ where: { id: produkId } });
    }
};
exports.UmkmService = UmkmService;
exports.UmkmService = UmkmService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UmkmService);
//# sourceMappingURL=umkm.service.js.map