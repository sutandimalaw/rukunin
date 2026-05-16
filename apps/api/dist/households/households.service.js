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
exports.HouseholdsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HouseholdsService = class HouseholdsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page = 1, limit = 20, search, blok, rt } = query;
        const where = {};
        if (search) {
            where.kkNumber = { contains: search, mode: 'insensitive' };
        }
        if (blok)
            where.blok = blok;
        if (rt)
            where.rt = rt;
        const [data, total] = await Promise.all([
            this.prisma.household.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: { select: { members: true } },
                    members: {
                        where: { familyRelation: 'KEPALA_KELUARGA' },
                        select: { fullName: true, gender: true },
                        take: 1,
                    },
                },
            }),
            this.prisma.household.count({ where }),
        ]);
        return {
            data: data.map((h) => ({
                ...h,
                memberCount: h._count.members,
                kepalaKeluarga: h.members[0] ?? null,
                members: undefined,
                _count: undefined,
            })),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const household = await this.prisma.household.findUnique({
            where: { id },
            include: {
                members: {
                    orderBy: [{ familyRelation: 'asc' }, { createdAt: 'asc' }],
                },
            },
        });
        if (!household) {
            throw new common_1.NotFoundException('Kartu Keluarga tidak ditemukan');
        }
        return household;
    }
    async findByKkNumber(kkNumber) {
        const household = await this.prisma.household.findUnique({
            where: { kkNumber },
            include: {
                members: {
                    orderBy: { createdAt: 'asc' },
                    select: {
                        id: true,
                        fullName: true,
                        gender: true,
                        familyRelation: true,
                        dateOfBirth: true,
                    },
                },
            },
        });
        return household;
    }
    async create(dto, userId) {
        const existing = await this.prisma.household.findUnique({
            where: { kkNumber: dto.kkNumber },
        });
        if (existing) {
            throw new common_1.ConflictException('Nomor KK sudah terdaftar');
        }
        return this.prisma.household.create({
            data: {
                kkNumber: dto.kkNumber,
                blok: dto.blok,
                rt: dto.rt,
                houseNumber: dto.houseNumber,
                houseType: dto.houseType,
                ownershipStatus: dto.ownershipStatus,
                startDateOfOccupancy: dto.startDateOfOccupancy
                    ? new Date(dto.startDateOfOccupancy)
                    : null,
                createdBy: userId,
            },
        });
    }
    async createWithHead(dto, userId) {
        const existing = await this.prisma.household.findUnique({
            where: { kkNumber: dto.household.kkNumber },
        });
        if (existing) {
            throw new common_1.ConflictException('Nomor KK sudah terdaftar');
        }
        return this.prisma.$transaction(async (tx) => {
            const household = await tx.household.create({
                data: {
                    kkNumber: dto.household.kkNumber,
                    blok: dto.household.blok,
                    rt: dto.household.rt,
                    houseNumber: dto.household.houseNumber,
                    houseType: dto.household.houseType,
                    ownershipStatus: dto.household.ownershipStatus,
                    startDateOfOccupancy: dto.household.startDateOfOccupancy
                        ? new Date(dto.household.startDateOfOccupancy)
                        : null,
                    createdBy: userId,
                },
            });
            const head = await tx.resident.create({
                data: {
                    fullName: dto.head.fullName,
                    idNumber: dto.head.idNumber,
                    gender: dto.head.gender,
                    dateOfBirth: dto.head.dateOfBirth
                        ? new Date(dto.head.dateOfBirth)
                        : null,
                    maritalStatus: dto.head.maritalStatus,
                    occupation: dto.head.occupation,
                    email: dto.head.email,
                    familyRelation: 'KEPALA_KELUARGA',
                    householdId: household.id,
                    createdBy: userId,
                },
            });
            return { household, head };
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        const data = { ...dto };
        if (dto.startDateOfOccupancy) {
            data.startDateOfOccupancy = new Date(dto.startDateOfOccupancy);
        }
        return this.prisma.household.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.household.delete({ where: { id } });
    }
};
exports.HouseholdsService = HouseholdsService;
exports.HouseholdsService = HouseholdsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HouseholdsService);
//# sourceMappingURL=households.service.js.map