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
exports.UmkmController = void 0;
const common_1 = require("@nestjs/common");
const umkm_service_1 = require("./umkm.service");
const create_umkm_usaha_dto_1 = require("./dto/create-umkm-usaha.dto");
const update_umkm_usaha_dto_1 = require("./dto/update-umkm-usaha.dto");
const query_umkm_dto_1 = require("./dto/query-umkm.dto");
const update_usaha_status_dto_1 = require("./dto/update-usaha-status.dto");
const create_umkm_produk_dto_1 = require("./dto/create-umkm-produk.dto");
const update_umkm_produk_dto_1 = require("./dto/update-umkm-produk.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let UmkmController = class UmkmController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(query, user) {
        return this.service.findAllUsaha(query, user);
    }
    findMy(user) {
        return this.service.findMyUsaha(user.id);
    }
    findOne(id) {
        return this.service.findOneUsaha(id);
    }
    create(dto, user) {
        return this.service.createUsaha(dto, user.id);
    }
    update(id, dto, user) {
        return this.service.updateUsaha(id, dto, user);
    }
    updateStatus(id, dto) {
        return this.service.updateUsahaStatus(id, dto);
    }
    remove(id, user) {
        return this.service.deleteUsaha(id, user);
    }
    findProduk(id) {
        return this.service.findProdukByUsaha(id);
    }
    createProduk(usahaId, dto, user) {
        return this.service.createProduk(usahaId, dto, user);
    }
    updateProduk(produkId, dto, user) {
        return this.service.updateProduk(produkId, dto, user);
    }
    deleteProduk(produkId, user) {
        return this.service.deleteProduk(produkId, user);
    }
};
exports.UmkmController = UmkmController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_umkm_dto_1.QueryUmkmDto, Object]),
    __metadata("design:returntype", void 0)
], UmkmController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UmkmController.prototype, "findMy", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UmkmController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_umkm_usaha_dto_1.CreateUmkmUsahaDto, Object]),
    __metadata("design:returntype", void 0)
], UmkmController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_umkm_usaha_dto_1.UpdateUmkmUsahaDto, Object]),
    __metadata("design:returntype", void 0)
], UmkmController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_usaha_status_dto_1.UpdateUsahaStatusDto]),
    __metadata("design:returntype", void 0)
], UmkmController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UmkmController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/produk'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UmkmController.prototype, "findProduk", null);
__decorate([
    (0, common_1.Post)(':id/produk'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_umkm_produk_dto_1.CreateUmkmProdukDto, Object]),
    __metadata("design:returntype", void 0)
], UmkmController.prototype, "createProduk", null);
__decorate([
    (0, common_1.Patch)('produk/:produkId'),
    __param(0, (0, common_1.Param)('produkId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_umkm_produk_dto_1.UpdateUmkmProdukDto, Object]),
    __metadata("design:returntype", void 0)
], UmkmController.prototype, "updateProduk", null);
__decorate([
    (0, common_1.Delete)('produk/:produkId'),
    __param(0, (0, common_1.Param)('produkId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UmkmController.prototype, "deleteProduk", null);
exports.UmkmController = UmkmController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('umkm'),
    __metadata("design:paramtypes", [umkm_service_1.UmkmService])
], UmkmController);
//# sourceMappingURL=umkm.controller.js.map