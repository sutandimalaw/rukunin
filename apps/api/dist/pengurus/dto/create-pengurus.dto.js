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
exports.CreatePengurusDto = exports.POSISI_PENGURUS = void 0;
const class_validator_1 = require("class-validator");
exports.POSISI_PENGURUS = [
    'KETUA',
    'WAKIL_KETUA',
    'SEKRETARIS',
    'BENDAHARA',
    'SEKSI_KEAMANAN',
    'SEKSI_SOSIAL',
    'SEKSI_PEMUDA',
    'SEKSI_KEBERSIHAN',
    'SEKSI_HUMAS',
    'ANGGOTA',
    'LAINNYA',
];
class CreatePengurusDto {
    posisi;
    customPosisi;
    urutan;
    userId;
    fullName;
    whatsapp;
    photoUrl;
    periodeStart;
    periodeEnd;
    isActive;
    notes;
}
exports.CreatePengurusDto = CreatePengurusDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(exports.POSISI_PENGURUS),
    __metadata("design:type", String)
], CreatePengurusDto.prototype, "posisi", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePengurusDto.prototype, "customPosisi", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePengurusDto.prototype, "urutan", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePengurusDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePengurusDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePengurusDto.prototype, "whatsapp", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePengurusDto.prototype, "photoUrl", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1900),
    __metadata("design:type", Number)
], CreatePengurusDto.prototype, "periodeStart", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1900),
    __metadata("design:type", Number)
], CreatePengurusDto.prototype, "periodeEnd", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePengurusDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePengurusDto.prototype, "notes", void 0);
//# sourceMappingURL=create-pengurus.dto.js.map