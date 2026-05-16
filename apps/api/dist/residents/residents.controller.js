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
exports.ResidentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const residents_service_1 = require("./residents.service");
const create_resident_dto_1 = require("./dto/create-resident.dto");
const update_resident_dto_1 = require("./dto/update-resident.dto");
const query_resident_dto_1 = require("./dto/query-resident.dto");
const upsert_resident_dto_1 = require("./dto/upsert-resident.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ResidentsController = class ResidentsController {
    residentsService;
    constructor(residentsService) {
        this.residentsService = residentsService;
    }
    findAll(query) {
        return this.residentsService.findAll(query);
    }
    getSummary() {
        return this.residentsService.getSummary();
    }
    getMyProfile(email) {
        return this.residentsService.getMyProfile(email);
    }
    upsertMyProfile(user, dto) {
        return this.residentsService.upsertMyProfile(user, dto);
    }
    findOne(id) {
        return this.residentsService.findOne(id);
    }
    create(dto, userId) {
        return this.residentsService.create(dto, userId);
    }
    update(id, dto) {
        return this.residentsService.update(id, dto);
    }
    remove(id) {
        return this.residentsService.remove(id);
    }
};
exports.ResidentsController = ResidentsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_resident_dto_1.QueryResidentDto]),
    __metadata("design:returntype", void 0)
], ResidentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ResidentsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('my-profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResidentsController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Put)('my-profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upsert_resident_dto_1.UpsertResidentDto]),
    __metadata("design:returntype", void 0)
], ResidentsController.prototype, "upsertMyProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResidentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_resident_dto_1.CreateResidentDto, String]),
    __metadata("design:returntype", void 0)
], ResidentsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_resident_dto_1.UpdateResidentDto]),
    __metadata("design:returntype", void 0)
], ResidentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResidentsController.prototype, "remove", null);
exports.ResidentsController = ResidentsController = __decorate([
    (0, swagger_1.ApiTags)('Residents'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('residents'),
    __metadata("design:paramtypes", [residents_service_1.ResidentsService])
], ResidentsController);
//# sourceMappingURL=residents.controller.js.map