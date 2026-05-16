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
exports.PenyediaJasaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PenyediaJasaService = class PenyediaJasaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    submitterSelect = {
        submitter: {
            select: {
                id: true,
                email: true,
                profile: { select: { fullName: true } },
            },
        },
    };
    reviewerSelect = {
        reviewer: {
            select: {
                id: true,
                email: true,
                profile: { select: { fullName: true } },
            },
        },
    };
    async findAll(query, currentUser) {
        const { page = 1, limit = 12, category, status, search } = query;
        const where = {};
        if (category)
            where.category = category;
        if (search)
            where.personName = { contains: search, mode: 'insensitive' };
        if (currentUser.role === 'ADMIN') {
            if (status)
                where.status = status;
        }
        else {
            where.OR = [
                { status: 'ACTIVE' },
                { submittedBy: currentUser.id },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.penyediaJasa.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: this.submitterSelect,
            }),
            this.prisma.penyediaJasa.count({ where }),
        ]);
        const withAggregate = await this.attachAggregate(data);
        return {
            data: withAggregate,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findMy(userId) {
        const data = await this.prisma.penyediaJasa.findMany({
            where: { submittedBy: userId },
            orderBy: { createdAt: 'desc' },
            include: this.submitterSelect,
        });
        return this.attachAggregate(data);
    }
    async findOne(id, currentUser) {
        const item = await this.prisma.penyediaJasa.findUnique({
            where: { id },
            include: {
                ...this.submitterSelect,
                reviews: {
                    orderBy: { createdAt: 'desc' },
                    include: this.reviewerSelect,
                },
            },
        });
        if (!item)
            throw new common_1.NotFoundException('Penyedia jasa tidak ditemukan');
        if (currentUser.role !== 'ADMIN' &&
            item.status !== 'ACTIVE' &&
            item.submittedBy !== currentUser.id) {
            throw new common_1.ForbiddenException('Anda tidak punya akses ke entry ini');
        }
        const ratingCount = item.reviews.length;
        const averageRating = ratingCount > 0
            ? item.reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
            : null;
        return { ...item, averageRating, reviewCount: ratingCount };
    }
    async create(dto, userId) {
        return this.prisma.penyediaJasa.create({
            data: {
                personName: dto.personName,
                category: dto.category,
                whatsapp: dto.whatsapp ?? null,
                description: dto.description ?? null,
                area: dto.area ?? null,
                status: 'PENDING',
                submittedBy: userId,
            },
            include: this.submitterSelect,
        });
    }
    async update(id, dto, currentUser) {
        const item = await this.prisma.penyediaJasa.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Penyedia jasa tidak ditemukan');
        if (currentUser.role !== 'ADMIN' && item.submittedBy !== currentUser.id) {
            throw new common_1.ForbiddenException('Anda tidak punya akses ke entry ini');
        }
        return this.prisma.penyediaJasa.update({
            where: { id },
            data: dto,
            include: this.submitterSelect,
        });
    }
    async updateStatus(id, dto, currentUser) {
        if (currentUser.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Hanya admin yang bisa ubah status');
        }
        const item = await this.prisma.penyediaJasa.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Penyedia jasa tidak ditemukan');
        return this.prisma.penyediaJasa.update({
            where: { id },
            data: {
                status: dto.status,
                adminNotes: dto.adminNotes ?? item.adminNotes,
            },
            include: this.submitterSelect,
        });
    }
    async remove(id, currentUser) {
        const item = await this.prisma.penyediaJasa.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Penyedia jasa tidak ditemukan');
        if (currentUser.role !== 'ADMIN' && item.submittedBy !== currentUser.id) {
            throw new common_1.ForbiddenException('Anda tidak punya akses');
        }
        return this.prisma.penyediaJasa.delete({ where: { id } });
    }
    async listReviews(penyediaJasaId) {
        const exists = await this.prisma.penyediaJasa.findUnique({
            where: { id: penyediaJasaId },
            select: { id: true },
        });
        if (!exists)
            throw new common_1.NotFoundException('Penyedia jasa tidak ditemukan');
        return this.prisma.penyediaJasaReview.findMany({
            where: { penyediaJasaId },
            orderBy: { createdAt: 'desc' },
            include: this.reviewerSelect,
        });
    }
    async upsertReview(penyediaJasaId, dto, userId) {
        const target = await this.prisma.penyediaJasa.findUnique({
            where: { id: penyediaJasaId },
        });
        if (!target)
            throw new common_1.NotFoundException('Penyedia jasa tidak ditemukan');
        if (target.status !== 'ACTIVE') {
            throw new common_1.ForbiddenException('Hanya penyedia jasa yang sudah aktif yang bisa direview');
        }
        return this.prisma.penyediaJasaReview.upsert({
            where: {
                penyediaJasaId_reviewerId: {
                    penyediaJasaId,
                    reviewerId: userId,
                },
            },
            create: {
                penyediaJasaId,
                reviewerId: userId,
                rating: dto.rating,
                comment: dto.comment ?? null,
            },
            update: {
                rating: dto.rating,
                comment: dto.comment ?? null,
            },
            include: this.reviewerSelect,
        });
    }
    async deleteMyReview(penyediaJasaId, userId) {
        const review = await this.prisma.penyediaJasaReview.findUnique({
            where: {
                penyediaJasaId_reviewerId: {
                    penyediaJasaId,
                    reviewerId: userId,
                },
            },
        });
        if (!review)
            throw new common_1.NotFoundException('Review tidak ditemukan');
        return this.prisma.penyediaJasaReview.delete({ where: { id: review.id } });
    }
    async adminDeleteReview(reviewId, currentUser) {
        if (currentUser.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Hanya admin yang bisa moderasi review');
        }
        const review = await this.prisma.penyediaJasaReview.findUnique({
            where: { id: reviewId },
        });
        if (!review)
            throw new common_1.NotFoundException('Review tidak ditemukan');
        return this.prisma.penyediaJasaReview.delete({ where: { id: reviewId } });
    }
    async attachAggregate(items) {
        if (items.length === 0)
            return [];
        const aggregates = await this.prisma.penyediaJasaReview.groupBy({
            by: ['penyediaJasaId'],
            where: { penyediaJasaId: { in: items.map((i) => i.id) } },
            _avg: { rating: true },
            _count: { rating: true },
        });
        const map = new Map(aggregates.map((a) => [
            a.penyediaJasaId,
            { averageRating: a._avg.rating, reviewCount: a._count.rating },
        ]));
        return items.map((i) => ({
            ...i,
            averageRating: map.get(i.id)?.averageRating ?? null,
            reviewCount: map.get(i.id)?.reviewCount ?? 0,
        }));
    }
};
exports.PenyediaJasaService = PenyediaJasaService;
exports.PenyediaJasaService = PenyediaJasaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PenyediaJasaService);
//# sourceMappingURL=penyedia-jasa.service.js.map