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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KegiatanWargaController = void 0;
const common_1 = require("@nestjs/common");
const kegiatan_warga_service_1 = require("./kegiatan-warga.service");
const create_kegiatan_warga_dto_1 = require("./dto/create-kegiatan-warga.dto");
const update_kegiatan_warga_dto_1 = require("./dto/update-kegiatan-warga.dto");
const schedule_kegiatan_dto_1 = require("./dto/schedule-kegiatan.dto");
const query_kegiatan_warga_dto_1 = require("./dto/query-kegiatan-warga.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let KegiatanWargaController = class KegiatanWargaController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(query) {
        return this.service.findAll(query);
    }
    findOne(id, user) {
        return this.service.findOne(id, user.id);
    }
    create(dto, user) {
        return this.service.create(dto, user.id);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
    vote(id, user) {
        return this.service.vote(id, user.id);
    }
    unvote(id, user) {
        return this.service.unvote(id, user.id);
    }
    schedule(id, dto) {
        return this.service.schedule(id, dto);
    }
    rsvp(id, user) {
        return this.service.rsvp(id, user.id);
    }
    unrsvp(id, user) {
        return this.service.unrsvp(id, user.id);
    }
    cancel(id) {
        return this.service.cancel(id);
    }
    complete(id) {
        return this.service.complete(id);
    }
};
exports.KegiatanWargaController = KegiatanWargaController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_kegiatan_warga_dto_1.QueryKegiatanWargaDto]),
    __metadata("design:returntype", void 0)
], KegiatanWargaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], KegiatanWargaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kegiatan_warga_dto_1.CreateKegiatanWargaDto, Object]),
    __metadata("design:returntype", void 0)
], KegiatanWargaController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_kegiatan_warga_dto_1.UpdateKegiatanWargaDto]),
    __metadata("design:returntype", void 0)
], KegiatanWargaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KegiatanWargaController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/vote'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], KegiatanWargaController.prototype, "vote", null);
__decorate([
    (0, common_1.Delete)(':id/vote'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], KegiatanWargaController.prototype, "unvote", null);
__decorate([
    (0, common_1.Post)(':id/schedule'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, schedule_kegiatan_dto_1.ScheduleKegiatanDto]),
    __metadata("design:returntype", void 0)
], KegiatanWargaController.prototype, "schedule", null);
__decorate([
    (0, common_1.Post)(':id/rsvp'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], KegiatanWargaController.prototype, "rsvp", null);
__decorate([
    (0, common_1.Delete)(':id/rsvp'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], KegiatanWargaController.prototype, "unrsvp", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KegiatanWargaController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KegiatanWargaController.prototype, "complete", null);
exports.KegiatanWargaController = KegiatanWargaController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('kegiatan-warga'),
    __metadata("design:paramtypes", [kegiatan_warga_service_1.KegiatanWargaService])
], KegiatanWargaController);
//# sourceMappingURL=kegiatan-warga.controller.js.map