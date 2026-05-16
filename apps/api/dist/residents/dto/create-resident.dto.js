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
exports.CreateResidentDto = exports.FAMILY_RELATIONS = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
exports.FAMILY_RELATIONS = [
    'KEPALA_KELUARGA',
    'ISTRI',
    'SUAMI',
    'ANAK',
    'ORANG_TUA',
    'MERTUA',
    'MENANTU',
    'CUCU',
    'ART',
    'FAMILI_LAIN',
    'LAINNYA',
];
class CreateResidentDto {
    fullName;
    idNumber;
    gender;
    dateOfBirth;
    maritalStatus;
    occupation;
    email;
    householdId;
    familyRelation;
}
exports.CreateResidentDto = CreateResidentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sutandi Azhari' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    __metadata("design:type", String)
], CreateResidentDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '3201234567890001' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(11),
    __metadata("design:type", String)
], CreateResidentDto.prototype, "idNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'MEN' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateResidentDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1990-01-15' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateResidentDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'MARRIED' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateResidentDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Software Engineer' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateResidentDto.prototype, "occupation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'user@example.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateResidentDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'household-uuid' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateResidentDto.prototype, "householdId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ANAK', enum: exports.FAMILY_RELATIONS }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateResidentDto.prototype, "familyRelation", void 0);
//# sourceMappingURL=create-resident.dto.js.map