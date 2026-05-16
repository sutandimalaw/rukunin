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
exports.KontakDaruratService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let KontakDaruratService = class KontakDaruratService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const where = { isActive: true };
        if (query.category)
            where.category = query.category;
        return this.prisma.kontakDarurat.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        });
    }
    async findAllAdmin(query) {
        const where = {};
        if (query.category)
            where.category = query.category;
        return this.prisma.kontakDarurat.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        });
    }
    async create(dto, userId) {
        return this.prisma.kontakDarurat.create({
            data: {
                name: dto.name,
                category: dto.category,
                phoneNumber: dto.phoneNumber,
                address: dto.address ?? null,
                isActive: dto.isActive ?? true,
                sortOrder: dto.sortOrder ?? 0,
                createdBy: userId,
            },
        });
    }
    async update(id, dto) {
        const item = await this.prisma.kontakDarurat.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Kontak darurat tidak ditemukan');
        return this.prisma.kontakDarurat.update({ where: { id }, data: dto });
    }
    async delete(id) {
        const item = await this.prisma.kontakDarurat.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Kontak darurat tidak ditemukan');
        return this.prisma.kontakDarurat.delete({ where: { id } });
    }
};
exports.KontakDaruratService = KontakDaruratService;
exports.KontakDaruratService = KontakDaruratService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KontakDaruratService);
//# sourceMappingURL=kontak-darurat.service.js.map