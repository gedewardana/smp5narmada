import { z } from "zod";

export const jadwalSchema = z.object({
    tahun_ajaran: z
        .string()
        .min(1, "Tahun ajaran wajib diisi")
        .regex(/^\d{4}\/\d{4}$/, "Format tidak valid (contoh: 2024/2025)")
        .max(10, "Maksimal 10 karakter"),

    daya_tampung_murid: z
        .union([z.string(), z.number()])
        .transform((val) => (val === "" ? 0 : Number(val)))
        .pipe(z.number().int("Harus bilangan bulat").positive("Daya tampung wajib diisi angka > 0")),

    status_jadwal: z.enum(["DIBUKA", "DITUTUP", "BELUM_DIBUKA"], {
        errorMap: () => ({ message: "Status jadwal tidak valid" }),
    }),

    mode_pendaftaran: z.enum(["ONLINE", "OFFLINE"], { errorMap: () => ({ message: "Mode pendaftaran tidak valid" }) }),
    mode_pengumuman: z.enum(["ONLINE", "OFFLINE"], { errorMap: () => ({ message: "Mode pengumuman tidak valid" }) }),
    mode_pendaftaran_ulang: z.enum(["ONLINE", "OFFLINE"], { errorMap: () => ({ message: "Mode daftar ulang tidak valid" }) }),
    mode_pengenalan: z.enum(["ONLINE", "OFFLINE"], { errorMap: () => ({ message: "Mode pengenalan tidak valid" }) }),

    pendaftaran_mulai: z.coerce.date({ errorMap: () => ({ message: "Wajib diisi tanggal valid" }) }),
    pendaftaran_selesai: z.coerce.date({ errorMap: () => ({ message: "Wajib diisi tanggal valid" }) }),
    pengumuman: z.coerce.date({ errorMap: () => ({ message: "Wajib diisi tanggal valid" }) }),
    pendaftaran_ulang_mulai: z.coerce.date({ errorMap: () => ({ message: "Wajib diisi tanggal valid" }) }),
    pendaftaran_ulang_selesai: z.coerce.date({ errorMap: () => ({ message: "Wajib diisi tanggal valid" }) }),
    masa_pengenalan_mulai: z.coerce.date({ errorMap: () => ({ message: "Wajib diisi tanggal valid" }) }),
    masa_pengenalan_selesai: z.coerce.date({ errorMap: () => ({ message: "Wajib diisi tanggal valid" }) }),
}).superRefine((data, ctx) => {
    // Validasi Kronologi
    if (data.pendaftaran_mulai > data.pendaftaran_selesai) {
        ctx.addIssue({ path: ["pendaftaran_selesai"], message: "Harus sesudah/sama dengan mulai pendaftaran", code: z.ZodIssueCode.custom });
    }
    if (data.pendaftaran_selesai > data.pengumuman) {
        ctx.addIssue({ path: ["pengumuman"], message: "Harus sesudah/sama dengan pendaftaran selesai", code: z.ZodIssueCode.custom });
    }
    if (data.pengumuman > data.pendaftaran_ulang_mulai) {
        ctx.addIssue({ path: ["pendaftaran_ulang_mulai"], message: "Harus sesudah/sama dengan tanggal pengumuman", code: z.ZodIssueCode.custom });
    }
    if (data.pendaftaran_ulang_mulai > data.pendaftaran_ulang_selesai) {
        ctx.addIssue({ path: ["pendaftaran_ulang_selesai"], message: "Harus sesudah/sama dengan mulai daftar ulang", code: z.ZodIssueCode.custom });
    }
    if (data.pendaftaran_ulang_selesai > data.masa_pengenalan_mulai) {
        ctx.addIssue({ path: ["masa_pengenalan_mulai"], message: "Harus sesudah/sama dengan daftar ulang selesai", code: z.ZodIssueCode.custom });
    }
    if (data.masa_pengenalan_mulai > data.masa_pengenalan_selesai) {
        ctx.addIssue({ path: ["masa_pengenalan_selesai"], message: "Harus sesudah/sama dengan mulai pengenalan", code: z.ZodIssueCode.custom });
    }
});

export function formatZodError(error) {
    const errors = {};
    error.issues.forEach((err) => {
        const field = err.path[0];
        if (!errors[field]) errors[field] = err.message;
    });
    return { error: "Data tidak valid", errors };
}
