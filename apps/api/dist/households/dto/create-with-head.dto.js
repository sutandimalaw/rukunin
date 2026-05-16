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
exports.CreateWithHeadDto = exports.HeadResidentDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const create_household_dto_1 = require("./create-household.dto");
class HeadResidentDto {
    fullName;
    idNumber;
    gender;
    dateOfBirth;
    maritalStatus;
    occupation;
    email;
}
exports.HeadResidentDto = HeadResidentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sutandi Azhari' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    __metadata("design:type", String)
], HeadResidentDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(11),
    __metadata("design:type", String)
], HeadResidentDto.prototype, "idNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'MEN' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HeadResidentDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], HeadResidentDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeadResidentDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeadResidentDto.prototype, "occupation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], HeadResidentDto.prototype, "email", void 0);
class CreateWithHeadDto {
    household;
    head;
}
exports.CreateWithHeadDto = CreateWithHeadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: create_household_dto_1.CreateHouseholdDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_household_dto_1.CreateHouseholdDto),
    __metadata("design:type", create_household_dto_1.CreateHouseholdDto)
], CreateWithHeadDto.prototype, "household", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: HeadResidentDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => HeadResidentDto),
    __metadata("design:type", HeadResidentDto)
], CreateWithHeadDto.prototype, "head", void 0);
//# sourceMappingURL=create-with-head.dto.js.map