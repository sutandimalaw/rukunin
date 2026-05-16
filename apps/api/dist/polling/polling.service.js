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
exports.PollingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PollingService = class PollingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    pollingInclude(userId) {
        return {
            options: { orderBy: { sortOrder: 'asc' } },
            _count: { select: { votes: true } },
            votes: {
                where: { userId },
                select: { optionId: true },
            },
        };
    }
    async findAll(query, userId) {
        const { page = 1, limit = 10, status } = query;
        const where = {};
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.prisma.polling.findMany({
                where,
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    options: {
                        include: { _count: { select: { votes: true } } },
                        orderBy: { sortOrder: 'asc' },
                    },
                    _count: { select: { votes: true } },
                    votes: { where: { userId }, select: { optionId: true } },
                },
            }),
            this.prisma.polling.count({ where }),
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
    async findOne(id, userId) {
        const polling = await this.prisma.polling.findUnique({
            where: { id },
            include: {
                options: {
                    include: { _count: { select: { votes: true } } },
                    orderBy: { sortOrder: 'asc' },
                },
                _count: { select: { votes: true } },
                votes: { where: { userId }, select: { optionId: true } },
            },
        });
        if (!polling)
            throw new common_1.NotFoundException('Polling tidak ditemukan');
        return polling;
    }
    async create(dto, userId) {
        return this.prisma.polling.create({
            data: {
                title: dto.title,
                description: dto.description ?? null,
                deadline: dto.deadline ? new Date(dto.deadline) : null,
                isAnonymous: dto.isAnonymous ?? false,
                createdBy: userId,
                options: {
                    create: dto.options.map((label, i) => ({ label, sortOrder: i })),
                },
            },
            include: {
                options: { orderBy: { sortOrder: 'asc' } },
                _count: { select: { votes: true } },
            },
        });
    }
    async vote(pollingId, optionId, userId) {
        const polling = await this.prisma.polling.findUnique({
            where: { id: pollingId },
            include: { options: true },
        });
        if (!polling)
            throw new common_1.NotFoundException('Polling tidak ditemukan');
        if (polling.status !== 'AKTIF') {
            throw new common_1.BadRequestException('Polling sudah tidak aktif');
        }
        if (polling.deadline && new Date(polling.deadline) < new Date()) {
            throw new common_1.BadRequestException('Waktu voting sudah berakhir');
        }
        if (!polling.options.find((o) => o.id === optionId)) {
            throw new common_1.BadRequestException('Opsi tidak valid');
        }
        const existing = await this.prisma.pollingVote.findUnique({
            where: { pollingId_userId: { pollingId, userId } },
        });
        if (existing) {
            if (existing.optionId === optionId) {
                await this.prisma.pollingVote.delete({
                    where: { pollingId_userId: { pollingId, userId } },
                });
                return { message: 'Vote dibatalkan' };
            }
            return this.prisma.pollingVote.update({
                where: { pollingId_userId: { pollingId, userId } },
                data: { optionId },
            });
        }
        return this.prisma.pollingVote.create({
            data: { pollingId, optionId, userId },
        });
    }
    async closePolling(id, status, adminId) {
        const polling = await this.prisma.polling.findUnique({ where: { id } });
        if (!polling)
            throw new common_1.NotFoundException('Polling tidak ditemukan');
        return this.prisma.polling.update({ where: { id }, data: { status } });
    }
    async delete(id) {
        const polling = await this.prisma.polling.findUnique({ where: { id } });
        if (!polling)
            throw new common_1.NotFoundException('Polling tidak ditemukan');
        return this.prisma.polling.delete({ where: { id } });
    }
};
exports.PollingService = PollingService;
exports.PollingService = PollingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PollingService);
//# sourceMappingURL=polling.service.js.map