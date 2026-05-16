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
exports.ResidentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ResidentsService = class ResidentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page = 1, limit = 20, search, blok, rt } = query;
        const where = {};
        if (search) {
            where.fullName = { contains: search, mode: 'insensitive' };
        }
        if (blok) {
            where.household = { blok };
        }
        if (rt) {
            where.household = { ...(where.household ?? {}), rt };
        }
        const [data, total] = await Promise.all([
            this.prisma.resident.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    household: {
                        select: {
                            id: true,
                            kkNumber: true,
                            blok: true,
                            rt: true,
                            houseNumber: true,
                            houseType: true,
                            ownershipStatus: true,
                        },
                    },
                },
            }),
            this.prisma.resident.count({ where }),
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
    async getSummary() {
        const now = new Date();
        const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
        const sixtyYearsAgo = new Date(now.getFullYear() - 60, now.getMonth(), now.getDate());
        const [totalJiwa, totalKK, totalLakiLaki, totalPerempuan, totalBalita, totalLansia,] = await Promise.all([
            this.prisma.resident.count(),
            this.prisma.household.count(),
            this.prisma.resident.count({
                where: { gender: { contains: 'laki', mode: 'insensitive' } },
            }),
            this.prisma.resident.count({
                where: { gender: { contains: 'perempuan', mode: 'insensitive' } },
            }),
            this.prisma.resident.count({
                where: { dateOfBirth: { gte: fiveYearsAgo } },
            }),
            this.prisma.resident.count({
                where: { dateOfBirth: { lte: sixtyYearsAgo } },
            }),
        ]);
        return {
            totalJiwa,
            totalKK,
            totalLakiLaki,
            totalPerempuan,
            totalBalita,
            totalLansia,
        };
    }
    async findOne(id) {
        const resident = await this.prisma.resident.findUnique({
            where: { id },
            include: {
                household: true,
            },
        });
        if (!resident) {
            throw new common_1.NotFoundException('Warga tidak ditemukan');
        }
        return resident;
    }
    async create(dto, userId) {
        return this.prisma.resident.create({
            data: {
                fullName: dto.fullName,
                idNumber: dto.idNumber,
                gender: dto.gender,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
                maritalStatus: dto.maritalStatus,
                occupation: dto.occupation,
                email: dto.email,
                familyRelation: dto.familyRelation,
                householdId: dto.householdId,
                createdBy: userId,
            },
            include: { household: true },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        const data = {};
        if (dto.fullName !== undefined)
            data.fullName = dto.fullName;
        if (dto.idNumber !== undefined)
            data.idNumber = dto.idNumber;
        if (dto.gender !== undefined)
            data.gender = dto.gender;
        if (dto.maritalStatus !== undefined)
            data.maritalStatus = dto.maritalStatus;
        if (dto.occupation !== undefined)
            data.occupation = dto.occupation;
        if (dto.email !== undefined)
            data.email = dto.email;
        if (dto.familyRelation !== undefined)
            data.familyRelation = dto.familyRelation;
        if (dto.householdId !== undefined) {
            data.household = { connect: { id: dto.householdId } };
        }
        if (dto.dateOfBirth)
            data.dateOfBirth = new Date(dto.dateOfBirth);
        return this.prisma.resident.update({
            where: { id },
            data,
            include: { household: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.resident.delete({ where: { id } });
    }
    async getMyProfile(userEmail) {
        const resident = await this.prisma.resident.findFirst({
            where: { email: userEmail },
            include: { household: true },
        });
        if (!resident) {
            throw new common_1.NotFoundException('Profil warga belum dilengkapi. Silakan lengkapi data terlebih dahulu.');
        }
        return resident;
    }
    async upsertMyProfile(user, dto) {
        return this.prisma.$transaction(async (tx) => {
            const existingHousehold = await tx.household.findUnique({
                where: { kkNumber: dto.kkNumber },
            });
            const householdUpdate = {};
            if (dto.blok !== undefined)
                householdUpdate.blok = dto.blok;
            if (dto.rt !== undefined)
                householdUpdate.rt = dto.rt;
            if (dto.houseNumber !== undefined)
                householdUpdate.houseNumber = dto.houseNumber;
            if (dto.houseType !== undefined)
                householdUpdate.houseType = dto.houseType;
            if (dto.ownershipStatus !== undefined)
                householdUpdate.ownershipStatus = dto.ownershipStatus;
            const household = existingHousehold
                ? await tx.household.update({
                    where: { id: existingHousehold.id },
                    data: householdUpdate,
                })
                : await tx.household.create({
                    data: {
                        kkNumber: dto.kkNumber,
                        blok: dto.blok,
                        rt: dto.rt,
                        houseNumber: dto.houseNumber,
                        houseType: dto.houseType,
                        ownershipStatus: dto.ownershipStatus,
                        createdBy: user.id,
                    },
                });
            const existingResident = await tx.resident.findFirst({
                where: { email: user.email },
            });
            const residentUpdate = {
                fullName: dto.fullName,
                gender: dto.gender,
                email: user.email,
                household: { connect: { id: household.id } },
            };
            if (dto.idNumber !== undefined)
                residentUpdate.idNumber = dto.idNumber;
            if (dto.maritalStatus !== undefined)
                residentUpdate.maritalStatus = dto.maritalStatus;
            if (dto.occupation !== undefined)
                residentUpdate.occupation = dto.occupation;
            if (dto.dateOfBirth !== undefined) {
                residentUpdate.dateOfBirth = dto.dateOfBirth
                    ? new Date(dto.dateOfBirth)
                    : null;
            }
            const resident = existingResident
                ? await tx.resident.update({
                    where: { id: existingResident.id },
                    data: residentUpdate,
                    include: { household: true },
                })
                : await tx.resident.create({
                    data: {
                        familyRelation: existingHousehold &&
                            (await tx.resident.count({
                                where: {
                                    householdId: household.id,
                                    familyRelation: 'KEPALA_KELUARGA',
                                },
                            })) > 0
                            ? 'LAINNYA'
                            : 'KEPALA_KELUARGA',
                        fullName: dto.fullName,
                        idNumber: dto.idNumber,
                        gender: dto.gender,
                        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
                        maritalStatus: dto.maritalStatus,
                        occupation: dto.occupation,
                        email: user.email,
                        householdId: household.id,
                        createdBy: user.id,
                    },
                    include: { household: true },
                });
            return resident;
        });
    }
};
exports.ResidentsService = ResidentsService;
exports.ResidentsService = ResidentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ResidentsService);
//# sourceMappingURL=residents.service.js.map