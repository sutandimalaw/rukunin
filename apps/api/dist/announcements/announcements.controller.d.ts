import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { QueryAnnouncementDto } from './dto/query-announcement.dto';
export declare class AnnouncementsController {
    private readonly announcementsService;
    constructor(announcementsService: AnnouncementsService);
    findAll(query: QueryAnnouncementDto): Promise<{
        data: {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string;
            category: string;
            content: string;
            isPublished: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        category: string;
        content: string;
        isPublished: boolean;
    }>;
    create(dto: CreateAnnouncementDto, user: {
        id: string;
    }): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        category: string;
        content: string;
        isPublished: boolean;
    }>;
    update(id: string, dto: UpdateAnnouncementDto): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        category: string;
        content: string;
        isPublished: boolean;
    }>;
    remove(id: string): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        category: string;
        content: string;
        isPublished: boolean;
    }>;
}
