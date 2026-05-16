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
exports.LayananWargaController = void 0;
const common_1 = require("@nestjs/common");
const layanan_warga_service_1 = require("./layanan-warga.service");
const create_layanan_warga_dto_1 = require("./dto/create-layanan-warga.dto");
const update_layanan_status_dto_1 = require("./dto/update-layanan-status.dto");
const query_layanan_warga_dto_1 = require("./dto/query-layanan-warga.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let LayananWargaController = class LayananWargaController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(query, user) {
        return this.service.findAll(query, user);
    }
    findOne(id, user) {
        return this.service.findOne(id, user);
    }
    create(dto, user) {
        return this.service.create(dto, user.id);
    }
    updateStatus(id, dto, user) {
        return this.service.updateStatus(id, dto, user.id);
    }
    remove(id, user) {
        return this.service.remove(id, user);
    }
};
exports.LayananWargaController = LayananWargaController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_layanan_warga_dto_1.QueryLayananWargaDto, Object]),
    __metadata("design:returntype", void 0)
], LayananWargaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LayananWargaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_layanan_warga_dto_1.CreateLayananWargaDto, Object]),
    __metadata("design:returntype", void 0)
], LayananWargaController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_layanan_status_dto_1.UpdateLayananStatusDto, Object]),
    __metadata("design:returntype", void 0)
], LayananWargaController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LayananWargaController.prototype, "remove", null);
exports.LayananWargaController = LayananWargaController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('layanan-warga'),
    __metadata("design:paramtypes", [layanan_warga_service_1.LayananWargaService])
], LayananWargaController);
//# sourceMappingURL=layanan-warga.controller.js.map