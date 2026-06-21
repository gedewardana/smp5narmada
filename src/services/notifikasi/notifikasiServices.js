import prisma from "@/lib/prisma";

/**
 * notifikasiServices.js
 * Layanan untuk mengelola notifikasi sistem bagi pengguna.
 */

// 1. Membuat Notifikasi Baru
export async function createNotifikasi({ id_pengguna, judul, pesan, kategori = "INFO", reference_id = null, reference_type = null, tautan_aksi = null }) {
    try {
        return await prisma.notifikasi.create({
            data: {
                id_pengguna,
                judul,
                pesan,
                kategori,
                reference_id,
                reference_type,
                tautan_aksi
            }
        });
    } catch (error) {
        throw new Error("Gagal membuat notifikasi: " + error.message);
    }
}

// 2. Mengambil Notifikasi Pengguna (Urut Terbaru)
export async function getNotifikasiByUser(id_pengguna, limit = 20) {
    try {
        return await prisma.notifikasi.findMany({
            where: { id_pengguna: Number(id_pengguna) },
            orderBy: { dibuat_pada: 'desc' },
            take: limit
        });
    } catch (error) {
        throw new Error("Gagal mengambil notifikasi: " + error.message);
    }
}

// 3. Menandai Notifikasi sebagai Terbaca
export async function markAsRead(id_notif) {
    try {
        return await prisma.notifikasi.update({
            where: { id_notif: Number(id_notif) },
            data: { is_read: true }
        });
    } catch (error) {
        throw new Error("Gagal menandai notifikasi sebagai terbaca: " + error.message);
    }
}

// 4. Menandai Semua Notifikasi Terbaca untuk User tertentu
export async function markAllAsRead(id_pengguna) {
    try {
        return await prisma.notifikasi.updateMany({
            where: { 
                id_pengguna: Number(id_pengguna),
                is_read: false 
            },
            data: { is_read: true }
        });
    } catch (error) {
        throw new Error("Gagal menandai semua notifikasi: " + error.message);
    }
}

// 5. Menghitung Jumlah Notifikasi yang Belum Terbaca
export async function getUnreadCount(id_pengguna) {
    try {
        return await prisma.notifikasi.count({
            where: { 
                id_pengguna: Number(id_pengguna),
                is_read: false 
            }
        });
    } catch (error) {
        throw new Error("Gagal menghitung notifikasi: " + error.message);
    }
}

// 6. Menghapus Notifikasi
export async function deleteNotifikasi(id_notif) {
    try {
        return await prisma.notifikasi.delete({
            where: { id_notif: Number(id_notif) }
        });
    } catch (error) {
        throw new Error("Gagal menghapus notifikasi: " + error.message);
    }
}

// 7. Broadcast Notifikasi ke Banyak User (Misal: Semua calon siswa)
export async function broadcastNotifikasi({ role = "USER", judul, pesan, kategori = "INFO", reference_id = null, reference_type = null, tautan_aksi = null }) {
    try {
        // Ambil semua user dengan role tertentu (default: pendaftar/USER)
        const targetUsers = await prisma.user.findMany({
            where: { role: role },
            select: { id_pengguna: true }
        });

        if (targetUsers.length === 0) return { count: 0 };

        // Siapkan data untuk bulk insert
        const notifikasiData = targetUsers.map(user => ({
            id_pengguna: user.id_pengguna,
            judul,
            pesan,
            kategori,
            reference_id,
            reference_type,
            tautan_aksi
        }));

        // Insert massal
        const result = await prisma.notifikasi.createMany({
            data: notifikasiData,
            skipDuplicates: true // jika perlu
        });

        return result;
    } catch (error) {
        throw new Error("Gagal melakukan broadcast notifikasi: " + error.message);
    }
}