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
exports.UpsertResidentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpsertResidentDto {
    kkNumber;
    blok;
    rt;
    houseNumber;
    houseType;
    ownershipStatus;
    fullName;
    idNumber;
    gender;
    dateOfBirth;
    maritalStatus;
    occupation;
}
exports.UpsertResidentDto = UpsertResidentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3201234567890001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(11),
    __metadata("design:type", String)
], UpsertResidentDto.prototype, "kkNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'A' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertResidentDto.prototype, "blok", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertResidentDto.prototype, "rt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '12' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertResidentDto.prototype, "houseNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '36/72' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertResidentDto.prototype, "houseType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['OWNER', 'RENT'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertResidentDto.prototype, "ownershipStatus", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ example: 'Sutandi Azhari' }),
    __metadata("design:type", String)
], UpsertResidentDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ example: '3201234567890001' }),
    (0, class_validator_1.MinLength)(11),
    __metadata("design:type", String)
], UpsertResidentDto.prototype, "idNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ example: 'MEN' }),
    __metadata("design:type", String)
], UpsertResidentDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1990-01-15' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpsertResidentDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'MARRIED' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertResidentDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ example: 'Software Engineer' }),
    __metadata("design:type", String)
], UpsertResidentDto.prototype, "occupation", void 0);
//# sourceMappingURL=upsert-resident.dto.js.map