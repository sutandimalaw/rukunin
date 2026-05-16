export declare const PENYEDIA_JASA_CATEGORIES: readonly ["TUKANG", "ART", "BABY_SITTER", "MONTIR", "LAUNDRY", "KEBUN", "LAINNYA"];
export declare class CreatePenyediaJasaDto {
    personName: string;
    category: string;
    whatsapp?: string;
    description?: string;
    area?: string;
}
