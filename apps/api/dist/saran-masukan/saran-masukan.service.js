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
exports.SaranMasukanService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SaranMasukanService = class SaranMasukanService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page = 1, limit = 10, status, category } = query;
        const where = {};
        if (status)
            where.status = status;
        if (category)
            where.category = category;
        const [data, total] = await Promise.all([
            this.prisma.saranMasukan.findMany({
                where,
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    submitter: {
                        select: { id: true, email: true, profile: { select: { fullName: true } } },
                    },
                    responder: {
                        select: { id: true, email: true, profile: { select: { fullName: true } } },
                    },
                },
            }),
            this.prisma.saranMasukan.count({ where }),
        ]);
        const sanitized = data.map((s) => ({
            ...s,
            submitter: s.isAnonymous ? null : s.submitter,
            submittedBy: s.isAnonymous ? null : s.submittedBy,
        }));
        return {
            data: sanitized,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        };
    }
    async findMine(query, userId) {
        const { page = 1, limit = 10, status } = query;
        const where = { submittedBy: userId };
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.prisma.saranMasukan.findMany({
                where,
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.saranMasukan.count({ where }),
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
    async create(dto, userId) {
        return this.prisma.saranMasukan.create({
            data: {
                category: dto.category,
                subject: dto.subject,
                content: dto.content,
                isAnonymous: dto.isAnonymous ?? false,
                submittedBy: dto.isAnonymous ? null : userId,
            },
        });
    }
    async respond(id, dto, adminId) {
        const saran = await this.prisma.saranMasukan.findUnique({ where: { id } });
        if (!saran)
            throw new common_1.NotFoundException('Saran tidak ditemukan');
        return this.prisma.saranMasukan.update({
            where: { id },
            data: {
                status: dto.status,
                adminResponse: dto.adminResponse ?? saran.adminResponse,
                respondedBy: adminId,
                respondedAt: new Date(),
            },
        });
    }
    async getSummary() {
        const [baru, dibaca, ditanggapi] = await Promise.all([
            this.prisma.saranMasukan.count({ where: { status: 'BARU' } }),
            this.prisma.saranMasukan.count({ where: { status: 'DIBACA' } }),
            this.prisma.saranMasukan.count({ where: { status: 'DITANGGAPI' } }),
        ]);
        return { baru, dibaca, ditanggapi, total: baru + dibaca + ditanggapi };
    }
};
exports.SaranMasukanService = SaranMasukanService;
exports.SaranMasukanService = SaranMasukanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SaranMasukanService);
//# sourceMappingURL=saran-masukan.service.js.map