import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
declare const LocalStrategy_base: new (...args: [] | [options: import("passport-local").IStrategyOptionsWithRequest] | [options: import("passport-local").IStrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(email: string, password: string): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        status: "ACTIVE";
        profile: {
            id: string;
            updatedAt: Date;
            fullName: string | null;
            username: string | null;
            website: string | null;
            avatarUrl: string | null;
        } | null;
        isProfileComplete: boolean;
    }>;
}
export {};
