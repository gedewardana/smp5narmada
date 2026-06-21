import prisma from "@/lib/prisma";

// model daftar_ulang {
//   id_daftar_ulang      Int                              @id @default(autoincrement())
//   id_pengumuman        Int                              @unique(map: "id_pengumuman")
//   status_daftar_ulang  daftar_ulang_status_daftar_ulang @default(BELUM)
//   diinput_oleh         Int?
//   tanggal_daftar_ulang DateTime?                        @default(now()) @db.Timestamp(0)
//   diperbaharui_pada    DateTime?                        @default(now()) @db.Timestamp(0)
//   berkas_daftar_ulang  berkas_daftar_ulang[]
//   pengumuman           pengumuman                       @relation(fields: [id_pengumuman], references: [id_pengumuman], map: "daftar_ulang_ibfk_2")
//   pengguna             user?                            @relation(fields: [diinput_oleh], references: [id_pengguna], onDelete: Restrict, onUpdate: Restrict, map: "diinput_oleh")
// }

// ─────────────────────────────────────────────
// READ — semua
// ─────────────────────────────────────────────
export async function getAllDaftarUlang({
    page = 1,
    limit = 10,
    search = "",
    status_daftar_ulang = undefined,
    tahun_ajaran = undefined,
    jalur_pendaftaran = undefined,
    dateFrom = undefined,
    dateTo = undefined,
    urutan = "terbaru"
}) {
    // Otomatisasi: Update status pendaftar yang melewati batas waktu daftar ulang
    await autoUpdateStatusExpired();

    const skip = (Number(page) - 1) * Number(limit);

    // Kriteria Pencarian Pintar (Smart Querying)
    const where = {
        ...(status_daftar_ulang && { status_daftar_ulang }),
        pengumuman: {
            pengumuman_hasil_seleksi: 'DITERIMA',
            pendaftaran: {
                ...(tahun_ajaran && { tahun_ajaran: Number(tahun_ajaran) }),
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
                })
            }
        },
        ...( (dateFrom || dateTo) && {
            tanggal_daftar_ulang: {
                ...(dateFrom && { gte: new Date(dateFrom) }),
                ...(dateTo && { lte: new Date(new Date(dateTo).setHours(23, 59, 59, 999)) })
            }
        })
    };

    // Mapping urutan
    const orderBy = urutan === "terlama" 
        ? { id_daftar_ulang: "asc" } 
        : { id_daftar_ulang: "desc" };

    const data = await prisma.daftar_ulang.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy,
        include: {
            pengumuman: {
                include: {
                    pendaftaran: {
                        include: {
                            identitas_peserta_didik: true, // Untuk ambil Nama, NISN, Sekolah Asal
                        }
                    }
                }
            },
            pengguna: {
                select: {
                    nama_lengkap: true // Untuk ambil nama admin yang verifikasi
                }
            }
        }
    });

    const total = await prisma.daftar_ulang.count({ where });

    return {
        data,
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit))
        }
    };
}

// ─────────────────────────────────────────────
// READ — Mengambil 1 Data Daftar Ulang Detail
// ─────────────────────────────────────────────
export async function getDaftarUlangById(id) {
    const data = await prisma.daftar_ulang.findUnique({
        where: { id_daftar_ulang: Number(id) },
        include: {
            pengumuman: {
                include: {
                    pendaftaran: {
                        include: {
                            identitas_peserta_didik: true
                        }
                    }
                }
            },
            berkas_daftar_ulang: true, // Ambil semua berkas lampirannya
            pengguna: {
                select: { nama_lengkap: true }
            }
        }
    });

    if (!data) throw new Error("Data Daftar Ulang tidak ditemukan.");
    return data;
}

// ─────────────────────────────────────────────
// UPDATE — Memperbarui Status Daftar Ulang
// ─────────────────────────────────────────────
export async function updateDaftarUlang(
    id_daftar_ulang,
    { status_daftar_ulang, diinput_oleh }
) {
    // Validasi ketat Enum Prisma untuk menolak hacking status palsu
    const validStatus = ["BELUM", "SUDAH", "MENGUNDURKAN_DIRI"];
    if (!validStatus.includes(status_daftar_ulang)) {
        throw new Error(`Status tidak valid. Pilihan yang tersedia: ${validStatus.join(", ")}`);
    }

    return prisma.daftar_ulang.update({
        where: { id_daftar_ulang: Number(id_daftar_ulang) },
        data: {
            status_daftar_ulang,
            diinput_oleh: diinput_oleh ? Number(diinput_oleh) : null,
            
            // CLEAN CODE: Jika status menjadi "SUDAH", kunci jam konfirmasinya (timestamp)
            ...(status_daftar_ulang === "SUDAH" && {
                tanggal_daftar_ulang: new Date()
            }),
            
            diperbaharui_pada: new Date()
        }
    });
}

/**
 * OTOMATISASI — Menandai siswa yang tidak melakukan daftar ulang tepat waktu
 * Menjalankan pengecekan tanggal hari ini terhadap pendaftaran_ulang_selesai di jadwal.
 */
export async function autoUpdateStatusExpired() {
    try {
        const today = new Date();
        
        // 1. Cari pendaftaran ulang yang masih BELUM namun jadwalnya sudah lewat
        const expiredRecords = await prisma.daftar_ulang.findMany({
            where: {
                status_daftar_ulang: "BELUM",
                pengumuman: {
                    pendaftaran: {
                        jadwal_pmb: {
                            pendaftaran_ulang_selesai: {
                                lt: today
                            }
                        }
                    }
                }
            },
            select: { id_daftar_ulang: true }
        });

        if (expiredRecords.length > 0) {
            const ids = expiredRecords.map(r => r.id_daftar_ulang);
            
            // 2. Update massal status menjadi MENGUNDURKAN_DIRI
            await prisma.daftar_ulang.updateMany({
                where: { id_daftar_ulang: { in: ids } },
                data: { 
                    status_daftar_ulang: "MENGUNDURKAN_DIRI",
                    diperbaharui_pada: new Date()
                }
            });

            console.log(`[Auto-Expire] Berhasil mengupdate ${expiredRecords.length} data menjadi MENGUNDURKAN_DIRI.`);
        }
    } catch (error) {
        console.error("[Auto-Expire Error] Gagal melakukan update otomatis:", error.message);
    }
}