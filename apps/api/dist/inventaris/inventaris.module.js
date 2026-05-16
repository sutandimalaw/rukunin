"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventarisModule = void 0;
const common_1 = require("@nestjs/common");
const inventaris_controller_1 = require("./inventaris.controller");
const inventaris_service_1 = require("./inventaris.service");
const prisma_module_1 = require("../prisma/prisma.module");
let InventarisModule = class InventarisModule {
};
exports.InventarisModule = InventarisModule;
exports.InventarisModule = InventarisModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [inventaris_controller_1.InventarisController],
        providers: [inventaris_service_1.InventarisService],
    })
], InventarisModule);
//# sourceMappingURL=inventaris.module.js.map