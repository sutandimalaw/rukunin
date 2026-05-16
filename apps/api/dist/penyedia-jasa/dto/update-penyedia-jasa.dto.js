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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePenyediaJasaDto = void 0;
const class_validator_1 = require("class-validator");
const create_penyedia_jasa_dto_1 = require("./create-penyedia-jasa.dto");
class UpdatePenyediaJasaDto {
    personName;
    category;
    whatsapp;
    description;
    area;
}
exports.UpdatePenyediaJasaDto = UpdatePenyediaJasaDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePenyediaJasaDto.prototype, "personName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(create_penyedia_jasa_dto_1.PENYEDIA_JASA_CATEGORIES),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePenyediaJasaDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePenyediaJasaDto.prototype, "whatsapp", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePenyediaJasaDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePenyediaJasaDto.prototype, "area", void 0);
//# sourceMappingURL=update-penyedia-jasa.dto.js.map