import { PrismaService } from '../prisma/prisma.service';
import { CreateHouseholdDto } from './dto/create-household.dto';
import { UpdateHouseholdDto } from './dto/update-household.dto';
import { QueryHouseholdDto } from './dto/query-household.dto';
import { CreateWithHeadDto } from './dto/create-with-head.dto';
export declare class HouseholdsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryHouseholdDto): Promise<{
        data: {
            memberCount: number;
            kepalaKeluarga: {
                fullName: string;
                gender: string;
            };
            members: undefined;
            _count: undefined;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            blok: string | null;
            rt: string | null;
            kkNumber: string;
            houseNumber: string | null;
            houseType: string | null;
            ownershipStatus: string | null;
            startDateOfOccupancy: Date | null;
            createdBy: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        members: {
            email: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            fullName: string;
            idNumber: string | null;
            gender: string;
            dateOfBirth: Date | null;
            maritalStatus: string | null;
            occupation: string | null;
            householdId: string;
            familyRelation: string;
            createdBy: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        blok: string | null;
        rt: string | null;
        kkNumber: string;
        houseNumber: string | null;
        houseType: string | null;
        ownershipStatus: string | null;
        startDateOfOccupancy: Date | null;
        createdBy: string;
    }>;
    findByKkNumber(kkNumber: string): Promise<({
        members: {
            id: string;
            fullName: string;
            gender: string;
            dateOfBirth: Date | null;
            familyRelation: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        blok: string | null;
        rt: string | null;
        kkNumber: string;
        houseNumber: string | null;
        houseType: string | null;
        ownershipStatus: string | null;
        startDateOfOccupancy: Date | null;
        createdBy: string;
    }) | null>;
    create(dto: CreateHouseholdDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        blok: string | null;
        rt: string | null;
        kkNumber: string;
        houseNumber: string | null;
        houseType: string | null;
        ownershipStatus: string | null;
        startDateOfOccupancy: Date | null;
        createdBy: string;
    }>;
    createWithHead(dto: CreateWithHeadDto, userId: string): Promise<{
        household: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            blok: string | null;
            rt: string | null;
            kkNumber: string;
            houseNumber: string | null;
            houseType: string | null;
            ownershipStatus: string | null;
            startDateOfOccupancy: Date | null;
            createdBy: string;
        };
        head: {
            email: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            fullName: string;
            idNumber: string | null;
            gender: string;
            dateOfBirth: Date | null;
            maritalStatus: string | null;
            occupation: string | null;
            householdId: string;
            familyRelation: string;
            createdBy: string;
        };
    }>;
    update(id: string, dto: UpdateHouseholdDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        blok: string | null;
        rt: string | null;
        kkNumber: string;
        houseNumber: string | null;
        houseType: string | null;
        ownershipStatus: string | null;
        startDateOfOccupancy: Date | null;
        createdBy: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        blok: string | null;
        rt: string | null;
        kkNumber: string;
        houseNumber: string | null;
        houseType: string | null;
        ownershipStatus: string | null;
        startDateOfOccupancy: Date | null;
        createdBy: string;
    }>;
}
