import { KegiatanWargaService } from './kegiatan-warga.service';
import { CreateKegiatanWargaDto } from './dto/create-kegiatan-warga.dto';
import { UpdateKegiatanWargaDto } from './dto/update-kegiatan-warga.dto';
import { ScheduleKegiatanDto } from './dto/schedule-kegiatan.dto';
import { QueryKegiatanWargaDto } from './dto/query-kegiatan-warga.dto';
export declare class KegiatanWargaController {
    private readonly service;
    constructor(service: KegiatanWargaService);
    findAll(query: QueryKegiatanWargaDto): Promise<{
        data: {
            voteCount: number;
            rsvpCount: number;
            description: string;
            title: string;
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string;
            category: string;
            startDate: Date | null;
            endDate: Date | null;
            minParticipants: number | null;
            voteDeadline: Date | null;
            isRecurring: boolean;
            recurrenceRule: string | null;
            location: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, user: {
        id: string;
    }): Promise<{
        voteCount: number;
        rsvpCount: number;
        myParticipation: {
            hasVoted: boolean;
            hasRsvp: boolean;
        } | undefined;
        participants: ({
            user: {
                profile: {
                    fullName: string | null;
                } | null;
                email: string;
                id: string;
            };
        } & {
            type: string;
            id: string;
            createdAt: Date;
            kegiatanId: string;
            userId: string;
        })[];
        description: string;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        category: string;
        startDate: Date | null;
        endDate: Date | null;
        minParticipants: number | null;
        voteDeadline: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
        location: string | null;
    }>;
    create(dto: CreateKegiatanWargaDto, user: {
        id: string;
    }): Promise<{
        description: string;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        category: string;
        startDate: Date | null;
        endDate: Date | null;
        minParticipants: number | null;
        voteDeadline: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
        location: string | null;
    }>;
    update(id: string, dto: UpdateKegiatanWargaDto): Promise<{
        description: string;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        category: string;
        startDate: Date | null;
        endDate: Date | null;
        minParticipants: number | null;
        voteDeadline: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
        location: string | null;
    }>;
    remove(id: string): Promise<{
        description: string;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        category: string;
        startDate: Date | null;
        endDate: Date | null;
        minParticipants: number | null;
        voteDeadline: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
        location: string | null;
    }>;
    vote(id: string, user: {
        id: string;
    }): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        kegiatanId: string;
        userId: string;
    }>;
    unvote(id: string, user: {
        id: string;
    }): Promise<{
        success: boolean;
    }>;
    schedule(id: string, dto: ScheduleKegiatanDto): Promise<{
        description: string;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        category: string;
        startDate: Date | null;
        endDate: Date | null;
        minParticipants: number | null;
        voteDeadline: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
        location: string | null;
    }>;
    rsvp(id: string, user: {
        id: string;
    }): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        kegiatanId: string;
        userId: string;
    }>;
    unrsvp(id: string, user: {
        id: string;
    }): Promise<{
        success: boolean;
    }>;
    cancel(id: string): Promise<{
        description: string;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        category: string;
        startDate: Date | null;
        endDate: Date | null;
        minParticipants: number | null;
        voteDeadline: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
        location: string | null;
    }>;
    complete(id: string): Promise<{
        description: string;
        title: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        category: string;
        startDate: Date | null;
        endDate: Date | null;
        minParticipants: number | null;
        voteDeadline: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
        location: string | null;
    }>;
}
