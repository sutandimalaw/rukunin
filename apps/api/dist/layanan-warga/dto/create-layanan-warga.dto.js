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
exports.CreateLayananWargaDto = exports.LAYANAN_TYPES = void 0;
const class_validator_1 = require("class-validator");
exports.LAYANAN_TYPES = [
    'SURAT_KETERANGAN',
    'LAPORAN_KERUSAKAN',
    'LAPORAN_KEAMANAN',
    'PENGADUAN_UMUM',
];
class CreateLayananWargaDto {
    type;
    subject;
    description;
    purpose;
    location;
}
exports.CreateLayananWargaDto = CreateLayananWargaDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(exports.LAYANAN_TYPES),
    __metadata("design:type", String)
], CreateLayananWargaDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLayananWargaDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLayananWargaDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLayananWargaDto.prototype, "purpose", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLayananWargaDto.prototype, "location", void 0);
//# sourceMappingURL=create-layanan-warga.dto.js.map