export declare const POSISI_PENGURUS: readonly ["KETUA", "WAKIL_KETUA", "SEKRETARIS", "BENDAHARA", "SEKSI_KEAMANAN", "SEKSI_SOSIAL", "SEKSI_PEMUDA", "SEKSI_KEBERSIHAN", "SEKSI_HUMAS", "ANGGOTA", "LAINNYA"];
export declare class CreatePengurusDto {
    posisi: string;
    customPosisi?: string;
    urutan?: number;
    userId?: string;
    fullName: string;
    whatsapp?: string;
    photoUrl?: string;
    periodeStart: number;
    periodeEnd: number;
    isActive?: boolean;
    notes?: string;
}
