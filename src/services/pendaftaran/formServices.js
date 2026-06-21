import prisma from "@/lib/prisma";

/**
 * formServices.js
 * 
 * Service khusus untuk menangani proses penyimpanan (Upsert) data formulir 
 * pendaftaran secara bertahap (Identitas, Keluarga, dll). 
 * Memisahkan logika form yang kompleks dari siklus hidup utama pendaftaran.
 */

export async function upsertFormIdentitas({ id_pendaftaran, identitas_peserta_didik }) {
    if (!id_pendaftaran) {
        throw new Error("ID Pendaftaran diperlukan untuk menyimpan data formulir.");
    }

    if (!identitas_peserta_didik) {
        throw new Error("Data formulir tidak boleh kosong.");
    }

    // 1. Cek status pendaftaran
    // Pastikan pendaftaran masih dalam status DRAFT sebelum bisa diedit
    const pendaftaran = await prisma.pendaftaran.findUnique({
        where: { id_pendaftaran: Number(id_pendaftaran) }
    });

    if (!pendaftaran) {
        throw new Error(`Pendaftaran dengan ID ${id_pendaftaran} tidak ditemukan.`);
    }

    if (pendaftaran.status_pendaftaran !== "DRAFT") {
        throw new Error(`Data formulir tidak dapat diubah karena status pendaftaran adalah ${pendaftaran.status_pendaftaran}.`);
    }

    // 2. Ekstrak data inti dan relasi (nested tables)
    // Hapus id_provinsi, id_kabupaten, id_kecamatan karena tidak ada di tabel identitas_peserta_didik
    const { 
        ayah, ibu, wali, periodik, prestasi, 
        id_provinsi, id_kabupaten, id_kecamatan, 
        ...identitasCore 
    } = identitas_peserta_didik;

    // Helper formatting untuk prisma nested upsert
    const formatRelation = (data) => data ? { upsert: { create: data, update: data } } : undefined;
    const formatCreateRelation = (data) => data ? { create: data } : undefined;

    // 3. Bangun objek format Prisma
    const formattedIdentitas = {
        create: {
            ...identitasCore,
            ...(ayah && { ayah: formatCreateRelation(ayah) }),
            ...(ibu && { ibu: formatCreateRelation(ibu) }),
            ...(wali && { wali: formatCreateRelation(wali) }),
            ...(periodik && { periodik: formatCreateRelation(periodik) }),
            ...(prestasi && prestasi.length > 0 && {
                prestasi: {
                    create: prestasi.map(({ penyelenggara, ...rest }) => ({
                        ...rest,
                        penyelenggara_prestasi: penyelenggara
                    }))
                }
            })
        },
        update: {
            ...identitasCore,
            ...(ayah && { ayah: formatRelation(ayah) }),
            ...(ibu && { ibu: formatRelation(ibu) }),
            ...(wali && { wali: formatRelation(wali) }),
            ...(periodik && { periodik: formatRelation(periodik) }),
            ...(prestasi && {
                prestasi: {
                    deleteMany: {},
                    create: prestasi.map(({ penyelenggara, ...rest }) => ({
                        ...rest,
                        penyelenggara_prestasi: penyelenggara
                    }))
                }
            })
        }
    };

    // 4. Lakukan Upsert via update Pendaftaran
    return await prisma.pendaftaran.update({
        where: { id_pendaftaran: Number(id_pendaftaran) },
        data: {
            identitas_peserta_didik: {
                upsert: formattedIdentitas
            },
            diperbaharui_pada: new Date()
        },
        include: {
            identitas_peserta_didik: {
                include: {
                    ayah: true,
                    ibu: true,
                    wali: true,
                    periodik: true,
                    prestasi: true
                }
            }
        }
    });
}

export async function upsertFormPersyaratan({ id_pendaftaran, berkas_persyaratan }) {
    if (!id_pendaftaran) {
        throw new Error("ID Pendaftaran diperlukan untuk menyimpan data persyaratan.");
    }

    if (!berkas_persyaratan || !Array.isArray(berkas_persyaratan)) {
        throw new Error("Data persyaratan tidak boleh kosong dan harus berupa array.");
    }

    // 1. Cek status pendaftaran
    const pendaftaran = await prisma.pendaftaran.findUnique({
        where: { id_pendaftaran: Number(id_pendaftaran) }
    });

    if (!pendaftaran) {
        throw new Error(`Pendaftaran dengan ID ${id_pendaftaran} tidak ditemukan.`);
    }

    if (pendaftaran.status_pendaftaran !== "DRAFT") {
        throw new Error(`Data formulir tidak dapat diubah karena status pendaftaran adalah ${pendaftaran.status_pendaftaran}.`);
    }

    console.log("DATA BERKAS:");
    console.log(berkas_persyaratan);

    berkas_persyaratan.forEach((b) => {
        console.log({
            jenis_berkas: b.jenis_berkas,
            status_upload: b.status_upload
        });
    });

    // 2. Siapkan operasi upsert untuk masing-masing berkas persyaratan
    const operations = berkas_persyaratan.map((berkas) => {
        return prisma.berkas_persyaratan.upsert({
            where: {
                id_pendaftaran_jenis_berkas: {
                    id_pendaftaran: Number(id_pendaftaran),
                    jenis_berkas: berkas.jenis_berkas
                }
            },
            create: {
                id_pendaftaran: Number(id_pendaftaran),
                jenis_berkas: berkas.jenis_berkas,
                nama_file: berkas.nama_file,
                path_file: berkas.path_file,
                mandatory: berkas.mandatory,
                status_upload: berkas.status_upload
            },
            update: {
                nama_file: berkas.nama_file,
                path_file: berkas.path_file,
                mandatory: berkas.mandatory,
                status_upload: berkas.status_upload,
                diperbaharui_pada: new Date()
            }
        });
    });

    // 3. Tambahkan update untuk tabel pendaftaran (waktu diperbaharui)
    const updatePendaftaran = prisma.pendaftaran.update({
        where: { id_pendaftaran: Number(id_pendaftaran) },
        data: { diperbaharui_pada: new Date() },
        include: {
            berkas_persyaratan: true
        }
    });

    const incomingJenis = berkas_persyaratan.map(b => b.jenis_berkas);

    const deleteUnused = prisma.berkas_persyaratan.deleteMany({
        where: {
            id_pendaftaran: Number(id_pendaftaran),
            jenis_berkas: { notIn: incomingJenis }
        }
    });

    // 4. Eksekusi semua operasi dalam satu transaksi
    const results = await prisma.$transaction([
        deleteUnused,
        ...operations,
        updatePendaftaran
    ]);

    // Mengembalikan hasil update pendaftaran beserta relasi berkas_persyaratan
    return results[results.length - 1];
}
