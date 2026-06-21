import prisma from "@/lib/prisma";

/**
 * wilayahServices.js
 * Handle data master wilayah (Indonesian Administrative Regions)
 */

// 1. Ambil Semua Provinsi
export async function getAllProvinsi() {
    try {
        return await prisma.provinsi.findMany({
            orderBy: { nama_provinsi: 'asc' }
        });
    } catch (error) {
        throw new Error("Gagal mengambil data provinsi: " + error.message);
    }
}

// 2. Ambil Kabupaten Berdasarkan ID Provinsi
export async function getKabupatenByProvinsi(id_provinsi) {
    try {
        console.log(id_provinsi);
        return await prisma.kabupaten.findMany({
            where: { id_provinsi: Number(id_provinsi) },
            orderBy: { nama_kabupaten: 'asc' }
        });
    } catch (error) {
        throw new Error("Gagal mengambil data kabupaten: " + error.message);
    }
}

// 3. Ambil Kecamatan Berdasarkan ID Kabupaten
export async function getKecamatanByKabupaten(id_kabupaten) {
    try {
        return await prisma.kecamatan.findMany({
            where: { id_kabupaten: Number(id_kabupaten) },
            orderBy: { nama_kecamatan: 'asc' }
        });
    } catch (error) {
        throw new Error("Gagal mengambil data kecamatan: " + error.message);
    }
}

// 4. Ambil Kelurahan/Desa Berdasarkan ID Kecamatan
export async function getKelurahanByKecamatan(id_kecamatan) {
    try {
        return await prisma.kelurahan.findMany({
            where: { id_kecamatan: Number(id_kecamatan) },
            orderBy: { kelurahan_desa: 'asc' }
            
        });
    } catch (error) {
        throw new Error("Gagal mengambil data kelurahan: " + error.message);
    }
}


