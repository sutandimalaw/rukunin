import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHouseholdDto } from './dto/create-household.dto';
import { UpdateHouseholdDto } from './dto/update-household.dto';
import { QueryHouseholdDto } from './dto/query-household.dto';
import { CreateWithHeadDto } from './dto/create-with-head.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class HouseholdsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryHouseholdDto) {
    const { page = 1, limit = 20, search, blok, rt } = query;
    const where: Prisma.HouseholdWhereInput = {};

    if (search) {
      where.kkNumber = { contains: search, mode: 'insensitive' };
    }
    if (blok) where.blok = blok;
    if (rt) where.rt = rt;

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

  async findOne(id: string) {
    const household = await this.prisma.household.findUnique({
      where: { id },
      include: {
        members: {
          orderBy: [{ familyRelation: 'asc' }, { createdAt: 'asc' }],
        },
      },
    });

    if (!household) {
      throw new NotFoundException('Kartu Keluarga tidak ditemukan');
    }

    return household;
  }

  async findByKkNumber(kkNumber: string) {
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

    return household; // null if not found — caller handles
  }

  async create(dto: CreateHouseholdDto, userId: string) {
    const existing = await this.prisma.household.findUnique({
      where: { kkNumber: dto.kkNumber },
    });
    if (existing) {
      throw new ConflictException('Nomor KK sudah terdaftar');
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

  async createWithHead(dto: CreateWithHeadDto, userId: string) {
    const existing = await this.prisma.household.findUnique({
      where: { kkNumber: dto.household.kkNumber },
    });
    if (existing) {
      throw new ConflictException('Nomor KK sudah terdaftar');
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

  async update(id: string, dto: UpdateHouseholdDto) {
    await this.findOne(id);

    const data: Prisma.HouseholdUpdateInput = { ...dto };
    if (dto.startDateOfOccupancy) {
      data.startDateOfOccupancy = new Date(dto.startDateOfOccupancy);
    }

    return this.prisma.household.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.household.delete({ where: { id } });
  }
}
