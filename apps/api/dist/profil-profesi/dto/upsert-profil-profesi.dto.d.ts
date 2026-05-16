export declare const PROFIL_KATEGORI: readonly ["TEKNOLOGI", "KESEHATAN", "PENDIDIKAN", "HUKUM", "KEUANGAN", "TEKNIK", "SENI_KREATIF", "KULINER", "PERDAGANGAN", "LAINNYA"];
export declare class UpsertProfilProfesiDto {
    category: string;
    jobTitle: string;
    skills: string;
    bio?: string;
    whatsapp?: string;
    isPublished?: boolean;
}
