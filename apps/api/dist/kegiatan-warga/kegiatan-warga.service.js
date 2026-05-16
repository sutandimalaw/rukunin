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
exports.KegiatanWargaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let KegiatanWargaService = class KegiatanWargaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page = 1, limit = 10, category, status } = query;
        const where = {};
        if (category)
            where.category = category;
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.prisma.kegiatanWarga.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.kegiatanWarga.count({ where }),
        ]);
        const dataWithCounts = await Promise.all(data.map(async (k) => {
            const [voteCount, rsvpCount] = await Promise.all([
                this.prisma.kegiatanPeserta.count({
                    where: { kegiatanId: k.id, type: 'VOTE' },
                }),
                this.prisma.kegiatanPeserta.count({
                    where: { kegiatanId: k.id, type: 'RSVP' },
                }),
            ]);
            return { ...k, voteCount, rsvpCount };
        }));
        return {
            data: dataWithCounts,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, currentUserId) {
        const kegiatan = await this.prisma.kegiatanWarga.findUnique({
            where: { id },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                profile: { select: { fullName: true } },
                            },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!kegiatan) {
            throw new common_1.NotFoundException('Kegiatan tidak ditemukan');
        }
        const voteCount = kegiatan.participants.filter((p) => p.type === 'VOTE').length;
        const rsvpCount = kegiatan.participants.filter((p) => p.type === 'RSVP').length;
        const myParticipation = currentUserId
            ? {
                hasVoted: kegiatan.participants.some((p) => p.userId === currentUserId && p.type === 'VOTE'),
                hasRsvp: kegiatan.participants.some((p) => p.userId === currentUserId && p.type === 'RSVP'),
            }
            : undefined;
        return { ...kegiatan, voteCount, rsvpCount, myParticipation };
    }
    async create(dto, userId) {
        return this.prisma.kegiatanWarga.create({
            data: {
                title: dto.title,
                description: dto.description,
                category: dto.category ?? 'umum',
                status: 'OPEN_VOTE',
                minParticipants: dto.minParticipants ?? null,
                voteDeadline: dto.voteDeadline ? new Date(dto.voteDeadline) : null,
                isRecurring: dto.isRecurring ?? false,
                recurrenceRule: dto.recurrenceRule ?? null,
                createdBy: userId,
            },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        const data = { ...dto };
        if (dto.voteDeadline)
            data.voteDeadline = new Date(dto.voteDeadline);
        return this.prisma.kegiatanWarga.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.kegiatanWarga.delete({ where: { id } });
    }
    async vote(kegiatanId, userId) {
        const kegiatan = await this.prisma.kegiatanWarga.findUnique({
            where: { id: kegiatanId },
        });
        if (!kegiatan)
            throw new common_1.NotFoundException('Kegiatan tidak ditemukan');
        if (kegiatan.status !== 'OPEN_VOTE') {
            throw new common_1.BadRequestException('Voting sudah ditutup untuk kegiatan ini');
        }
        if (kegiatan.voteDeadline && new Date() > kegiatan.voteDeadline) {
            throw new common_1.BadRequestException('Batas waktu voting sudah lewat');
        }
        try {
            return await this.prisma.kegiatanPeserta.create({
                data: { kegiatanId, userId, type: 'VOTE' },
            });
        }
        catch {
            throw new common_1.ConflictException('Anda sudah vote untuk kegiatan ini');
        }
    }
    async unvote(kegiatanId, userId) {
        const existing = await this.prisma.kegiatanPeserta.findUnique({
            where: {
                kegiatanId_userId_type: { kegiatanId, userId, type: 'VOTE' },
            },
        });
        if (!existing)
            throw new common_1.NotFoundException('Anda belum vote');
        await this.prisma.kegiatanPeserta.delete({ where: { id: existing.id } });
        return { success: true };
    }
    async schedule(id, dto) {
        const kegiatan = await this.prisma.kegiatanWarga.findUnique({
            where: { id },
        });
        if (!kegiatan)
            throw new common_1.NotFoundException('Kegiatan tidak ditemukan');
        if (kegiatan.status !== 'OPEN_VOTE') {
            throw new common_1.BadRequestException('Hanya kegiatan dengan status OPEN_VOTE yang bisa dijadwalkan');
        }
        if (kegiatan.minParticipants && !dto.force) {
            const voteCount = await this.prisma.kegiatanPeserta.count({
                where: { kegiatanId: id, type: 'VOTE' },
            });
            if (voteCount < kegiatan.minParticipants) {
                throw new common_1.BadRequestException(`Quorum belum tercapai (${voteCount}/${kegiatan.minParticipants}). Gunakan force=true untuk lanjut.`);
            }
        }
        return this.prisma.kegiatanWarga.update({
            where: { id },
            data: {
                status: 'SCHEDULED',
                startDate: new Date(dto.startDate),
                endDate: dto.endDate ? new Date(dto.endDate) : null,
                location: dto.location ?? null,
            },
        });
    }
    async rsvp(kegiatanId, userId) {
        const kegiatan = await this.prisma.kegiatanWarga.findUnique({
            where: { id: kegiatanId },
        });
        if (!kegiatan)
            throw new common_1.NotFoundException('Kegiatan tidak ditemukan');
        if (kegiatan.status !== 'SCHEDULED') {
            throw new common_1.BadRequestException('RSVP hanya bisa untuk kegiatan yang sudah dijadwalkan');
        }
        try {
            return await this.prisma.kegiatanPeserta.create({
                data: { kegiatanId, userId, type: 'RSVP' },
            });
        }
        catch {
            throw new common_1.ConflictException('Anda sudah RSVP untuk kegiatan ini');
        }
    }
    async unrsvp(kegiatanId, userId) {
        const existing = await this.prisma.kegiatanPeserta.findUnique({
            where: {
                kegiatanId_userId_type: { kegiatanId, userId, type: 'RSVP' },
            },
        });
        if (!existing)
            throw new common_1.NotFoundException('Anda belum RSVP');
        await this.prisma.kegiatanPeserta.delete({ where: { id: existing.id } });
        return { success: true };
    }
    async cancel(id) {
        await this.findOne(id);
        return this.prisma.kegiatanWarga.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });
    }
    async complete(id) {
        const kegiatan = await this.prisma.kegiatanWarga.findUnique({ where: { id } });
        if (!kegiatan)
            throw new common_1.NotFoundException('Kegiatan tidak ditemukan');
        if (kegiatan.status !== 'SCHEDULED' && kegiatan.status !== 'ONGOING') {
            throw new common_1.BadRequestException('Hanya kegiatan SCHEDULED/ONGOING yang bisa diselesaikan');
        }
        return this.prisma.kegiatanWarga.update({
            where: { id },
            data: { status: 'COMPLETED' },
        });
    }
};
exports.KegiatanWargaService = KegiatanWargaService;
exports.KegiatanWargaService = KegiatanWargaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KegiatanWargaService);
//# sourceMappingURL=kegiatan-warga.service.js.map