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
exports.ProfilProfesiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProfilProfesiService = class ProfilProfesiService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    userSelect = {
        user: {
            select: {
                id: true,
                email: true,
                profile: { select: { fullName: true, avatarUrl: true } },
            },
        },
    };
    async findAll(query) {
        const { page = 1, limit = 12, category, search } = query;
        const where = {
            isPublished: true,
            ...(category ? { category } : {}),
            ...(search
                ? {
                    OR: [
                        { jobTitle: { contains: search, mode: 'insensitive' } },
                        { skills: { contains: search, mode: 'insensitive' } },
                        {
                            user: {
                                profile: { fullName: { contains: search, mode: 'insensitive' } },
                            },
                        },
                    ],
                }
                : {}),
        };
        const [data, total] = await Promise.all([
            this.prisma.profilProfesi.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { updatedAt: 'desc' },
                include: this.userSelect,
            }),
            this.prisma.profilProfesi.count({ where }),
        ]);
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findAllAdmin(query) {
        const { page = 1, limit = 12, category, search } = query;
        const where = {
            ...(category ? { category } : {}),
            ...(search
                ? {
                    OR: [
                        { jobTitle: { contains: search, mode: 'insensitive' } },
                        { skills: { contains: search, mode: 'insensitive' } },
                        {
                            user: {
                                profile: { fullName: { contains: search, mode: 'insensitive' } },
                            },
                        },
                    ],
                }
                : {}),
        };
        const [data, total] = await Promise.all([
            this.prisma.profilProfesi.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { updatedAt: 'desc' },
                include: this.userSelect,
            }),
            this.prisma.profilProfesi.count({ where }),
        ]);
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const item = await this.prisma.profilProfesi.findUnique({
            where: { id },
            include: this.userSelect,
        });
        if (!item)
            throw new common_1.NotFoundException('Profil profesi tidak ditemukan');
        return item;
    }
    async findMine(userId) {
        return this.prisma.profilProfesi.findUnique({
            where: { userId },
            include: this.userSelect,
        });
    }
    async upsert(userId, dto) {
        const { category, jobTitle, skills, bio, whatsapp, isPublished } = dto;
        return this.prisma.profilProfesi.upsert({
            where: { userId },
            create: {
                userId,
                category: category,
                jobTitle,
                skills,
                bio,
                whatsapp,
                isPublished: isPublished ?? true,
            },
            update: {
                category: category,
                jobTitle,
                skills,
                bio,
                whatsapp,
                ...(isPublished !== undefined ? { isPublished } : {}),
            },
            include: this.userSelect,
        });
    }
    async remove(userId) {
        const existing = await this.prisma.profilProfesi.findUnique({
            where: { userId },
        });
        if (!existing)
            throw new common_1.NotFoundException('Profil profesi tidak ditemukan');
        await this.prisma.profilProfesi.delete({ where: { userId } });
        return { message: 'Profil profesi berhasil dihapus' };
    }
};
exports.ProfilProfesiService = ProfilProfesiService;
exports.ProfilProfesiService = ProfilProfesiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfilProfesiService);
//# sourceMappingURL=profil-profesi.service.js.map