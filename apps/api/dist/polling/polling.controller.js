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
exports.PollingController = void 0;
const common_1 = require("@nestjs/common");
const polling_service_1 = require("./polling.service");
const create_polling_dto_1 = require("./dto/create-polling.dto");
const query_polling_dto_1 = require("./dto/query-polling.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let PollingController = class PollingController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(query, user) {
        return this.service.findAll(query, user.id);
    }
    findOne(id, user) {
        return this.service.findOne(id, user.id);
    }
    create(dto, user) {
        return this.service.create(dto, user.id);
    }
    vote(pollingId, optionId, user) {
        return this.service.vote(pollingId, optionId, user.id);
    }
    close(id, status, user) {
        return this.service.closePolling(id, status, user.id);
    }
    delete(id) {
        return this.service.delete(id);
    }
};
exports.PollingController = PollingController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_polling_dto_1.QueryPollingDto, Object]),
    __metadata("design:returntype", void 0)
], PollingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PollingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_polling_dto_1.CreatePollingDto, Object]),
    __metadata("design:returntype", void 0)
], PollingController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/vote/:optionId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('optionId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PollingController.prototype, "vote", null);
__decorate([
    (0, common_1.Post)(':id/close'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PollingController.prototype, "close", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PollingController.prototype, "delete", null);
exports.PollingController = PollingController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('polling'),
    __metadata("design:paramtypes", [polling_service_1.PollingService])
], PollingController);
//# sourceMappingURL=polling.controller.js.map