import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function validateUser(email, password) {
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            pendaftaran_pendaftaran_id_penggunaTopengguna: {
                select: { id_pendaftaran: true },
                // orderBy: { dibuat_pada: 'desc' },
                take: 1
            }
        }
    });

    if (!user) return null;

    if (user.status_akun !== "AKTIF") {
        throw new Error("Akun tidak aktif");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    // Ambil ID pendaftaran pertama jika ada
    const idPendaftaran = user.pendaftaran_pendaftaran_id_penggunaTopengguna?.[0]?.id_pendaftaran || null;

    // NextAuth akan terima object ini sebagai "user"
    const { password: _, pendaftaran_pendaftaran_id_penggunaTopengguna: __, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, id_pendaftaran: idPendaftaran };
}