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
exports.PengurusService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PengurusService = class PengurusService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    userInclude = {
        user: {
            select: {
                id: true,
                email: true,
                profile: { select: { fullName: true, avatarUrl: true } },
            },
        },
    };
    async findAll(query) {
        const { active, periodeStart } = query;
        const where = {};
        if (active !== undefined)
            where.isActive = active;
        if (periodeStart !== undefined)
            where.periodeStart = periodeStart;
        return this.prisma.pengurus.findMany({
            where,
            orderBy: [
                { posisi: 'asc' },
                { urutan: 'asc' },
                { createdAt: 'asc' },
            ],
            include: this.userInclude,
        });
    }
    async findOne(id) {
        const pengurus = await this.prisma.pengurus.findUnique({
            where: { id },
            include: {
                ...this.userInclude,
                creator: {
                    select: {
                        id: true,
                        email: true,
                        profile: { select: { fullName: true } },
                    },
                },
            },
        });
        if (!pengurus) {
            throw new common_1.NotFoundException('Pengurus tidak ditemukan');
        }
        return pengurus;
    }
    async create(dto, currentUser) {
        this.assertAdmin(currentUser);
        this.validatePosisi(dto.posisi, dto.customPosisi);
        this.validatePeriode(dto.periodeStart, dto.periodeEnd);
        if (dto.userId) {
            await this.assertUserExists(dto.userId);
        }
        return this.prisma.pengurus.create({
            data: {
                posisi: dto.posisi,
                customPosisi: dto.posisi === 'LAINNYA' ? dto.customPosisi : null,
                urutan: dto.urutan ?? 0,
                userId: dto.userId ?? null,
                fullName: dto.fullName,
                whatsapp: dto.whatsapp ?? null,
                photoUrl: dto.photoUrl ?? null,
                periodeStart: dto.periodeStart,
                periodeEnd: dto.periodeEnd,
                isActive: dto.isActive ?? true,
                notes: dto.notes ?? null,
                createdBy: currentUser.id,
            },
            include: this.userInclude,
        });
    }
    async update(id, dto, currentUser) {
        this.assertAdmin(currentUser);
        const existing = await this.prisma.pengurus.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Pengurus tidak ditemukan');
        const nextPosisi = dto.posisi ?? existing.posisi;
        const nextCustomPosisi = dto.customPosisi !== undefined ? dto.customPosisi : existing.customPosisi;
        this.validatePosisi(nextPosisi, nextCustomPosisi);
        const nextStart = dto.periodeStart ?? existing.periodeStart;
        const nextEnd = dto.periodeEnd ?? existing.periodeEnd;
        this.validatePeriode(nextStart, nextEnd);
        if (dto.userId) {
            await this.assertUserExists(dto.userId);
        }
        return this.prisma.pengurus.update({
            where: { id },
            data: {
                ...(dto.posisi !== undefined && { posisi: dto.posisi }),
                customPosisi: nextPosisi === 'LAINNYA' ? nextCustomPosisi : null,
                ...(dto.urutan !== undefined && { urutan: dto.urutan }),
                ...(dto.userId !== undefined && { userId: dto.userId }),
                ...(dto.fullName !== undefined && { fullName: dto.fullName }),
                ...(dto.whatsapp !== undefined && { whatsapp: dto.whatsapp }),
                ...(dto.photoUrl !== undefined && { photoUrl: dto.photoUrl }),
                ...(dto.periodeStart !== undefined && { periodeStart: dto.periodeStart }),
                ...(dto.periodeEnd !== undefined && { periodeEnd: dto.periodeEnd }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
                ...(dto.notes !== undefined && { notes: dto.notes }),
            },
            include: this.userInclude,
        });
    }
    async remove(id, currentUser) {
        this.assertAdmin(currentUser);
        const existing = await this.prisma.pengurus.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Pengurus tidak ditemukan');
        await this.prisma.pengurus.delete({ where: { id } });
        return { success: true };
    }
    assertAdmin(currentUser) {
        if (currentUser.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Hanya admin yang dapat melakukan aksi ini');
        }
    }
    validatePosisi(posisi, customPosisi) {
        if (posisi === 'LAINNYA' && !customPosisi?.trim()) {
            throw new common_1.BadRequestException('customPosisi wajib diisi kalau posisi LAINNYA');
        }
    }
    validatePeriode(start, end) {
        if (end < start) {
            throw new common_1.BadRequestException('periodeEnd harus >= periodeStart');
        }
    }
    async assertUserExists(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.BadRequestException('User tidak ditemukan');
    }
};
exports.PengurusService = PengurusService;
exports.PengurusService = PengurusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PengurusService);
//# sourceMappingURL=pengurus.service.js.map