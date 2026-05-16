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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getFinancialReport(query) {
        const where = {};
        if (query.startDate || query.endDate) {
            where.date = {};
            if (query.startDate)
                where.date.gte = new Date(query.startDate);
            if (query.endDate)
                where.date.lte = new Date(query.endDate);
        }
        const transactions = await this.prisma.transaction.findMany({
            where,
            orderBy: { date: 'asc' },
            select: {
                id: true,
                date: true,
                type: true,
                category: true,
                amount: true,
                description: true,
                balance: true,
            },
        });
        let totalIn = 0;
        let totalOut = 0;
        const byCategory = {};
        const byMonth = {};
        for (const t of transactions) {
            const amount = Number(t.amount);
            const monthKey = t.date.toISOString().slice(0, 7);
            const cat = t.category;
            if (t.type === 'IN') {
                totalIn += amount;
            }
            else {
                totalOut += amount;
            }
            if (!byCategory[cat])
                byCategory[cat] = { in: 0, out: 0 };
            if (t.type === 'IN')
                byCategory[cat].in += amount;
            else
                byCategory[cat].out += amount;
            if (!byMonth[monthKey])
                byMonth[monthKey] = { in: 0, out: 0 };
            if (t.type === 'IN')
                byMonth[monthKey].in += amount;
            else
                byMonth[monthKey].out += amount;
        }
        const currentBalance = transactions.length > 0
            ? Number(transactions[transactions.length - 1].balance)
            : 0;
        return {
            summary: {
                totalIn,
                totalOut,
                netBalance: totalIn - totalOut,
                currentBalance,
                transactionCount: transactions.length,
            },
            byMonth: Object.entries(byMonth)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([month, val]) => ({ month, ...val, net: val.in - val.out })),
            byCategory: Object.entries(byCategory).map(([category, val]) => ({
                category,
                ...val,
                net: val.in - val.out,
            })),
        };
    }
    async getResidentsReport() {
        const [total, byBlok, byOwnership, byGender] = await Promise.all([
            this.prisma.resident.count(),
            this.prisma.household.groupBy({
                by: ['blok'],
                _count: { _all: true },
                orderBy: { blok: 'asc' },
            }),
            this.prisma.household.groupBy({
                by: ['ownershipStatus'],
                _count: { _all: true },
            }),
            this.prisma.resident.groupBy({
                by: ['gender'],
                _count: { _all: true },
            }),
        ]);
        return {
            total,
            byBlok: byBlok.map((r) => ({
                blok: r.blok ?? 'Tidak diketahui',
                count: r._count._all,
            })),
            byOwnership: byOwnership.map((r) => ({
                ownershipStatus: r.ownershipStatus ?? 'Tidak diketahui',
                count: r._count._all,
            })),
            byGender: byGender.map((r) => ({
                gender: r.gender,
                count: r._count._all,
            })),
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map