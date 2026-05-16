"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('Email sudah terdaftar');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const isWarga = dto.role === 'WARGA';
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                role: dto.role ?? 'ADMIN',
                status: isWarga ? 'PENDING' : 'ACTIVE',
            },
        });
        await this.prisma.profile.create({
            data: { id: user.id },
        });
        if (isWarga) {
            return {
                pending: true,
                message: 'Akun berhasil dibuat. Menunggu persetujuan admin RT.',
            };
        }
        const profile = await this.prisma.profile.findUnique({
            where: { id: user.id },
        });
        const residentCount = await this.prisma.resident.count({
            where: { email: user.email },
        });
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
                profile,
                isProfileComplete: residentCount > 0,
            },
        };
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { profile: true },
        });
        if (!user) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        if (user.status === 'PENDING') {
            throw new common_1.UnauthorizedException('Akun kamu belum disetujui admin RT');
        }
        if (user.status === 'REJECTED') {
            throw new common_1.UnauthorizedException('Akun kamu ditolak oleh admin RT');
        }
        const residentCount = await this.prisma.resident.count({
            where: { email: user.email },
        });
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
            profile: user.profile,
            isProfileComplete: residentCount > 0,
        };
    }
    async login(user) {
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return { ...tokens, user };
    }
    async refresh(userId, email) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const role = user?.role ?? 'ADMIN';
        const tokens = await this.generateTokens(userId, email, role);
        return tokens;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        const residentCount = await this.prisma.resident.count({
            where: { email: user.email },
        });
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
            profile: user.profile,
            isProfileComplete: residentCount > 0,
        };
    }
    async getPendingUsers() {
        return this.prisma.user.findMany({
            where: { status: 'PENDING' },
            select: {
                id: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getActiveUsers() {
        return this.prisma.user.findMany({
            where: { status: 'ACTIVE' },
            select: {
                id: true,
                email: true,
                role: true,
                profile: { select: { fullName: true, avatarUrl: true } },
            },
            orderBy: [{ profile: { fullName: 'asc' } }, { email: 'asc' }],
        });
    }
    async approveUser(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User tidak ditemukan');
        if (user.status !== 'PENDING')
            throw new common_1.ConflictException('User tidak dalam status pending');
        return this.prisma.user.update({
            where: { id: userId },
            data: { status: 'ACTIVE' },
            select: { id: true, email: true, role: true, status: true },
        });
    }
    async rejectUser(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User tidak ditemukan');
        if (user.status !== 'PENDING')
            throw new common_1.ConflictException('User tidak dalam status pending');
        return this.prisma.user.update({
            where: { id: userId },
            data: { status: 'REJECTED' },
            select: { id: true, email: true, role: true, status: true },
        });
    }
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES_IN') || '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
            }),
        ]);
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map