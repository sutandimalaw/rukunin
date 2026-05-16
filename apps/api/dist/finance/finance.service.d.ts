import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
export declare class FinanceService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryTransactionDto): Promise<{
        data: {
            type: string;
            description: string | null;
            id: string;
            createdAt: Date;
            createdBy: string;
            category: string;
            amount: Prisma.Decimal;
            date: Date;
            balance: Prisma.Decimal;
        }[];
        balance: number | Prisma.Decimal;
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getSummary(): Promise<{
        currentBalance: number | Prisma.Decimal;
        incomeThisMonth: number | Prisma.Decimal;
        expensesThisMonth: number | Prisma.Decimal;
    }>;
    create(dto: CreateTransactionDto, userId: string): Promise<{
        type: string;
        description: string | null;
        id: string;
        createdAt: Date;
        createdBy: string;
        category: string;
        amount: Prisma.Decimal;
        date: Date;
        balance: Prisma.Decimal;
    }>;
    createWithTx(tx: Prisma.TransactionClient, dto: {
        type: string;
        category: string;
        amount: number;
        description: string;
        date?: Date;
    }, userId: string): Promise<{
        type: string;
        description: string | null;
        id: string;
        createdAt: Date;
        createdBy: string;
        category: string;
        amount: Prisma.Decimal;
        date: Date;
        balance: Prisma.Decimal;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
