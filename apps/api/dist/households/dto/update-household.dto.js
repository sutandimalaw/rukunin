"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHouseholdDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_household_dto_1 = require("./create-household.dto");
class UpdateHouseholdDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_household_dto_1.CreateHouseholdDto, ['kkNumber'])) {
}
exports.UpdateHouseholdDto = UpdateHouseholdDto;
//# sourceMappingURL=update-household.dto.js.map