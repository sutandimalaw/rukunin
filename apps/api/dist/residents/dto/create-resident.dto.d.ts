export declare const FAMILY_RELATIONS: readonly ["KEPALA_KELUARGA", "ISTRI", "SUAMI", "ANAK", "ORANG_TUA", "MERTUA", "MENANTU", "CUCU", "ART", "FAMILI_LAIN", "LAINNYA"];
export type FamilyRelation = (typeof FAMILY_RELATIONS)[number];
export declare class CreateResidentDto {
    fullName: string;
    idNumber?: string;
    gender: string;
    dateOfBirth?: string;
    maritalStatus?: string;
    occupation?: string;
    email?: string;
    householdId: string;
    familyRelation: string;
}
