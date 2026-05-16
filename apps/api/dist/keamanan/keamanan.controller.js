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
exports.KeamananController = void 0;
const common_1 = require("@nestjs/common");
const keamanan_service_1 = require("./keamanan.service");
const create_petugas_dto_1 = require("./dto/create-petugas.dto");
const update_petugas_dto_1 = require("./dto/update-petugas.dto");
const create_buku_tamu_dto_1 = require("./dto/create-buku-tamu.dto");
const query_buku_tamu_dto_1 = require("./dto/query-buku-tamu.dto");
const create_laporan_insiden_dto_1 = require("./dto/create-laporan-insiden.dto");
const update_insiden_status_dto_1 = require("./dto/update-insiden-status.dto");
const query_laporan_insiden_dto_1 = require("./dto/query-laporan-insiden.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let KeamananController = class KeamananController {
    service;
    constructor(service) {
        this.service = service;
    }
    getSummary() {
        return this.service.getSummary();
    }
    findAllPetugas() {
        return this.service.findAllPetugas();
    }
    createPetugas(dto, user) {
        return this.service.createPetugas(dto, user.id);
    }
    updatePetugas(id, dto) {
        return this.service.updatePetugas(id, dto);
    }
    deletePetugas(id) {
        return this.service.deletePetugas(id);
    }
    findAllTamu(query) {
        return this.service.findAllTamu(query);
    }
    createTamu(dto, user) {
        return this.service.createTamu(dto, user.id);
    }
    checkOutTamu(id) {
        return this.service.checkOutTamu(id);
    }
    findAllInsiden(query, user) {
        return this.service.findAllInsiden(query, user);
    }
    createInsiden(dto, user) {
        return this.service.createInsiden(dto, user.id);
    }
    updateInsidenStatus(id, dto, user) {
        return this.service.updateInsidenStatus(id, dto, user.id);
    }
    cancelInsiden(id, user) {
        return this.service.cancelInsiden(id, user);
    }
};
exports.KeamananController = KeamananController;
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KeamananController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('petugas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KeamananController.prototype, "findAllPetugas", null);
__decorate([
    (0, common_1.Post)('petugas'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_petugas_dto_1.CreatePetugasDto, Object]),
    __metadata("design:returntype", void 0)
], KeamananController.prototype, "createPetugas", null);
__decorate([
    (0, common_1.Patch)('petugas/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_petugas_dto_1.UpdatePetugasDto]),
    __metadata("design:returntype", void 0)
], KeamananController.prototype, "updatePetugas", null);
__decorate([
    (0, common_1.Delete)('petugas/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KeamananController.prototype, "deletePetugas", null);
__decorate([
    (0, common_1.Get)('tamu'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_buku_tamu_dto_1.QueryBukuTamuDto]),
    __metadata("design:returntype", void 0)
], KeamananController.prototype, "findAllTamu", null);
__decorate([
    (0, common_1.Post)('tamu'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_buku_tamu_dto_1.CreateBukuTamuDto, Object]),
    __metadata("design:returntype", void 0)
], KeamananController.prototype, "createTamu", null);
__decorate([
    (0, common_1.Patch)('tamu/:id/checkout'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KeamananController.prototype, "checkOutTamu", null);
__decorate([
    (0, common_1.Get)('insiden'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_laporan_insiden_dto_1.QueryLaporanInsidenDto, Object]),
    __metadata("design:returntype", void 0)
], KeamananController.prototype, "findAllInsiden", null);
__decorate([
    (0, common_1.Post)('insiden'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_laporan_insiden_dto_1.CreateLaporanInsidenDto, Object]),
    __metadata("design:returntype", void 0)
], KeamananController.prototype, "createInsiden", null);
__decorate([
    (0, common_1.Patch)('insiden/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_insiden_status_dto_1.UpdateInsidenStatusDto, Object]),
    __metadata("design:returntype", void 0)
], KeamananController.prototype, "updateInsidenStatus", null);
__decorate([
    (0, common_1.Delete)('insiden/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], KeamananController.prototype, "cancelInsiden", null);
exports.KeamananController = KeamananController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('keamanan'),
    __metadata("design:paramtypes", [keamanan_service_1.KeamananService])
], KeamananController);
//# sourceMappingURL=keamanan.controller.js.map