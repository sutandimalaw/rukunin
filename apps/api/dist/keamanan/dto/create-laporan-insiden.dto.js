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
exports.CreateLaporanInsidenDto = void 0;
const class_validator_1 = require("class-validator");
class CreateLaporanInsidenDto {
    category;
    title;
    description;
    location;
    severity;
    incidentDate;
}
exports.CreateLaporanInsidenDto = CreateLaporanInsidenDto;
__decorate([
    (0, class_validator_1.IsIn)([
        'PENCURIAN',
        'VANDALISME',
        'GANGGUAN_KETERTIBAN',
        'ORANG_MENCURIGAKAN',
        'KECELAKAAN',
        'KEBAKARAN',
        'LAINNYA',
    ]),
    __metadata("design:type", String)
], CreateLaporanInsidenDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLaporanInsidenDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLaporanInsidenDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLaporanInsidenDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['RENDAH', 'SEDANG', 'TINGGI', 'DARURAT']),
    __metadata("design:type", String)
], CreateLaporanInsidenDto.prototype, "severity", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateLaporanInsidenDto.prototype, "incidentDate", void 0);
//# sourceMappingURL=create-laporan-insiden.dto.js.map