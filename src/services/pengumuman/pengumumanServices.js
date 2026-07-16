import prisma from "@/lib/prisma";
import { createNotifikasi } from "../notifikasi/notifikasiServices";
import { sendNotificationEmail } from "@/lib/mailer";



// ─────────────────────────────────────────────
// READ — Semua Pengumuman
// ─────────────────────────────────────────────
export async function getAllPengumuman({
    tahun_ajaran, // opsional filter
    pengumuman_hasil_seleksi,
    search,
    jalur_pendaftaran,
    dateFrom,
    dateTo,
    urutan = "terbaru",
    page = 1,
    limit = 10,
} = {}) {
    const skip = (page - 1) * limit;

    let targetTahunAjaran = tahun_ajaran;

    // Smart detect jadwal aktif jika filter tidak diberikan (agar tabel langsung siap pakai)
    if (!targetTahunAjaran) {
        let jadwalUtama = await prisma.jadwal_pmb.findFirst({
            where: { status_jadwal: "DIBUKA" }
        });

        if (!jadwalUtama) {
            jadwalUtama = await prisma.jadwal_pmb.findFirst({
                orderBy: { id_jadwal: "desc" }
            });
        }
        if (jadwalUtama) targetTahunAjaran = jadwalUtama.id_jadwal;
    }

    // Bangun relasi kueri
    const where = {
        ...(pengumuman_hasil_seleksi && { pengumuman_hasil_seleksi }),
        pendaftaran: {
            status_verifikasi: 'VERIFIKASI', // hanya tampilkan yang sudah diverifikasi
            ...(targetTahunAjaran && { tahun_ajaran: targetTahunAjaran }),
            ...(jalur_pendaftaran && { jalur_pendaftaran }),
            ...(search && {
                OR: [
                    { nomor_pendaftaran: { contains: search } },
                    {
                        identitas_peserta_didik: {
                            nama_lengkap: { contains: search }
                        }
                    }
                ]
            }),
            ...((dateFrom || dateTo) && {
                tanggal_submit: {
                    ...(dateFrom && { gte: new Date(`${dateFrom}T00:00:00Z`) }),
                    ...(dateTo && { lte: new Date(`${dateTo}T23:59:59Z`) }),
                }
            })
        }
    };

    // Sorting logic
    const orderBy = urutan === "terlama"
        ? { id_pengumuman: "asc" }
        : { id_pengumuman: "desc" };

    const [data, total] = await prisma.$transaction([
        prisma.pengumuman.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                pendaftaran: {
                    include: {
                        pengguna_pendaftaran_id_penggunaTopengguna: {
                            select: { id_pengguna: true, nama_lengkap: true, email: true },
                        },
                        identitas_peserta_didik: true,
                    }
                },
                pengguna: { // yang men-verifikasi/diumumkan_oleh
                    select: { id_pengguna: true, nama_lengkap: true }
                }
            },
        }),
        prisma.pengumuman.count({ where }),
    ]);

    return {
        data,
        meta: {
            total,
            page,
            limit,
            total_pages: Math.ceil(total / limit),
        },
    };
}

// ─────────────────────────────────────────────
// READ — Pengumuman by ID Pengumuman (Detail)
// ─────────────────────────────────────────────
export async function getPengumumanById(id_pengumuman) {
    const pengumuman = await prisma.pengumuman.findUnique({
        where: { id_pengumuman: Number(id_pengumuman) },
        include: {
            pendaftaran: {
                include: {
                    identitas_peserta_didik: {
                        include: {
                            sekolah_asal: true,
                            prestasi: true,
                            kelurahan: {
                                include: {
                                    kecamatan: {
                                        include: {
                                            kabupaten: {
                                                include: {
                                                    provinsi: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    jadwal_pmb: true
                }
            },
            pengguna: { // diumumkan_oleh
                select: { id_pengguna: true, nama_lengkap: true }
            }
        }
    });

    if (!pengumuman) {
        throw new Error(`Pengumuman dengan ID ${id_pengumuman} tidak ditemukan.`);
    }

    return pengumuman;
}

// ─────────────────────────────────────────────
// READ — Pengumuman by Pendaftaran ID
// ─────────────────────────────────────────────
export async function getPengumumanByPendaftaranId(id_pendaftaran) {
    const pengumuman = await prisma.pengumuman.findUnique({
        where: { id_pendaftaran: Number(id_pendaftaran) },
        include: {
            pendaftaran: {
                include: {
                    identitas_peserta_didik: {
                        include: {
                            sekolah_asal: true
                        }
                    },
                    jadwal_pmb: true
                }
            },
            pengguna: {
                select: { id_pengguna: true, nama_lengkap: true }
            }
        }
    });

    if (!pengumuman) {
        throw new Error(`Data pengumuman untuk pendaftaran ID ${id_pendaftaran} tidak ditemukan.`);
    }

    return pengumuman;
}

// ─────────────────────────────────────────────
// UPDATE — Eksekusi/Rilis Pengumuman
// ─────────────────────────────────────────────
export async function updatePengumuman(
    id_pengumuman,
    { pengumuman_hasil_seleksi, catatan, diumumkan_oleh }
) {
    const pengumuman = await prisma.pengumuman.findUnique({
        where: { id_pengumuman: Number(id_pengumuman) },
    });

    if (!pengumuman) {
        throw new Error(`Pengumuman dengan ID ${id_pengumuman} tidak ditemukan.`);
    }

    const validStatus = ["MENUNGGU_PENGUMUMAN", "DITERIMA", "TIDAK_DITERIMA"];
    if (!validStatus.includes(pengumuman_hasil_seleksi)) {
        throw new Error(
            `Status pengumuman tidak valid. Pilihan yang tersedia: ${validStatus.join(", ")}`
        );
    }

    const updated = await prisma.pengumuman.update({
        where: { id_pengumuman: Number(id_pengumuman) },
        data: {
            pengumuman_hasil_seleksi,
            catatan: catatan ?? null,
            diumumkan_oleh: diumumkan_oleh ? Number(diumumkan_oleh) : null,
            diperbaharui_pada: new Date(),

            // CLEAN CODE: Otomatis lempar anak ke Daftar Ulang bila DITERIMA
            ...(pengumuman_hasil_seleksi === "DITERIMA" && {
                daftar_ulang: {
                    upsert: {
                        create: {
                            status_daftar_ulang: "BELUM"
                        },
                        update: {} // Aman, tidak mereset jika sudah ada
                    }
                }
            })
        },
        include: {
            pendaftaran: {
                select: {
                    id_pengguna: true,
                    pengguna_pendaftaran_id_penggunaTopengguna: {
                        select: { email: true }
                    }
                }
            }
        }
    });

    // ─────────────────────────────────────────────
    // OTOMATIS KIRIM NOTIFIKASI
    // ─────────────────────────────────────────────
    if (pengumuman_hasil_seleksi !== "MENUNGGU_PENGUMUMAN") {
        try {
            const isDiterima = pengumuman_hasil_seleksi === "DITERIMA";
            const judul = isDiterima ? "Informasi Hasil Seleksi" : "Informasi Hasil Seleksi";
            const pesan = isDiterima
                ? "Selamat! Anda dinyatakan DITERIMA di sekolah kami. Silakan segera lakukan Daftar Ulang."
                : "Mohon maaf, Anda dinyatakan TIDAK DITERIMA pada seleksi kali ini. Tetap semangat!";

            await createNotifikasi({
                id_pengguna: updated.pendaftaran.id_pengguna,
                judul,
                pesan,
                kategori: isDiterima ? "SUCCESS" : "WARNING",
                reference_id: updated.id_pengumuman,
                reference_type: "PENGUMUMAN",
                tautan_aksi: "/user/dashboard/pengumuman"
            });

            // Kirim email notifikasi ke calon siswa
            const userEmail = updated.pendaftaran.pengguna_pendaftaran_id_penggunaTopengguna?.email;
            if (userEmail) {
                console.log(`\n[EMAIL] Mencoba mengirim email pengumuman ke: ${userEmail}...`);
                await sendNotificationEmail(userEmail, judul, pesan);
                console.log(`[EMAIL] Sukses mengirim email ke: ${userEmail}\n`);
            } else {
                console.log(`\n[EMAIL] Batal mengirim email: Data email kosong.\n`);
            }
        } catch (notifError) {
            console.error("Gagal mengirim notifikasi pengumuman:", notifError);
            // Jangan throw error di sini agar update utama tetap sukses
        }
    }

    return updated;
}

// ─────────────────────────────────────────────
// UPDATE MASSAL — Eksekusi/Rilis Pengumuman Sekaligus
// ─────────────────────────────────────────────
export async function updatePengumumanMassal(
    id_pengumuman_list,
    { pengumuman_hasil_seleksi, catatan, diumumkan_oleh }
) {
    if (!Array.isArray(id_pengumuman_list) || id_pengumuman_list.length === 0) {
        throw new Error("Daftar ID Pengumuman tidak boleh kosong.");
    }

    const validStatus = ["MENUNGGU_PENGUMUMAN", "DITERIMA", "TIDAK_DITERIMA"];
    if (!validStatus.includes(pengumuman_hasil_seleksi)) {
        throw new Error(
            `Status pengumuman tidak valid. Pilihan yang tersedia: ${validStatus.join(", ")}`
        );
    }

    // 1. Buat array operasi (Transaction Queue)
    const transactionOperations = id_pengumuman_list.map((id) => {
        return prisma.pengumuman.update({
            where: { id_pengumuman: Number(id) },
            data: {
                pengumuman_hasil_seleksi,
                catatan: catatan ?? null,
                diumumkan_oleh: diumumkan_oleh ? Number(diumumkan_oleh) : null,
                diperbaharui_pada: new Date(),

                // Otomatis daftar ulang bila DITERIMA
                ...(pengumuman_hasil_seleksi === "DITERIMA" && {
                    daftar_ulang: {
                        upsert: {
                            create: { status_daftar_ulang: "BELUM" },
                            update: {}
                        }
                    }
                })
            },
            include: {
                pendaftaran: {
                    select: {
                        id_pengguna: true,
                        pengguna_pendaftaran_id_penggunaTopengguna: {
                            select: { email: true }
                        }
                    }
                }
            }
        });
    });

    // 2. Eksekusi secara atomik (Berhasil semua atau gagal semua)
    const results = await prisma.$transaction(transactionOperations);

    // 3. Kirim notifikasi secara asinkron
    if (pengumuman_hasil_seleksi !== "MENUNGGU_PENGUMUMAN") {
        try {
            const isDiterima = pengumuman_hasil_seleksi === "DITERIMA";
            const judul = isDiterima ? "Selamat! Anda Diterima" : "Informasi Hasil Seleksi";
            const pesan = isDiterima
                ? "Selamat! Anda dinyatakan DITERIMA di sekolah kami. Silakan segera lakukan Daftar Ulang."
                : "Mohon maaf, Anda dinyatakan TIDAK DITERIMA pada seleksi kali ini. Tetap semangat!";

            const notifPromises = results.map(async (updated) => {
                if (updated.pendaftaran?.id_pengguna) {
                    await createNotifikasi({
                        id_pengguna: updated.pendaftaran.id_pengguna,
                        judul,
                        pesan,
                        kategori: isDiterima ? "SUKSES" : "INFO",
                        reference_id: updated.id_pengumuman,
                        reference_type: "PENGUMUMAN",
                        tautan_aksi: "/user/dashboard/pengumuman"
                    });

                    // Kirim email notifikasi ke calon siswa
                    const userEmail = updated.pendaftaran.pengguna_pendaftaran_id_penggunaTopengguna?.email;
                    if (userEmail) {
                        console.log(`\n[EMAIL] Mencoba mengirim email pengumuman massal ke: ${userEmail}...`);
                        await sendNotificationEmail(userEmail, judul, pesan);
                        console.log(`[EMAIL] Sukses mengirim email ke: ${userEmail}\n`);
                    } else {
                        console.log(`\n[EMAIL] Batal mengirim email: Data email kosong.\n`);
                    }
                }
            });

            await Promise.all(notifPromises);
        } catch (notifError) {
            console.error("Gagal mengirim notifikasi massal:", notifError);
            // Tetap anggap sukses karena perubahan db inti sudah berhasil
        }
    }

    return results;
}
