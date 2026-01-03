import z from "zod"; 

export const formSchema = z.object({
    full_name : z.string().min(5, "Nama harus minimal 5 karakter"),
    id_number: z.string().min(11, "No Ktp Minimal 11 angka").nullable(),
    gender: z
        .string()
        .min(1, "Harap Pilih Jenis Kelamin."),
    date_of_birth: z.date().nullable(),
    marial_status : z
        .string()
        .min(1, "Harap Pilih Status Pernikahan"),
    occupation: z.
        string()
        .min(1, "Minimal 2 karakter"),
    email : z
        .string()
        .email("Enter a valid email address."),
    kk: z.string().min(11, "No KK Minimal 11 karakter"),
    blok : z
        .string(),
    rt: z.string(),
    house_number : z.string(),
    house_type : z
        .string()
        .min(1, "Harap Pilih Jenis Rumah."),
    ownership_status : z
        .string()
        .min(1, "Harap Pilih Jenis Kepemilikan.")
        .refine((val) => val !== "auto", {
        message:
            "Auto-detection is not allowed. Please select a specific ownership.",
        }),
    start_date_of_occupancy : z.date().nullable()
})

