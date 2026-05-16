export declare const LAYANAN_TYPES: readonly ["SURAT_KETERANGAN", "LAPORAN_KERUSAKAN", "LAPORAN_KEAMANAN", "PENGADUAN_UMUM"];
export declare class CreateLayananWargaDto {
    type: string;
    subject: string;
    description: string;
    purpose?: string;
    location?: string;
}
