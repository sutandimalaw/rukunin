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
exports.SaranMasukanController = void 0;
const common_1 = require("@nestjs/common");
const saran_masukan_service_1 = require("./saran-masukan.service");
const create_saran_masukan_dto_1 = require("./dto/create-saran-masukan.dto");
const respond_saran_masukan_dto_1 = require("./dto/respond-saran-masukan.dto");
const query_saran_masukan_dto_1 = require("./dto/query-saran-masukan.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let SaranMasukanController = class SaranMasukanController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(query) {
        return this.service.findAll(query);
    }
    getSummary() {
        return this.service.getSummary();
    }
    findMine(query, user) {
        return this.service.findMine(query, user.id);
    }
    create(dto, user) {
        return this.service.create(dto, user.id);
    }
    respond(id, dto, user) {
        return this.service.respond(id, dto, user.id);
    }
};
exports.SaranMasukanController = SaranMasukanController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_saran_masukan_dto_1.QuerySaranMasukanDto]),
    __metadata("design:returntype", void 0)
], SaranMasukanController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SaranMasukanController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('mine'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_saran_masukan_dto_1.QuerySaranMasukanDto, Object]),
    __metadata("design:returntype", void 0)
], SaranMasukanController.prototype, "findMine", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_saran_masukan_dto_1.CreateSaranMasukanDto, Object]),
    __metadata("design:returntype", void 0)
], SaranMasukanController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/respond'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, respond_saran_masukan_dto_1.RespondSaranMasukanDto, Object]),
    __metadata("design:returntype", void 0)
], SaranMasukanController.prototype, "respond", null);
exports.SaranMasukanController = SaranMasukanController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('saran-masukan'),
    __metadata("design:paramtypes", [saran_masukan_service_1.SaranMasukanService])
], SaranMasukanController);
//# sourceMappingURL=saran-masukan.controller.js.map