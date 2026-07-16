import prisma from "@/lib/prisma";
import { createNotifikasi } from "@/services/notifikasi/notifikasiServices";
import { sendNotificationEmail } from "@/lib/mailer";
// import { getLocalYMD } from "@/utils/timezoneHelper";
// Helper: generate nomor pendaftaran
// Format: REG-{TAHUN}-{ID_JADWAL padded 2 digit}-{ID_PENDAFTARAN padded 4 digit}
function generateNomorPendaftaran(tahunString, idJadwal, idPendaftaran) {
    // Jika format tahun "2024/2025", ambil "2024". Jika default, ambil tahun ini.
    const tahunAwal = tahunString ? String(tahunString).split('/')[0] : new Date().getFullYear();
    const tahun2Digit = String(tahunAwal).slice(-2);
    const kodeJadwal = String(idJadwal).padStart(2, "0");
    const nomorUrut = String(idPendaftaran).padStart(4, "0");

    return `REG-${tahun2Digit}-${kodeJadwal}-${nomorUrut}`;
}


// ─────────────────────────────────────────────
export async function createPendaftaran({ id_pengguna, jalur_pendaftaran }) {
    // 1. Cari jadwal pendaftaran terakhir yang aktif (tanpa mempedulikan status DIBUKA/DITUTUP)
    // agar user tetap bisa membuat DRAFT pendaftaran otomatis.
    let jadwalAktif = await prisma.jadwal_pmb.findFirst({
        where: { is_active: true },
        orderBy: { id_jadwal: 'desc' }
    });

    // Jika tidak ada yang is_active: true, ambil jadwal yang paling terakhir dibuat di database
    if (!jadwalAktif) {
        jadwalAktif = await prisma.jadwal_pmb.findFirst({
            orderBy: { id_jadwal: 'desc' }
        });
    }

    if (!jadwalAktif) {
        throw new Error(
            "Belum ada gelombang pendaftaran (Jadwal PMB) yang diatur di dalam sistem. Harap hubungi Admin."
        );
    }

    // 2. Proteksi Lanjutan 1: mode_pendaftaran OFFLINE
    if (jadwalAktif.mode_pendaftaran === "OFFLINE") {
        throw new Error(
            "Gelombang pendaftaran ini dilakukan secara tatap muka (OFFLINE). Silakan datang ke loket sekolah untuk mendaftar."
        );
    }

    // 3. Proteksi Lanjutan 2: Strict Deadline Checker - (Dinonaktifkan sesuai permintaan)
    // const sekarangYMD = new Intl.DateTimeFormat('en-CA', {
    //     timeZone: 'Asia/Makassar', // Zona waktu lokal panitia
    //     year: 'numeric', month: '2-digit', day: '2-digit'
    // }).format(new Date());
    // const dateSekarang = new Date(`${sekarangYMD}T00:00:00Z`);

    // const dateMulai = new Date(`${getLocalYMD(jadwalAktif.pendaftaran_mulai)}T00:00:00Z`);
    // const dateAkhir = new Date(`${getLocalYMD(jadwalAktif.pendaftaran_selesai)}T00:00:00Z`);

    // if (dateSekarang < dateMulai) {
    //     throw new Error("Masa pendaftaran belum dimulai.");
    // }
    // if (dateSekarang > dateAkhir) {
    //     throw new Error("Batas waktu pendaftaran telah berakhir.");
    // }


    const id_jadwal = jadwalAktif.id_jadwal;

    // 4. Cek pendaftaran pengguna di periode aktif ini
    const existing = await prisma.pendaftaran.findFirst({
        where: {
            id_pengguna,
            tahun_ajaran: id_jadwal,
        },
    });

    if (existing) {
        if (existing.status_pendaftaran !== "DRAFT") {
            throw new Error(
                `Anda sudah terdaftar secara resmi pada gelombang ini dengan nomor: ${existing.nomor_pendaftaran}.`
            );
        }
        // Jika sudah ada DRAFT, langsung return draft yang sudah ada
        // daripada membuang nomor dan membuat ganda
        return existing;
    }

    // 3. Buat pendaftaran baru menggunakan skema default dari Prisma
    // status_pendaftaran: DRAFT, status_verifikasi: BELUM_DIVERIFIKASI sudah otomatis dari @default di db
    const pendaftaran = await prisma.pendaftaran.create({
        data: {
            id_pengguna,
            tahun_ajaran: id_jadwal,
            ...(jalur_pendaftaran && { jalur_pendaftaran }),
        },
    });

    // Nomor Pendaftaran TIDAK digenerate di DRAFT. 
    // Nomor digenerate HANYA SAAT TERSUBMIT (lihat fungsi submitPendaftaran).
    return pendaftaran;
}




// UPDATE — Submit pendaftaran (DRAFT → SUBMITTED)
// ─────────────────────────────────────────────
export async function submitPendaftaran(id_pendaftaran) {
    const pendaftaran = await prisma.pendaftaran.findUnique({
        where: { id_pendaftaran: Number(id_pendaftaran) },
        include: {
            berkas_persyaratan: true,
            identitas_peserta_didik: true,
            jadwal_pmb: true,
            pengguna_pendaftaran_id_penggunaTopengguna: {
                select: { email: true, nama_lengkap: true }
            }
        },
    });

    if (!pendaftaran) {
        throw new Error(`Pendaftaran dengan ID ${id_pendaftaran} tidak ditemukan.`);
    }

    if (pendaftaran.status_pendaftaran !== "DRAFT") {
        throw new Error(`Pendaftaran sudah pernah disubmit sebelumnya.`);
    }

    if (!pendaftaran.identitas_peserta_didik) {
        throw new Error(`Identitas peserta didik belum diisi. Anda harus melengkapi formulir sebelum submit.`);
    }

    if (!pendaftaran.jadwal_pmb || !pendaftaran.jadwal_pmb.is_active || pendaftaran.jadwal_pmb.status_jadwal !== "DIBUKA") {
        throw new Error(`Pendaftaran gagal disubmit karena gelombang pendaftaran (Jadwal PMB) untuk sesi ini sudah ditutup atau tidak aktif.`);
    }

    // 1. Generate Nomor Pendaftaran karena user resmi MENSUBMIT dokumen
    const nomorPendaftaran = generateNomorPendaftaran(
        pendaftaran.jadwal_pmb.tahun_ajaran,
        pendaftaran.tahun_ajaran, // kolom pendaftaran.tahun_ajaran aslinya adalah ID jadwal (Int)
        pendaftaran.id_pendaftaran
    );

    // 2. Transisi perubahan status menjadi Final
    const updated = await prisma.pendaftaran.update({
        where: { id_pendaftaran: Number(id_pendaftaran) },
        data: {
            nomor_pendaftaran: nomorPendaftaran, // Sematkan nomor Registrasi
            status_pendaftaran: "SUBMITTED",
            status_verifikasi: "MENUNGGU_VERIFIKASI", // Bergerak dari BELUM_DIVERIFIKASI
            tanggal_submit: new Date(),
            diperbaharui_pada: new Date(),
        },
    });

    // 3. Kirim Notifikasi dan Email ke SEMUA ADMIN
    try {
        const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
        const namaSiswa = pendaftaran.identitas_peserta_didik?.nama_lengkap || 'Siswa Baru';

        const isResubmit = pendaftaran.status_verifikasi === 'PERLU_PERBAIKAN';
        const judulNotifAdmin = isResubmit ? "Perbaikan Pendaftaran Masuk" : "Pendaftaran Baru Masuk";
        const pesanNotifAdmin = isResubmit
            ? `Calon Siswa: ${namaSiswa} - ${nomorPendaftaran} telah mengirimkan perbaikan berkas. Segera verifikasi ulang.`
            : `Calon Siswa: ${namaSiswa} - ${nomorPendaftaran}. Segera verifikasi berkas.`;

        await Promise.all(admins.map(async (admin) => {
            // 3.a Buat notifikasi in-app
            await createNotifikasi({
                id_pengguna: admin.id_pengguna,
                judul: judulNotifAdmin,
                pesan: pesanNotifAdmin,
                kategori: "INFO",
                reference_id: pendaftaran.id_pendaftaran,
                reference_type: "PENDAFTARAN",
                tautan_aksi: `/admin/dashboard/verifikasi-pendaftaran`
            });

            // 3.b Kirim email notifikasi ke admin
            if (admin.email) {
                try {
                    console.log(`\n[EMAIL] Mencoba mengirim email notif pendaftaran ke Admin: ${admin.email}...`);
                    await sendNotificationEmail(admin.email, judulNotifAdmin, pesanNotifAdmin);
                    console.log(`[EMAIL] Sukses mengirim email ke: ${admin.email}\n`);
                } catch (emailErr) {
                    console.error(`[EMAIL ERROR] Gagal mengirim email ke Admin ${admin.email}:`, emailErr);
                }
            }
        }));
    } catch (err) {
        console.error("Gagal mengirim notif/email ke admin", err);
    }

    return updated;
}




// READ — Semua pendaftaran
// ─────────────────────────────────────────────
export async function getAllPendaftaran({
    tahun_ajaran,
    status_pendaftaran,
    status_verifikasi,
    jalur_pendaftaran,
    search,
    dateFrom,
    dateTo,
    urutan = "terbaru",
    page = 1,
    limit = 10,
} = {}) {
    const skip = (page - 1) * limit;

    let targetTahunAjaran = tahun_ajaran;

    // Jika filter tahun tidak diberikan eksplisit, proaktif deteksi jadwal teraktual
    if (!targetTahunAjaran || targetTahunAjaran === "" || targetTahunAjaran === "undefined") {
        let jadwalUtama = await prisma.jadwal_pmb.findFirst({
            where: { status_jadwal: "DIBUKA" }
        });

        // Fallback: Jika sedang off-season, tampilkan data dari tahun/jadwal terakhir
        if (!jadwalUtama) {
            jadwalUtama = await prisma.jadwal_pmb.findFirst({
                orderBy: { id_jadwal: "desc" }
            });
        }

        if (jadwalUtama) targetTahunAjaran = jadwalUtama.id_jadwal;
    }

    // Pastikan targetTahunAjaran adalah integer ID jika memungkinkan
    if (targetTahunAjaran && isNaN(Number(targetTahunAjaran))) {
        // Jika dikirim string "2024/2025", cari ID jadwalnya
        const jadwal = await prisma.jadwal_pmb.findFirst({
            where: { tahun_ajaran: String(targetTahunAjaran) }
        });
        if (jadwal) targetTahunAjaran = jadwal.id_jadwal;
    } else if (targetTahunAjaran) {
        targetTahunAjaran = Number(targetTahunAjaran);
    }

    // Membangun kondisi status pendaftaran.
    // Jika status_pendaftaran tidak dikirim secara spesifik, tampilkan:
    // 1. Yang sudah SUBMITTED
    // 2. ATAU yang kembali menjadi DRAFT karena status_verifikasi-nya PERLU_PERBAIKAN atau TOLAK
    const statusCondition = status_pendaftaran
        ? { status_pendaftaran }
        : {
            OR: [
                { status_pendaftaran: "SUBMITTED" },
                {
                    status_pendaftaran: "DRAFT",
                    status_verifikasi: {
                        in: ["PERLU_PERBAIKAN"]
                    }
                }
            ]
        };

    // Build the where clause
    const where = {
        ...(targetTahunAjaran && { tahun_ajaran: targetTahunAjaran }),
        ...statusCondition,
        ...(status_verifikasi && { status_verifikasi }),
        ...(jalur_pendaftaran && { jalur_pendaftaran }),
        // Search by name or registration number
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
        // Date range filtering
        ...((dateFrom || dateTo) && {
            tanggal_submit: {
                ...(dateFrom && { gte: new Date(`${dateFrom}T00:00:00Z`) }),
                ...(dateTo && { lte: new Date(`${dateTo}T23:59:59Z`) }),
            }
        })
    };

    // Sorting logic
    const orderBy = urutan === "terlama"
        ? { tanggal_submit: "asc" }
        : { tanggal_submit: "desc" };

    const [data, total] = await prisma.$transaction([
        prisma.pendaftaran.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                pengguna_pendaftaran_id_penggunaTopengguna: {
                    select: { id_pengguna: true, nama_lengkap: true, email: true },
                },
                identitas_peserta_didik: {
                    include: {
                        prestasi: true
                    }
                },
                berkas_persyaratan: true,
                pengumuman: true,
            },
        }),
        prisma.pendaftaran.count({ where }),
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
// READ — Pendaftaran by Nomor Pendaftaran (Smart Filter)
// ─────────────────────────────────────────────
export async function getPendaftaranByNomor(nomor_pendaftaran) {
    // 1. Dapatkan periode aktif yang berlaku di sistem saat ini 
    let jadwalUtama = await prisma.jadwal_pmb.findFirst({
        where: { status_jadwal: "DIBUKA" }
    });

    if (!jadwalUtama) {
        jadwalUtama = await prisma.jadwal_pmb.findFirst({
            orderBy: { id_jadwal: "desc" }
        });
    }

    // 2. Proteksi Query (Hanya menampilkan jika status SUBMITTED & Punya Jadwal Aktif)
    const pendaftaran = await prisma.pendaftaran.findFirst({
        where: {
            nomor_pendaftaran,
            status_pendaftaran: "SUBMITTED",
            ...(jadwalUtama && { tahun_ajaran: jadwalUtama.id_jadwal })
        },
        include: {
            identitas_peserta_didik: true,
            berkas_persyaratan: true,
            pengumuman: true,
        },
    });

    if (!pendaftaran) {
        throw new Error(`Data registrasi ${nomor_pendaftaran} tidak ditemukan pada gelombang aktif ini, atau statusnya belum SUBMITTED.`);
    }

    return pendaftaran;
}




// READ — Pendaftaran by ID
// ─────────────────────────────────────────────
export async function getPendaftaranById(id_pendaftaran) {
    const pendaftaran = await prisma.pendaftaran.findUnique({
        where: { id_pendaftaran: Number(id_pendaftaran) },
        include: {
            pengguna_pendaftaran_id_penggunaTopengguna: {
                select: { id_pengguna: true, nama_lengkap: true, email: true },
            },
            pengguna_pendaftaran_diverifikasi_olehTopengguna: {
                select: { id_pengguna: true, nama_lengkap: true },
            },
            identitas_peserta_didik: {
                include: {
                    ayah: {
                        include: {
                            pekerjaan: true,
                            pendidikan: true,
                            penghasilan_bulanan: true,
                            kebutuhan_khusus: true,
                        }
                    },
                    ibu: {
                        include: {
                            pekerjaan: true,
                            pendidikan: true,
                            penghasilan_bulanan: true,
                            kebutuhan_khusus: true,
                        }
                    },
                    wali: {
                        include: {
                            pekerjaan: true,
                            pendidikan: true,
                            penghasilan_bulanan: true,
                            kebutuhan_khusus: true,
                        }
                    },
                    periodik: true,
                    prestasi: true,
                    jenis_kelamin: true,
                    agama: true,
                    kebutuhan_khusus: true,
                    transportasi: true,
                    sekolah_asal: true,
                    jenis_tinggal: true,
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
                    },
                }
            },
            berkas_persyaratan: true,
            pengumuman: {
                include: {
                    daftar_ulang: true
                }
            },
        },
    });

    if (!pendaftaran) {
        throw new Error(`Pendaftaran dengan ID ${id_pendaftaran} tidak ditemukan.`);
    }

    return pendaftaran;
}


// READ — Pendaftaran by Pengguna 
// ─────────────────────────────────────────────
export async function getPendaftaranByPengguna(id_pengguna) {
    return prisma.pendaftaran.findMany({
        where: { id_pengguna: Number(id_pengguna) },
        orderBy: { tanggal_submit: "desc" },
        include: {
            identitas_peserta_didik: true,
            berkas_persyaratan: true,
            pengumuman: true,
        },
    });
}



// Hanya bisa diupdate jika masih DRAFT

export async function updatePendaftaran(id_pendaftaran, { jalur_pendaftaran, tahun_ajaran }) {
    const pendaftaran = await prisma.pendaftaran.findUnique({
        where: { id_pendaftaran: Number(id_pendaftaran) },
    });

    if (!pendaftaran) {
        throw new Error(`Pendaftaran dengan ID ${id_pendaftaran} tidak ditemukan.`);
    }

    if (pendaftaran.status_pendaftaran !== "DRAFT") {
        throw new Error(
            `Pendaftaran tidak dapat diubah karena statusnya adalah ${pendaftaran.status_pendaftaran}.`
        );
    }

    return prisma.pendaftaran.update({
        where: { id_pendaftaran: Number(id_pendaftaran) },
        data: {
            ...(jalur_pendaftaran && { jalur_pendaftaran }),
            ...(tahun_ajaran && { tahun_ajaran }),
            diperbaharui_pada: new Date(),
        },
    });
}




// UPDATE — Verifikasi pendaftaran oleh admin

export async function verifikasiPendaftaran(
    id_pendaftaran,
    { status_verifikasi, catatan, diverifikasi_oleh }
) {
    const pendaftaran = await prisma.pendaftaran.findUnique({
        where: { id_pendaftaran: Number(id_pendaftaran) },
        include: {
            pengguna_pendaftaran_id_penggunaTopengguna: {
                select: { email: true, nama_lengkap: true }
            }
        }
    });

    if (!pendaftaran) {
        throw new Error(`Pendaftaran dengan ID ${id_pendaftaran} tidak ditemukan.`);
    }

    if (pendaftaran.status_pendaftaran === "DRAFT") {
        throw new Error(`Pendaftaran masih DRAFT, belum dapat diverifikasi.`);
    }

    const validStatus = ["VERIFIKASI", "TOLAK", "PERLU_PERBAIKAN"];
    if (!validStatus.includes(status_verifikasi)) {
        throw new Error(
            `Status verifikasi tidak valid. Pilihan: ${validStatus.join(", ")}`
        );
    }

    const updated = await prisma.pendaftaran.update({
        where: { id_pendaftaran: Number(id_pendaftaran) },
        data: {
            status_verifikasi,
            catatan: catatan ?? null,
            diverifikasi_oleh: Number(diverifikasi_oleh),
            tanggal_verifikasi: new Date(),
            diperbaharui_pada: new Date(),

            // Jika perlu perbaikan, kembalikan status ke DRAFT agar terhitung di Dashboard
            // dan siswa bisa mengedit kembali form pendaftarannya.
            ...(status_verifikasi === "PERLU_PERBAIKAN" && {
                status_pendaftaran: "DRAFT"
            }),

            // 🚀 CLEAN CODE: Otomatis daftarkan anak ke tabel pengumuman 
            // jika statusnya dinyatakan lolos verifikasi berkas ("VERIFIKASI")
            ...(status_verifikasi === "VERIFIKASI" && {
                pengumuman: {
                    upsert: {
                        create: {
                            // Default Enum di MySQL
                            pengumuman_hasil_seleksi: "MENUNGGU_PENGUMUMAN",
                        },
                        update: {} // Abaikan jika datanya sudah pernah di-create sebelumnya
                    }
                }
            })
        },
    });

    // Kirim notifikasi ke USER pembuat pendaftaran
    try {
        let judul = "Status Pendaftaran Diperbarui";
        let pesan = `Pendaftaran Anda telah diupdate menjadi ${status_verifikasi}.`;
        let kategori = "INFO";

        if (status_verifikasi === 'VERIFIKASI') {
            judul = "Pendaftaran Diverifikasi";
            pesan = "Selamat! Berkas pendaftaran Anda telah dinyatakan VALID oleh panitia.";
            kategori = "SUCCESS";
        } else if (status_verifikasi === 'PERLU_PERBAIKAN') {
            judul = "Perbaikan Berkas";
            pesan = catatan || "";
            kategori = "WARNING";
        } else if (status_verifikasi === 'TOLAK') {
            judul = "Pendaftaran Ditolak";
            pesan = catatan || "";
            kategori = "ERROR";
        }

        await createNotifikasi({
            id_pengguna: pendaftaran.id_pengguna,
            judul,
            pesan,
            kategori,
            reference_id: pendaftaran.id_pendaftaran,
            reference_type: "PENDAFTARAN",
            tautan_aksi: "/user/dashboard/pendaftaran"
        });

        // Kirim email notifikasi ke calon siswa
        const userEmail = pendaftaran.pengguna_pendaftaran_id_penggunaTopengguna?.email;
        if (userEmail) {
            console.log(`\n[EMAIL] Mencoba mengirim email notifikasi ke: ${userEmail}...`);
            await sendNotificationEmail(userEmail, judul, pesan);
            console.log(`[EMAIL] Sukses mengirim email ke: ${userEmail}\n`);
        } else {
            console.log(`\n[EMAIL] Batal mengirim email: Data email pendaftar kosong.\n`);
        }
    } catch (err) {
        console.error("\n[EMAIL ERROR] Gagal mengirim notif ke user:", err, "\n");
    }

    return updated;
}




// DELETE — Hapus pendaftaran (hanya jika DRAFT)

export async function deletePendaftaran(id_pendaftaran) {
    const pendaftaran = await prisma.pendaftaran.findUnique({
        where: { id_pendaftaran: Number(id_pendaftaran) },
    });

    if (!pendaftaran) {
        throw new Error(`Pendaftaran dengan ID ${id_pendaftaran} tidak ditemukan.`);
    }

    if (pendaftaran.status_pendaftaran !== "DRAFT") {
        throw new Error(
            `Pendaftaran tidak dapat dihapus karena statusnya adalah ${pendaftaran.status_pendaftaran}. Hanya pendaftaran berstatus DRAFT yang dapat dihapus.`
        );
    }

    return prisma.pendaftaran.delete({
        where: { id_pendaftaran: Number(id_pendaftaran) },
    });
}




