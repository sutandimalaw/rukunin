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
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FinanceService = class FinanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page = 1, limit = 50, type, category, startDate, endDate } = query;
        const where = {};
        if (type)
            where.type = type;
        if (category)
            where.category = category;
        if (startDate || endDate) {
            where.date = {};
            if (startDate)
                where.date.gte = new Date(startDate);
            if (endDate)
                where.date.lte = new Date(endDate);
        }
        const [data, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'asc' },
            }),
            this.prisma.transaction.count({ where }),
        ]);
        const lastTransaction = await this.prisma.transaction.findFirst({
            orderBy: { createdAt: 'desc' },
        });
        return {
            data,
            balance: lastTransaction?.balance ?? 0,
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
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [lastTransaction, incomeThisMonth, expensesThisMonth] = await Promise.all([
            this.prisma.transaction.findFirst({
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.transaction.aggregate({
                _sum: { amount: true },
                where: { type: 'IN', createdAt: { gte: startOfMonth } },
            }),
            this.prisma.transaction.aggregate({
                _sum: { amount: true },
                where: { type: 'OUT', createdAt: { gte: startOfMonth } },
            }),
        ]);
        return {
            currentBalance: lastTransaction?.balance ?? 0,
            incomeThisMonth: incomeThisMonth._sum.amount ?? 0,
            expensesThisMonth: expensesThisMonth._sum.amount ?? 0,
        };
    }
    async create(dto, userId) {
        return this.prisma.$transaction(async (tx) => {
            return this.createWithTx(tx, {
                type: dto.type,
                category: dto.category,
                amount: dto.amount,
                description: dto.description,
                date: dto.date ? new Date(dto.date) : undefined,
            }, userId);
        });
    }
    async createWithTx(tx, dto, userId) {
        const lastTransaction = await tx.transaction.findFirst({
            orderBy: { createdAt: 'desc' },
        });
        const previousBalance = lastTransaction
            ? Number(lastTransaction.balance)
            : 0;
        const newBalance = dto.type === 'IN'
            ? previousBalance + dto.amount
            : previousBalance - dto.amount;
        return tx.transaction.create({
            data: {
                date: dto.date ?? new Date(),
                type: dto.type,
                category: dto.category,
                amount: dto.amount,
                description: dto.description,
                balance: newBalance,
                createdBy: userId,
            },
        });
    }
    async remove(id) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Transaksi tidak ditemukan');
        }
        await this.prisma.transaction.delete({ where: { id } });
        const allTransactions = await this.prisma.transaction.findMany({
            orderBy: { createdAt: 'asc' },
        });
        let runningBalance = 0;
        for (const tx of allTransactions) {
            runningBalance =
                tx.type === 'IN'
                    ? runningBalance + Number(tx.amount)
                    : runningBalance - Number(tx.amount);
            await this.prisma.transaction.update({
                where: { id: tx.id },
                data: { balance: runningBalance },
            });
        }
        return { message: 'Transaksi dihapus dan saldo diperbarui' };
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map