import { CreateHouseholdDto } from './create-household.dto';
export declare class HeadResidentDto {
    fullName: string;
    idNumber?: string;
    gender: string;
    dateOfBirth?: string;
    maritalStatus?: string;
    occupation?: string;
    email?: string;
}
export declare class CreateWithHeadDto {
    household: CreateHouseholdDto;
    head: HeadResidentDto;
}
