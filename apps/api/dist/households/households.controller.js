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
exports.HouseholdsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const households_service_1 = require("./households.service");
const create_household_dto_1 = require("./dto/create-household.dto");
const update_household_dto_1 = require("./dto/update-household.dto");
const query_household_dto_1 = require("./dto/query-household.dto");
const create_with_head_dto_1 = require("./dto/create-with-head.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let HouseholdsController = class HouseholdsController {
    householdsService;
    constructor(householdsService) {
        this.householdsService = householdsService;
    }
    findAll(query) {
        return this.householdsService.findAll(query);
    }
    findByKkNumber(kkNumber) {
        return this.householdsService.findByKkNumber(kkNumber);
    }
    findOne(id) {
        return this.householdsService.findOne(id);
    }
    create(dto, userId) {
        return this.householdsService.create(dto, userId);
    }
    createWithHead(dto, userId) {
        return this.householdsService.createWithHead(dto, userId);
    }
    update(id, dto) {
        return this.householdsService.update(id, dto);
    }
    remove(id) {
        return this.householdsService.remove(id);
    }
};
exports.HouseholdsController = HouseholdsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_household_dto_1.QueryHouseholdDto]),
    __metadata("design:returntype", void 0)
], HouseholdsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-kk/:kkNumber'),
    __param(0, (0, common_1.Param)('kkNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HouseholdsController.prototype, "findByKkNumber", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HouseholdsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_household_dto_1.CreateHouseholdDto, String]),
    __metadata("design:returntype", void 0)
], HouseholdsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('with-head'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_with_head_dto_1.CreateWithHeadDto, String]),
    __metadata("design:returntype", void 0)
], HouseholdsController.prototype, "createWithHead", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_household_dto_1.UpdateHouseholdDto]),
    __metadata("design:returntype", void 0)
], HouseholdsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HouseholdsController.prototype, "remove", null);
exports.HouseholdsController = HouseholdsController = __decorate([
    (0, swagger_1.ApiTags)('Households'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('households'),
    __metadata("design:paramtypes", [households_service_1.HouseholdsService])
], HouseholdsController);
//# sourceMappingURL=households.controller.js.map