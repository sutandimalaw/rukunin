import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfilesService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        id: string;
        updatedAt: Date;
        fullName: string | null;
        username: string | null;
        website: string | null;
        avatarUrl: string | null;
    } | null>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        updatedAt: Date;
        fullName: string | null;
        username: string | null;
        website: string | null;
        avatarUrl: string | null;
    }>;
}
