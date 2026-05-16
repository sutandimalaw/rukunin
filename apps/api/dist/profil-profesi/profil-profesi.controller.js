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
exports.ProfilProfesiController = void 0;
const common_1 = require("@nestjs/common");
const profil_profesi_service_1 = require("./profil-profesi.service");
const upsert_profil_profesi_dto_1 = require("./dto/upsert-profil-profesi.dto");
const query_profil_profesi_dto_1 = require("./dto/query-profil-profesi.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ProfilProfesiController = class ProfilProfesiController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(query, user) {
        if (user.role === 'ADMIN') {
            return this.service.findAllAdmin(query);
        }
        return this.service.findAll(query);
    }
    findMine(user) {
        return this.service.findMine(user.id);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    upsert(dto, user) {
        return this.service.upsert(user.id, dto);
    }
    remove(user) {
        return this.service.remove(user.id);
    }
};
exports.ProfilProfesiController = ProfilProfesiController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_profil_profesi_dto_1.QueryProfilProfesiDto, Object]),
    __metadata("design:returntype", void 0)
], ProfilProfesiController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProfilProfesiController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProfilProfesiController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upsert_profil_profesi_dto_1.UpsertProfilProfesiDto, Object]),
    __metadata("design:returntype", void 0)
], ProfilProfesiController.prototype, "upsert", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProfilProfesiController.prototype, "remove", null);
exports.ProfilProfesiController = ProfilProfesiController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('profil-profesi'),
    __metadata("design:paramtypes", [profil_profesi_service_1.ProfilProfesiService])
], ProfilProfesiController);
//# sourceMappingURL=profil-profesi.controller.js.map