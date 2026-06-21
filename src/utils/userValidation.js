import { z } from "zod";

/**
 * Schema untuk validasi User di Modal Admin
 * @param {boolean} isEditMode 
 */
export const getAdminUserSchema = (isEditMode) => {
    return z.object({
        nama_lengkap: z
            .string()
            .min(1, "Nama lengkap wajib diisi")
            .max(120, "Nama terlalu panjang"),
        
        email: z
            .string()
            .min(1, "Email wajib diisi")
            .email("Format email tidak valid"),
        
        password: isEditMode
            ? z.string().refine((val) => !val || val.length >= 6, {
                message: "Password minimal 6 karakter",
              })
            : z.string()
                .min(1, "Password wajib diisi")
                .min(6, "Password minimal 6 karakter"),
        
        role: z.enum(["USER", "ADMIN"], {
            errorMap: () => ({ message: "Role tidak valid" }),
        }),
        
        status_akun: z.enum(["AKTIF", "NONAKTIF", "DIBLOKIR"], {
            errorMap: () => ({ message: "Status tidak valid" }),
        }),
    });
};
