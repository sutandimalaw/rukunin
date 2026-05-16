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
exports.DuesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dues_service_1 = require("./dues.service");
const generate_dues_dto_1 = require("./dto/generate-dues.dto");
const query_dues_dto_1 = require("./dto/query-dues.dto");
const pay_dues_dto_1 = require("./dto/pay-dues.dto");
const batch_pay_dues_dto_1 = require("./dto/batch-pay-dues.dto");
const request_pay_dues_dto_1 = require("./dto/request-pay-dues.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let DuesController = class DuesController {
    duesService;
    constructor(duesService) {
        this.duesService = duesService;
    }
    findAll(query) {
        return this.duesService.findAll(query);
    }
    getSummary(period) {
        return this.duesService.getSummary(period);
    }
    getByHousehold(id) {
        return this.duesService.getByHousehold(id);
    }
    getMyDues(user) {
        return this.duesService.getMyDues(user.email);
    }
    getDelinquent(minMonths, lookback) {
        return this.duesService.getDelinquent(minMonths, lookback);
    }
    generate(dto, userId) {
        return this.duesService.generate(dto, userId);
    }
    batchPay(dto, userId) {
        return this.duesService.batchPay(dto, userId);
    }
    pay(id, dto, userId) {
        return this.duesService.pay(id, dto, userId);
    }
    unpay(id) {
        return this.duesService.unpay(id);
    }
    requestPay(dto) {
        return this.duesService.requestPay(dto);
    }
    rejectPay(id) {
        return this.duesService.rejectPay(id);
    }
};
exports.DuesController = DuesController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dues_dto_1.QueryDuesDto]),
    __metadata("design:returntype", void 0)
], DuesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DuesController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('household/:id'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DuesController.prototype, "getByHousehold", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'WARGA'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DuesController.prototype, "getMyDues", null);
__decorate([
    (0, common_1.Get)('delinquent'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN'),
    __param(0, (0, common_1.Query)('minMonths', new common_1.DefaultValuePipe(3), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('lookback', new common_1.DefaultValuePipe(6), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], DuesController.prototype, "getDelinquent", null);
__decorate([
    (0, common_1.Post)('generate'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_dues_dto_1.GenerateDuesDto, String]),
    __metadata("design:returntype", void 0)
], DuesController.prototype, "generate", null);
__decorate([
    (0, common_1.Patch)('batch-pay'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [batch_pay_dues_dto_1.BatchPayDuesDto, String]),
    __metadata("design:returntype", void 0)
], DuesController.prototype, "batchPay", null);
__decorate([
    (0, common_1.Patch)(':id/pay'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pay_dues_dto_1.PayDuesDto, String]),
    __metadata("design:returntype", void 0)
], DuesController.prototype, "pay", null);
__decorate([
    (0, common_1.Patch)(':id/unpay'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DuesController.prototype, "unpay", null);
__decorate([
    (0, common_1.Patch)('request-pay'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'WARGA'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_pay_dues_dto_1.RequestPayDuesDto]),
    __metadata("design:returntype", void 0)
], DuesController.prototype, "requestPay", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DuesController.prototype, "rejectPay", null);
exports.DuesController = DuesController = __decorate([
    (0, swagger_1.ApiTags)('Dues'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('dues'),
    __metadata("design:paramtypes", [dues_service_1.DuesService])
], DuesController);
//# sourceMappingURL=dues.controller.js.map