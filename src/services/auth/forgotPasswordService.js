import prisma from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendResetPasswordEmail } from "@/lib/mailer";

export async function generateResetToken(email) {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error("User dengan email tersebut tidak ditemukan");
    }

    // Generate random token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 jam dari sekarang

    // Update user dengan token
    await prisma.user.update({
        where: { id_pengguna: user.id_pengguna },
        data: {
            reset_token: token,
            reset_token_expires: expires
        }
    });

    // Kirim email
    try {
        await sendResetPasswordEmail(email, token);
    } catch (error) {
        console.error("Gagal mengirim email reset password:", error);
        throw new Error("Gagal mengirim email. Silakan coba lagi nanti.");
    }

    return true;
}

export async function resetPassword(token, newPassword) {
    // Cari user berdasarkan token
    const user = await prisma.user.findFirst({
        where: {
            reset_token: token,
            reset_token_expires: {
                gt: new Date() // Pastikan belum expired
            }
        }
    });

    if (!user) {
        throw new Error("Token tidak valid atau telah kedaluwarsa");
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user
    await prisma.user.update({
        where: { id_pengguna: user.id_pengguna },
        data: {
            password: hashedPassword,
            reset_token: null, // Hapus token setelah digunakan
            reset_token_expires: null
        }
    });

    return true;
}
