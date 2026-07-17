// model jadwal_pmb {
//   id_jadwal                 Int                               @id @default(autoincrement())
//   daya_tampung_murid        Int
//   status_jadwal             jadwal_pmb_status_jadwal          @default(BELUM_DIBUKA)
//   pendaftaran_mulai         DateTime                          @db.Date
//   pendaftaran_selesai       DateTime                          @db.Date
//   pengumuman                DateTime                          @db.Date
//   pendaftaran_ulang_mulai   DateTime                          @db.Date
//   pendaftaran_ulang_selesai DateTime                          @db.Date
//   masa_pengenalan_mulai     DateTime                          @db.Date
//   masa_pengenalan_selesai   DateTime                          @db.Date
//   dibuat_oleh               Int?
//   dibuat_pada               DateTime                          @default(now()) @db.Timestamp(0)
//   diperbaharui_pada         DateTime?                         @default(now()) @db.Timestamp(0)
//   tahun_ajaran              String                            @unique(map: "idx_jadwal_tahun") @db.VarChar(10)
//   mode_pendaftaran          jadwal_pmb_mode_pendaftaran       @default(ONLINE)
//   mode_pengumuman           jadwal_pmb_mode_pengumuman        @default(ONLINE)
//   mode_pendaftaran_ulang    jadwal_pmb_mode_pendaftaran_ulang @default(OFFLINE)
//   mode_pengenalan           jadwal_pmb_mode_pengenalan        @default(OFFLINE)
//   is_active                 Boolean
//   pengguna                  user?                             @relation(fields: [dibuat_oleh], references: [id_pengguna], onDelete: Restrict, map: "fk_id_pengguna")
//   pendaftaran               pendaftaran[]

//   @@index([dibuat_oleh], map: "idx_pengguna_panitia")
// }


import prisma from "@/lib/prisma";
import { getLocalYMD, getLocalDayBounds } from "@/utils/timezoneHelper";
// import { broadcastNotifikasi } from "@/services/notifikasi/notifikasiServices";

// Helper function to parse data
const parseJadwalData = (data) => {
    return {
        ...data,
        daya_tampung_murid: parseInt(data.daya_tampung_murid),
        pendaftaran_mulai: data.pendaftaran_mulai ? new Date(data.pendaftaran_mulai) : undefined,
        pendaftaran_selesai: data.pendaftaran_selesai ? new Date(data.pendaftaran_selesai) : undefined,
        pengumuman: data.pengumuman ? new Date(data.pengumuman) : undefined,
        pendaftaran_ulang_mulai: data.pendaftaran_ulang_mulai ? new Date(data.pendaftaran_ulang_mulai) : undefined,
        pendaftaran_ulang_selesai: data.pendaftaran_ulang_selesai ? new Date(data.pendaftaran_ulang_selesai) : undefined,
        masa_pengenalan_mulai: data.masa_pengenalan_mulai ? new Date(data.masa_pengenalan_mulai) : undefined,
        masa_pengenalan_selesai: data.masa_pengenalan_selesai ? new Date(data.masa_pengenalan_selesai) : undefined,
        diperbaharui_pada: new Date(),
    };
};


// CREATE
export async function createJadwal(data) {
    const parsedData = parseJadwalData(data);

    // Set is_active otomatis
    parsedData.is_active = parsedData.status_jadwal === "DIBUKA";

    // Validasi: hanya boleh satu jadwal aktif
    if (parsedData.status_jadwal === "DIBUKA") {
        const activeJadwal = await prisma.jadwal_pmb.findFirst({
            where: { is_active: true }
        });

        if (activeJadwal) {
            throw new Error(`Sudah ada jadwal aktif (Tahun Ajaran: ${activeJadwal.tahun_ajaran}). Tutup jadwal tersebut terlebih dahulu.`);
        }
    }

    // Remove diperbaharui_pada for create if you prefer, but it's optional
    delete parsedData.diperbaharui_pada;

    const jadwal = await prisma.jadwal_pmb.create({
        data: parsedData
    });
    return jadwal;
}

// READ — Semua jadwal dengan opsi filter
export async function getAllJadwal(filters = {}) {
    const { tahun_ajaran } = filters;
    const where = {};

    if (tahun_ajaran) {
        where.tahun_ajaran = tahun_ajaran;
    }

    const jadwalList = await prisma.jadwal_pmb.findMany({
        where,
        orderBy: { dibuat_pada: 'desc' }
    });
    return jadwalList;
}

// READ — Satu jadwal berdasarkan ID
export async function getJadwalById(id_jadwal) {
    return await prisma.jadwal_pmb.findUnique({
        where: { id_jadwal }
    });
}


// UPDATE
export async function updateJadwal(id_jadwal, data) {
    const parsedData = parseJadwalData(data);

    // Protect id if present in data
    if (parsedData.id_jadwal) delete parsedData.id_jadwal;

    // Set is_active otomatis
    parsedData.is_active = parsedData.status_jadwal === "DIBUKA";

    // Validasi: hanya boleh satu jadwal aktif (kecualikan jadwal ini sendiri)
    if (parsedData.status_jadwal === "DIBUKA") {
        const activeJadwal = await prisma.jadwal_pmb.findFirst({
            where: {
                is_active: true,
                id_jadwal: {
                    not: parseInt(id_jadwal)
                }
            }
        });

        if (activeJadwal) {
            throw new Error(`Sudah ada jadwal aktif (Tahun Ajaran: ${activeJadwal.tahun_ajaran}). Tutup jadwal tersebut terlebih dahulu.`);
        }
    }

    const jadwal = await prisma.jadwal_pmb.update({
        where: { id_jadwal: parseInt(id_jadwal) },
        data: parsedData
    });

    
    // try {
    //     await broadcastNotifikasi({
    //         role: "USER",
    //         judul: "Pembaruan Jadwal PMB",
    //         pesan: `Informasi Jadwal Penerimaan Murid Baru (PMB) untuk Tahun Ajaran ${jadwal.tahun_ajaran} telah diperbarui oleh Panitia. Silakan cek detailnya.`,
    //         kategori: "WARNING",
    //         tautan_aksi: "/user/dashboard"
    //     });
    // } catch (error) {
    //     console.error("Gagal mengirim notifikasi jadwal:", error);
    // }

    return jadwal;
}





// auto update jadwal
export async function autoUpdateJadwal() {
    // 🚀 CLEAN CODE: Gunakan batas hari berdasarkan zona waktu lokal sekolah
    // 'todayStart' akan menjadi T00:00:00.000Z yang mewakili hari ini secara lokal
    const { start: todayStart } = getLocalDayBounds(new Date());

    // 1. Tutup jadwal yang masa pendaftarannya sudah lewat (hari ini > pendaftaran_selesai)
    const closed = await prisma.jadwal_pmb.updateMany({
        where: {
            status_jadwal: "DIBUKA",
            pendaftaran_selesai: { lt: todayStart }
        },
        data: {
            status_jadwal: "DITUTUP",
            is_active: false
        }
    });

    // 2. Buka jadwal yang sudah memasuki masa pendaftaran
    // (hari ini >= pendaftaran_mulai, dan hari ini <= pendaftaran_selesai)
    const opened = await prisma.jadwal_pmb.updateMany({
        where: {
            status_jadwal: "BELUM_DIBUKA",
            pendaftaran_mulai: { lte: todayStart },
            pendaftaran_selesai: { gte: todayStart }
        },
        data: {
            status_jadwal: "DIBUKA",
            is_active: true
        }
    });

    return {
        closedCount: closed.count,
        openedCount: opened.count
    };
}






// logic untuk summary card
export function getJadwalSummary(data = []) {
    const totalJadwal = data.length;

    // Cari jadwal yang sedang DIBUKA atau jadwal terakhir jika tidak ada yang dibuka
    const activeJadwal = data.find(j => j.status_jadwal === 'DIBUKA');
    const latestJadwal = data.length > 0 ? data[0] : null;

    // Target kuota hanya dari jadwal yang sedang AKTIF (atau terbaru jika tidak ada yang dibuka)
    const activeCapacity = activeJadwal?.daya_tampung_murid || latestJadwal?.daya_tampung_murid || 0;

    // Hitung sisa hari pendaftaran jika ada jadwal yang dibuka
    let sisaHariLabel = 'Berakhir';
    let isWarning = false;

    if (activeJadwal && activeJadwal.pendaftaran_selesai) {
        // Ambil string 'YYYY-MM-DD' berdasarkan timezone lokal (WITA)
        const endDateStr = getLocalYMD(activeJadwal.pendaftaran_selesai);
        const todayStr = getLocalYMD(new Date());

        // Parse dengan "Z" agar membandingkan tepat di jam 00:00 UTC 
        // tanpa terpengaruh jam dari server (hanya membandingkan tanggalnya saja)
        const endDay = new Date(`${endDateStr}T00:00:00Z`);
        const nowDay = new Date(`${todayStr}T00:00:00Z`);

        const diffTime = endDay.getTime() - nowDay.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            sisaHariLabel = `${diffDays} Hari Lagi`;
            isWarning = diffDays <= 7; // Warning jika kurang dari seminggu
        } else if (diffDays === 0) {
            sisaHariLabel = 'Hari Terakhir';
            isWarning = true;
        }
    }

    return {
        total: totalJadwal,
        activeAcademicYear: activeJadwal?.tahun_ajaran || latestJadwal?.tahun_ajaran || '—',
        totalCapacity: activeCapacity,
        registrationCountdown: sisaHariLabel,
        isWarning
    };
}


// DELETE — Hapus jadwal
export async function deleteJadwal(id_jadwal) {
    // 1. Cek apakah ada pendaftaran yang terikat dengan jadwal ini
    const count = await prisma.pendaftaran.count({
        where: { tahun_ajaran: Number(id_jadwal) }
    });

    if (count > 0) {
        throw new Error(`Jadwal tidak dapat dihapus karena sudah ada ${count} data pendaftaran yang menggunakan tahun ajaran ini.`);
    }

    // 2. Eksekusi hapus
    const deleted = await prisma.jadwal_pmb.delete({
        where: { id_jadwal: Number(id_jadwal) }
    });

    return deleted;
}