import { z } from "zod"

export const registerSchema = z.object({
    nama_lengkap: z
        .string()
        .min(1, "Nama lengkap wajib diisi"),

    email: z
        .string()
        .min(1, "Email wajib diisi")
        .email("Format email tidak valid"),

    password: z
        .string()
        .min(1, "Password wajib diisi")
        .min(6, "Password minimal 6 karakter"),

    konfirmasi_password: z
        .string()
        .min(1, "Konfirmasi password wajib diisi!")
})
    .refine((data) => data.password === data.konfirmasi_password, {
        message: "Konfirmasi password tidak cocok",
        path: ["konfirmasi_password"], // 🔥 error muncul di field ini


    })

// untuk mengubah error zod menjadi format yang bisa dibaca
export function formatZodError(error) {
    const errors = {}

    error.issues.forEach((err) => {
        const field = err.path[0]
        errors[field] = err.message
    })

    return {
        error: "Data tidak valid",
        errors
    }
}

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(1, "Password baru wajib diisi")
        .min(8, "Password minimal 8 karakter"),
    confirmPassword: z
        .string()
        .min(1, "Konfirmasi password wajib diisi"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
});