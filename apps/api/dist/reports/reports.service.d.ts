import { PrismaService } from '../prisma/prisma.service';
import { ReportQueryDto } from './dto/report-query.dto';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getFinancialReport(query: ReportQueryDto): Promise<{
        summary: {
            totalIn: number;
            totalOut: number;
            netBalance: number;
            currentBalance: number;
            transactionCount: number;
        };
        byMonth: {
            net: number;
            in: number;
            out: number;
            month: string;
        }[];
        byCategory: {
            net: number;
            in: number;
            out: number;
            category: string;
        }[];
    }>;
    getResidentsReport(): Promise<{
        total: number;
        byBlok: {
            blok: string;
            count: number;
        }[];
        byOwnership: {
            ownershipStatus: string;
            count: number;
        }[];
        byGender: {
            gender: string;
            count: number;
        }[];
    }>;
}
