import { FinanceService } from './finance.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
export declare class FinanceController {
    private financeService;
    constructor(financeService: FinanceService);
    findAll(query: QueryTransactionDto): Promise<{
        data: {
            type: string;
            description: string | null;
            id: string;
            createdAt: Date;
            createdBy: string;
            category: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            date: Date;
            balance: import("@prisma/client/runtime/library").Decimal;
        }[];
        balance: number | import("@prisma/client/runtime/library").Decimal;
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getSummary(): Promise<{
        currentBalance: number | import("@prisma/client/runtime/library").Decimal;
        incomeThisMonth: number | import("@prisma/client/runtime/library").Decimal;
        expensesThisMonth: number | import("@prisma/client/runtime/library").Decimal;
    }>;
    create(dto: CreateTransactionDto, userId: string): Promise<{
        type: string;
        description: string | null;
        id: string;
        createdAt: Date;
        createdBy: string;
        category: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        balance: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
