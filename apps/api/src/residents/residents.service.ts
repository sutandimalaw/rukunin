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
    if (blok) where.blok = blok;
    if (rt) where.rt = rt;

    const [data, total] = await Promise.all([
      this.prisma.resident.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
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

  async findOne(id: string) {
    const resident = await this.prisma.resident.findUnique({ where: { id } });

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
        kk: dto.kk,
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

  async update(id: string, dto: UpdateResidentDto) {
    await this.findOne(id);

    const data: Prisma.ResidentUpdateInput = { ...dto };

    if (dto.dateOfBirth) {
      data.dateOfBirth = new Date(dto.dateOfBirth);
    }
    if (dto.startDateOfOccupancy) {
      data.startDateOfOccupancy = new Date(dto.startDateOfOccupancy);
    }

    return this.prisma.resident.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.resident.delete({ where: { id } });
  }
}
