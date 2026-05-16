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
exports.PenyediaJasaController = void 0;
const common_1 = require("@nestjs/common");
const penyedia_jasa_service_1 = require("./penyedia-jasa.service");
const create_penyedia_jasa_dto_1 = require("./dto/create-penyedia-jasa.dto");
const update_penyedia_jasa_dto_1 = require("./dto/update-penyedia-jasa.dto");
const update_status_dto_1 = require("./dto/update-status.dto");
const query_penyedia_jasa_dto_1 = require("./dto/query-penyedia-jasa.dto");
const upsert_review_dto_1 = require("./dto/upsert-review.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let PenyediaJasaController = class PenyediaJasaController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(query, user) {
        return this.service.findAll(query, user);
    }
    findMy(user) {
        return this.service.findMy(user.id);
    }
    adminDeleteReview(reviewId, user) {
        return this.service.adminDeleteReview(reviewId, user);
    }
    findOne(id, user) {
        return this.service.findOne(id, user);
    }
    create(dto, user) {
        return this.service.create(dto, user.id);
    }
    update(id, dto, user) {
        return this.service.update(id, dto, user);
    }
    updateStatus(id, dto, user) {
        return this.service.updateStatus(id, dto, user);
    }
    remove(id, user) {
        return this.service.remove(id, user);
    }
    listReviews(id) {
        return this.service.listReviews(id);
    }
    upsertReview(id, dto, user) {
        return this.service.upsertReview(id, dto, user.id);
    }
    deleteMyReview(id, user) {
        return this.service.deleteMyReview(id, user.id);
    }
};
exports.PenyediaJasaController = PenyediaJasaController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_penyedia_jasa_dto_1.QueryPenyediaJasaDto, Object]),
    __metadata("design:returntype", void 0)
], PenyediaJasaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('saya'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PenyediaJasaController.prototype, "findMy", null);
__decorate([
    (0, common_1.Delete)('reviews/:reviewId'),
    __param(0, (0, common_1.Param)('reviewId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PenyediaJasaController.prototype, "adminDeleteReview", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PenyediaJasaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_penyedia_jasa_dto_1.CreatePenyediaJasaDto, Object]),
    __metadata("design:returntype", void 0)
], PenyediaJasaController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_penyedia_jasa_dto_1.UpdatePenyediaJasaDto, Object]),
    __metadata("design:returntype", void 0)
], PenyediaJasaController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_status_dto_1.UpdatePenyediaJasaStatusDto, Object]),
    __metadata("design:returntype", void 0)
], PenyediaJasaController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PenyediaJasaController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/reviews'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PenyediaJasaController.prototype, "listReviews", null);
__decorate([
    (0, common_1.Put)(':id/reviews'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, upsert_review_dto_1.UpsertReviewDto, Object]),
    __metadata("design:returntype", void 0)
], PenyediaJasaController.prototype, "upsertReview", null);
__decorate([
    (0, common_1.Delete)(':id/reviews/saya'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PenyediaJasaController.prototype, "deleteMyReview", null);
exports.PenyediaJasaController = PenyediaJasaController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('penyedia-jasa'),
    __metadata("design:paramtypes", [penyedia_jasa_service_1.PenyediaJasaService])
], PenyediaJasaController);
//# sourceMappingURL=penyedia-jasa.controller.js.map