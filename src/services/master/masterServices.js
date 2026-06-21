import prisma from "@/lib/prisma";

/**
 * Mengambil data referensi/master dari database secara terpusat.
 * 
 * @param {string} type - Jenis data master yang ingin diambil (agama, pekerjaan, dll)
 * @returns {Array} Array of objects dari database
 */
export async function getMasterData(type) {
    try {
        switch (type) {
            case 'pendidikan':
                return await prisma.pendidikan.findMany({ orderBy: { nama: 'asc' } });
            case 'agama':
                return await prisma.agama.findMany({ orderBy: { id_agama: 'asc' } });
            case 'jenis_kelamin':
                return await prisma.jenis_kelamin.findMany({ orderBy: { id_jenis_kelamin: 'asc' } });
            case 'jenis_tinggal':
                return await prisma.jenis_tinggal.findMany({ orderBy: { nama: 'asc' } });
            case 'kebutuhan_khusus':
                return await prisma.kebutuhan_khusus.findMany({ orderBy: { nama: 'asc' } });
            case 'pekerjaan':
                return await prisma.pekerjaan.findMany({ orderBy: { nama: 'asc' } });
            case 'penghasilan_bulanan':
                // Diurutkan berdasarkan kolom 'urutan' agar range gajinya rapi (misal < 1jt, 1-3jt, dst)
                return await prisma.penghasilan_bulanan.findMany({ orderBy: { urutan: 'asc' } });
            case 'sekolah_asal':
                return await prisma.sekolah_asal.findMany({ orderBy: { nama_sekolah: 'asc' } });
            case 'transportasi':
                return await prisma.transportasi.findMany({ orderBy: { id_transportasi: 'asc' } });
            default:
                throw new Error(`Tipe master data '${type}' tidak didukung atau belum didaftarkan di masterServices.`);
        }
    } catch (error) {
        throw new Error(`Gagal mengambil data master ${type}: ${error.message}`);
    }
}
