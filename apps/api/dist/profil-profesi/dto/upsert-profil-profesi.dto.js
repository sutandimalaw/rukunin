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
exports.UpsertProfilProfesiDto = exports.PROFIL_KATEGORI = void 0;
const class_validator_1 = require("class-validator");
exports.PROFIL_KATEGORI = [
    'TEKNOLOGI',
    'KESEHATAN',
    'PENDIDIKAN',
    'HUKUM',
    'KEUANGAN',
    'TEKNIK',
    'SENI_KREATIF',
    'KULINER',
    'PERDAGANGAN',
    'LAINNYA',
];
class UpsertProfilProfesiDto {
    category;
    jobTitle;
    skills;
    bio;
    whatsapp;
    isPublished;
}
exports.UpsertProfilProfesiDto = UpsertProfilProfesiDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(exports.PROFIL_KATEGORI),
    __metadata("design:type", String)
], UpsertProfilProfesiDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpsertProfilProfesiDto.prototype, "jobTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpsertProfilProfesiDto.prototype, "skills", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertProfilProfesiDto.prototype, "bio", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertProfilProfesiDto.prototype, "whatsapp", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpsertProfilProfesiDto.prototype, "isPublished", void 0);
//# sourceMappingURL=upsert-profil-profesi.dto.js.map