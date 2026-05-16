import { PrismaService } from '../prisma/prisma.service';
import { CreatePenyediaJasaDto } from './dto/create-penyedia-jasa.dto';
import { UpdatePenyediaJasaDto } from './dto/update-penyedia-jasa.dto';
import { UpdatePenyediaJasaStatusDto } from './dto/update-status.dto';
import { QueryPenyediaJasaDto } from './dto/query-penyedia-jasa.dto';
import { UpsertReviewDto } from './dto/upsert-review.dto';
type CurrentUser = {
    id: string;
    role: string;
};
export declare class PenyediaJasaService {
    private prisma;
    constructor(prisma: PrismaService);
    private submitterSelect;
    private reviewerSelect;
    findAll(query: QueryPenyediaJasaDto, currentUser: CurrentUser): Promise<{
        data: ({
            submitter: {
                profile: {
                    fullName: string | null;
                } | null;
                email: string;
                id: string;
            };
        } & {
            description: string | null;
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            category: string;
            adminNotes: string | null;
            whatsapp: string | null;
            personName: string;
            area: string | null;
            submittedBy: string;
        } & {
            averageRating: number | null;
            reviewCount: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findMy(userId: string): Promise<({
        submitter: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
    } & {
        description: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        adminNotes: string | null;
        whatsapp: string | null;
        personName: string;
        area: string | null;
        submittedBy: string;
    } & {
        averageRating: number | null;
        reviewCount: number;
    })[]>;
    findOne(id: string, currentUser: CurrentUser): Promise<{
        averageRating: number | null;
        reviewCount: number;
        submitter: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
        reviews: ({
            reviewer: {
                profile: {
                    fullName: string | null;
                } | null;
                email: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            comment: string | null;
            penyediaJasaId: string;
            reviewerId: string;
        })[];
        description: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        adminNotes: string | null;
        whatsapp: string | null;
        personName: string;
        area: string | null;
        submittedBy: string;
    }>;
    create(dto: CreatePenyediaJasaDto, userId: string): Promise<{
        submitter: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
    } & {
        description: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        adminNotes: string | null;
        whatsapp: string | null;
        personName: string;
        area: string | null;
        submittedBy: string;
    }>;
    update(id: string, dto: UpdatePenyediaJasaDto, currentUser: CurrentUser): Promise<{
        submitter: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
    } & {
        description: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        adminNotes: string | null;
        whatsapp: string | null;
        personName: string;
        area: string | null;
        submittedBy: string;
    }>;
    updateStatus(id: string, dto: UpdatePenyediaJasaStatusDto, currentUser: CurrentUser): Promise<{
        submitter: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
    } & {
        description: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        adminNotes: string | null;
        whatsapp: string | null;
        personName: string;
        area: string | null;
        submittedBy: string;
    }>;
    remove(id: string, currentUser: CurrentUser): Promise<{
        description: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        adminNotes: string | null;
        whatsapp: string | null;
        personName: string;
        area: string | null;
        submittedBy: string;
    }>;
    listReviews(penyediaJasaId: string): Promise<({
        reviewer: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        comment: string | null;
        penyediaJasaId: string;
        reviewerId: string;
    })[]>;
    upsertReview(penyediaJasaId: string, dto: UpsertReviewDto, userId: string): Promise<{
        reviewer: {
            profile: {
                fullName: string | null;
            } | null;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        comment: string | null;
        penyediaJasaId: string;
        reviewerId: string;
    }>;
    deleteMyReview(penyediaJasaId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        comment: string | null;
        penyediaJasaId: string;
        reviewerId: string;
    }>;
    adminDeleteReview(reviewId: string, currentUser: CurrentUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        comment: string | null;
        penyediaJasaId: string;
        reviewerId: string;
    }>;
    private attachAggregate;
}
export {};
