import { ResidentsService } from './residents.service';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { QueryResidentDto } from './dto/query-resident.dto';
import { UpsertResidentDto } from './dto/upsert-resident.dto';
export declare class ResidentsController {
    private residentsService;
    constructor(residentsService: ResidentsService);
    findAll(query: QueryResidentDto): Promise<{
        data: ({
            household: {
                id: string;
                blok: string | null;
                rt: string | null;
                kkNumber: string;
                houseNumber: string | null;
                houseType: string | null;
                ownershipStatus: string | null;
            };
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getSummary(): Promise<{
        totalJiwa: number;
        totalKK: number;
        totalLakiLaki: number;
        totalPerempuan: number;
        totalBalita: number;
        totalLansia: number;
    }>;
    getMyProfile(email: string): Promise<{
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
    } & {
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
    }>;
    upsertMyProfile(user: {
        id: string;
        email: string;
        role: string;
    }, dto: UpsertResidentDto): Promise<{
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
    } & {
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
    }>;
    findOne(id: string): Promise<{
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
    } & {
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
    }>;
    create(dto: CreateResidentDto, userId: string): Promise<{
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
    } & {
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
    }>;
    update(id: string, dto: UpdateResidentDto): Promise<{
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
    } & {
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
