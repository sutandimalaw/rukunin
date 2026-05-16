import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfilesController {
    private profilesService;
    constructor(profilesService: ProfilesService);
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
