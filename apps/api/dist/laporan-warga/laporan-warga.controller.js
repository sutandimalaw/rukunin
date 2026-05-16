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
exports.LaporanWargaController = void 0;
const common_1 = require("@nestjs/common");
const laporan_warga_service_1 = require("./laporan-warga.service");
const create_laporan_dto_1 = require("./dto/create-laporan.dto");
const query_laporan_dto_1 = require("./dto/query-laporan.dto");
const update_status_laporan_dto_1 = require("./dto/update-status-laporan.dto");
const create_komentar_dto_1 = require("./dto/create-komentar.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let LaporanWargaController = class LaporanWargaController {
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
    findOne(id, user) {
        return this.service.findOne(id, user.id, user.role);
    }
    updateStatus(id, dto, user) {
        return this.service.updateStatus(id, dto, user.id);
    }
    addKomentar(id, dto, user) {
        return this.service.addKomentar(id, dto, user.id);
    }
};
exports.LaporanWargaController = LaporanWargaController;
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_laporan_dto_1.QueryLaporanDto]),
    __metadata("design:returntype", void 0)
], LaporanWargaController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LaporanWargaController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('mine'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_laporan_dto_1.QueryLaporanDto, Object]),
    __metadata("design:returntype", void 0)
], LaporanWargaController.prototype, "findMine", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_laporan_dto_1.CreateLaporanDto, Object]),
    __metadata("design:returntype", void 0)
], LaporanWargaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LaporanWargaController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_status_laporan_dto_1.UpdateStatusLaporanDto, Object]),
    __metadata("design:returntype", void 0)
], LaporanWargaController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    (0, common_1.Post)(':id/komentar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_komentar_dto_1.CreateKomentarDto, Object]),
    __metadata("design:returntype", void 0)
], LaporanWargaController.prototype, "addKomentar", null);
exports.LaporanWargaController = LaporanWargaController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('laporan-warga'),
    __metadata("design:paramtypes", [laporan_warga_service_1.LaporanWargaService])
], LaporanWargaController);
//# sourceMappingURL=laporan-warga.controller.js.map