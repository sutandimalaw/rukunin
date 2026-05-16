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
exports.InventarisController = void 0;
const common_1 = require("@nestjs/common");
const inventaris_service_1 = require("./inventaris.service");
const create_inventaris_dto_1 = require("./dto/create-inventaris.dto");
const update_inventaris_dto_1 = require("./dto/update-inventaris.dto");
const query_inventaris_dto_1 = require("./dto/query-inventaris.dto");
const create_peminjaman_dto_1 = require("./dto/create-peminjaman.dto");
const update_peminjaman_status_dto_1 = require("./dto/update-peminjaman-status.dto");
const query_peminjaman_dto_1 = require("./dto/query-peminjaman.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let InventarisController = class InventarisController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAllInventaris(query) {
        return this.service.findAllInventaris(query);
    }
    findOneInventaris(id) {
        return this.service.findOneInventaris(id);
    }
    createInventaris(dto, user) {
        return this.service.createInventaris(dto, user.id);
    }
    updateInventaris(id, dto) {
        return this.service.updateInventaris(id, dto);
    }
    deleteInventaris(id) {
        return this.service.deleteInventaris(id);
    }
    findAllPeminjaman(query, user) {
        return this.service.findAllPeminjaman(query, user);
    }
    findOnePeminjaman(id, user) {
        return this.service.findOnePeminjaman(id, user);
    }
    createPeminjaman(dto, user) {
        return this.service.createPeminjaman(dto, user.id);
    }
    updatePeminjamanStatus(id, dto, user) {
        return this.service.updatePeminjamanStatus(id, dto, user.id);
    }
    cancelPeminjaman(id, user) {
        return this.service.cancelPeminjaman(id, user);
    }
};
exports.InventarisController = InventarisController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_inventaris_dto_1.QueryInventarisDto]),
    __metadata("design:returntype", void 0)
], InventarisController.prototype, "findAllInventaris", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventarisController.prototype, "findOneInventaris", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventaris_dto_1.CreateInventarisDto, Object]),
    __metadata("design:returntype", void 0)
], InventarisController.prototype, "createInventaris", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_inventaris_dto_1.UpdateInventarisDto]),
    __metadata("design:returntype", void 0)
], InventarisController.prototype, "updateInventaris", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventarisController.prototype, "deleteInventaris", null);
__decorate([
    (0, common_1.Get)('peminjaman/list'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_peminjaman_dto_1.QueryPeminjamanDto, Object]),
    __metadata("design:returntype", void 0)
], InventarisController.prototype, "findAllPeminjaman", null);
__decorate([
    (0, common_1.Get)('peminjaman/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventarisController.prototype, "findOnePeminjaman", null);
__decorate([
    (0, common_1.Post)('peminjaman'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_peminjaman_dto_1.CreatePeminjamanDto, Object]),
    __metadata("design:returntype", void 0)
], InventarisController.prototype, "createPeminjaman", null);
__decorate([
    (0, common_1.Patch)('peminjaman/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_peminjaman_status_dto_1.UpdatePeminjamanStatusDto, Object]),
    __metadata("design:returntype", void 0)
], InventarisController.prototype, "updatePeminjamanStatus", null);
__decorate([
    (0, common_1.Delete)('peminjaman/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventarisController.prototype, "cancelPeminjaman", null);
exports.InventarisController = InventarisController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('inventaris'),
    __metadata("design:paramtypes", [inventaris_service_1.InventarisService])
], InventarisController);
//# sourceMappingURL=inventaris.controller.js.map