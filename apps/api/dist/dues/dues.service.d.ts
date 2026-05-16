import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FinanceService } from '../finance/finance.service';
import { GenerateDuesDto } from './dto/generate-dues.dto';
import { QueryDuesDto } from './dto/query-dues.dto';
import { PayDuesDto } from './dto/pay-dues.dto';
import { BatchPayDuesDto } from './dto/batch-pay-dues.dto';
import { RequestPayDuesDto } from './dto/request-pay-dues.dto';
export declare class DuesService {
    private prisma;
    private financeService;
    constructor(prisma: PrismaService, financeService: FinanceService);
    findAll(query: QueryDuesDto): Promise<{
        data: {
            household: {
                kepalaKeluarga: string;
                members: undefined;
                id: string;
                blok: string | null;
                kkNumber: string;
                houseNumber: string | null;
            };
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            householdId: string;
            amount: Prisma.Decimal;
            period: string;
            notes: string | null;
            paidAt: Date | null;
            paidBy: string | null;
            transactionId: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getByHousehold(householdId: string): Promise<{
        household: {
            kepalaKeluarga: string;
            members: undefined;
            blok: string | null;
            kkNumber: string;
            houseNumber: string | null;
        };
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        householdId: string;
        amount: Prisma.Decimal;
        period: string;
        notes: string | null;
        paidAt: Date | null;
        paidBy: string | null;
        transactionId: string | null;
    }[]>;
    getSummary(period?: string): Promise<{
        totalKK: number;
        paid: number;
        pending: number;
        unpaid: number;
        totalCollected: number;
        totalExpected: number;
    }>;
    generate(dto: GenerateDuesDto, userId: string): Promise<{
        created: number;
        message: string;
    }>;
    pay(id: string, dto: PayDuesDto, userId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        householdId: string;
        amount: Prisma.Decimal;
        period: string;
        notes: string | null;
        paidAt: Date | null;
        paidBy: string | null;
        transactionId: string | null;
    }>;
    unpay(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        householdId: string;
        amount: Prisma.Decimal;
        period: string;
        notes: string | null;
        paidAt: Date | null;
        paidBy: string | null;
        transactionId: string | null;
    }>;
    getDelinquent(minMonths: number, lookbackMonths: number): Promise<{
        household: {
            id: string;
            kkNumber: string;
            blok: string | null;
            houseNumber: string | null;
            kepalaKeluarga: string;
        };
        unpaidPeriods: {
            id: string;
            period: string;
        }[];
        totalAmount: number;
    }[]>;
    getMyDues(userEmail: string): Promise<{
        household: {
            id: string;
            blok: string | null;
            kkNumber: string;
            houseNumber: string | null;
        };
        billings: {
            id: string;
            period: string;
            amount: Prisma.Decimal;
            status: string;
            paidAt: Date | null;
            notes: string | null;
        }[];
    }>;
    batchPay(dto: BatchPayDuesDto, userId: string): Promise<{
        updated: number;
        message: string;
    }>;
    requestPay(dto: RequestPayDuesDto): Promise<{
        updated: number;
        message: string;
    }>;
    rejectPay(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        householdId: string;
        amount: Prisma.Decimal;
        period: string;
        notes: string | null;
        paidAt: Date | null;
        paidBy: string | null;
        transactionId: string | null;
    }>;
}
