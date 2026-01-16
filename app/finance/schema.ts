import z from "zod"; 

export const schema = z.object({
    full_name : z.string().min(5, "Nama harus minimal 5 karakter"),
    id_number: z.string().min(11, "No Ktp Minimal 11 angka").nullable(),
    gender: z
        .string()
        .min(1, "Harap Pilih Jenis Kelamin."),
    date_of_birth: z.date().nullable(),
    marial_status : z
        .string()
        .min(1, "Harap Pilih Status Pernikahan"),
    
})

export const transactionSchema = z.object({
  type: z.string().min(1, "Harap Pilih Jenis Transaksi."),
  category: z.string().min(1, "Kategori wajib diisi"),
  amount: z.coerce.number().positive("Nominal harus lebih dari 0"),
  desc: z.string().min(1, "Deskripsi wajib diisi"),
})

