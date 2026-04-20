import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { QueryResidentDto } from './dto/query-resident.dto';

@Injectable()
export class ResidentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryResidentDto) {
    const { page = 1, limit = 20, search, blok, rt } = query;

    const where: Prisma.ResidentWhereInput = {};

    if (search) {
      where.fullName = { contains: search, mode: 'insensitive' };
    }
    if (blok) {
      where.household = { blok };
    }
    if (rt) {
      where.household = { ...((where.household as object) ?? {}), rt };
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

    const [
      totalJiwa,
      totalKK,
      totalLakiLaki,
      totalPerempuan,
      totalBalita,
      totalLansia,
    ] = await Promise.all([
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

  async findOne(id: string) {
    const resident = await this.prisma.resident.findUnique({
      where: { id },
      include: {
        household: true,
      },
    });

    if (!resident) {
      throw new NotFoundException('Warga tidak ditemukan');
    }

    return resident;
  }

  async create(dto: CreateResidentDto, userId: string) {
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

  async update(id: string, dto: UpdateResidentDto) {
    await this.findOne(id);

    const data: Prisma.ResidentUpdateInput = {};

    if (dto.fullName !== undefined) data.fullName = dto.fullName;
    if (dto.idNumber !== undefined) data.idNumber = dto.idNumber;
    if (dto.gender !== undefined) data.gender = dto.gender;
    if (dto.maritalStatus !== undefined) data.maritalStatus = dto.maritalStatus;
    if (dto.occupation !== undefined) data.occupation = dto.occupation;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.familyRelation !== undefined) data.familyRelation = dto.familyRelation;
    if (dto.householdId !== undefined) {
      data.household = { connect: { id: dto.householdId } };
    }
    if (dto.dateOfBirth) data.dateOfBirth = new Date(dto.dateOfBirth);

    return this.prisma.resident.update({
      where: { id },
      data,
      include: { household: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.resident.delete({ where: { id } });
  }
}
