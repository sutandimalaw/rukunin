export declare const UMKM_CATEGORIES: readonly ["MAKANAN", "MINUMAN", "JASA", "KERAJINAN", "FASHION", "ELEKTRONIK", "LAINNYA"];
export declare class CreateUmkmUsahaDto {
    name: string;
    description: string;
    category: string;
    address?: string;
    whatsapp: string;
}
