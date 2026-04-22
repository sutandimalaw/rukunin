import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
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

    // WARGA: jangan kasih token, kembalikan pesan pending
    if (isWarga) {
      return {
        pending: true as const,
        message: 'Akun berhasil dibuat. Menunggu persetujuan admin RT.',
      };
    }

    // ADMIN: langsung aktif, kasih token
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

  async validateUser(email: string, password: string) {
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
      throw new UnauthorizedException('Akun kamu belum disetujui admin RT');
    }
    if (user.status === 'REJECTED') {
      throw new UnauthorizedException('Akun kamu ditolak oleh admin RT');
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

  async login(user: {
    id: string;
    email: string;
    role: string;
    profile: unknown;
  }) {
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { ...tokens, user };
  }

  async refresh(userId: string, email: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const role = user?.role ?? 'ADMIN';
    const tokens = await this.generateTokens(userId, email, role);
    return tokens;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException();
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

  async approveUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User tidak ditemukan');
    if (user.status !== 'PENDING')
      throw new ConflictException('User tidak dalam status pending');
    return this.prisma.user.update({
      where: { id: userId },
      data: { status: 'ACTIVE' },
      select: { id: true, email: true, role: true, status: true },
    });
  }

  async rejectUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User tidak ditemukan');
    if (user.status !== 'PENDING')
      throw new ConflictException('User tidak dalam status pending');
    return this.prisma.user.update({
      where: { id: userId },
      data: { status: 'REJECTED' },
      select: { id: true, email: true, role: true, status: true },
    });
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
      } as any),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn:
          this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
      } as any),
    ]);

    return { accessToken, refreshToken };
  }
}
