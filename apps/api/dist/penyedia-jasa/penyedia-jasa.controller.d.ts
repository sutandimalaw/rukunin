import { PenyediaJasaService } from './penyedia-jasa.service';
import { CreatePenyediaJasaDto } from './dto/create-penyedia-jasa.dto';
import { UpdatePenyediaJasaDto } from './dto/update-penyedia-jasa.dto';
import { UpdatePenyediaJasaStatusDto } from './dto/update-status.dto';
import { QueryPenyediaJasaDto } from './dto/query-penyedia-jasa.dto';
import { UpsertReviewDto } from './dto/upsert-review.dto';
export declare class PenyediaJasaController {
    private readonly service;
    constructor(service: PenyediaJasaService);
    findAll(query: QueryPenyediaJasaDto, user: {
        id: string;
        role: string;
    }): Promise<{
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
    findMy(user: {
        id: string;
    }): Promise<({
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
    adminDeleteReview(reviewId: string, user: {
        id: string;
        role: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        comment: string | null;
        penyediaJasaId: string;
        reviewerId: string;
    }>;
    findOne(id: string, user: {
        id: string;
        role: string;
    }): Promise<{
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
    create(dto: CreatePenyediaJasaDto, user: {
        id: string;
    }): Promise<{
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
    update(id: string, dto: UpdatePenyediaJasaDto, user: {
        id: string;
        role: string;
    }): Promise<{
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
    updateStatus(id: string, dto: UpdatePenyediaJasaStatusDto, user: {
        id: string;
        role: string;
    }): Promise<{
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
    remove(id: string, user: {
        id: string;
        role: string;
    }): Promise<{
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
    listReviews(id: string): Promise<({
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
    upsertReview(id: string, dto: UpsertReviewDto, user: {
        id: string;
    }): Promise<{
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
    deleteMyReview(id: string, user: {
        id: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        comment: string | null;
        penyediaJasaId: string;
        reviewerId: string;
    }>;
}
