import prisma from "@/lib/prisma"
import { getLocalDayBounds, getLocalYMD, getLocalDayMonth } from "@/utils/timezoneHelper"


export async function DashboardData(tahun_ajaran = null) {
    // 🚀 CLEAN CODE: Dapatkan batas 00:00 s/d 23:59 HARI INI sesuai waktu lokal sekolah (Bukan UTC Server)
    const { start: todayStart, end: todayEnd } = getLocalDayBounds(new Date())

    let jadwal;

    if (tahun_ajaran) {
        // Pastikan ID berupa angka jika dikirim sebagai string dari URL
        const targetId = Number(tahun_ajaran);

        jadwal = await prisma.jadwal_pmb.findUnique({
            where: { id_jadwal: targetId }
        })
    } else {
        jadwal = await prisma.jadwal_pmb.findFirst({
            where: { status_jadwal: "DIBUKA" }
        })

        // BEST PRACTICE: Jika tidak ada jadwal yang DIBUKA (sedang tutup/off-season),
        // maka ambil jadwal terakhir yang pernah dibuat.
        if (!jadwal) {
            jadwal = await prisma.jadwal_pmb.findFirst({
                orderBy: { id_jadwal: "desc" }
            })
        }
    }

    // Jika database benar-benar kosong (belum pernah buat jadwal sama sekali)
    if (!jadwal) return null

    const baseWhere = {
        tahun_ajaran: jadwal.id_jadwal,
        status_pendaftaran: "SUBMITTED"
    }

    // 🚀 jalankan paralel (lebih cepat)
    const [total, hariIni, DITERIMA, LAKILAKI, PEREMPUAN] = await Promise.all([
        prisma.pendaftaran.count({ where: baseWhere }),

        prisma.pendaftaran.count({
            where: {
                ...baseWhere,
                tanggal_submit: {
                    gte: todayStart,
                    lte: todayEnd
                }
            }
        }),

        prisma.pendaftaran.count({
            where: {
                ...baseWhere,
                pengumuman: {
                    pengumuman_hasil_seleksi: "DITERIMA"
                }
            }
        }),

        prisma.pendaftaran.count({
            where: {
                ...baseWhere,
                identitas_peserta_didik: {
                    jenis_kelamin: { nama: "LAKI-LAKI" }
                }
            }
        }),

        prisma.pendaftaran.count({
            where: {
                ...baseWhere,
                identitas_peserta_didik: {
                    jenis_kelamin: { nama: "PEREMPUAN" }
                }
            }
        })
    ])

    return {
        jadwal,
        tahun_ajaran: jadwal.tahun_ajaran,
        daya_tampung: jadwal.daya_tampung_murid,
        total_pendaftar: total,
        hari_ini: hariIni,
        diterima: DITERIMA,
        laki_laki: LAKILAKI,
        perempuan: PEREMPUAN
    }
}

// get daily chart
export async function getDailyChart(jadwal) {
    // 🚀 CLEAN CODE: Pastikan start dan end dihitung dari batas waktu yang benar di timezone lokal
    const { start } = getLocalDayBounds(new Date(jadwal.pendaftaran_mulai));
    const { end } = getLocalDayBounds(new Date(jadwal.pendaftaran_selesai));

    // 🚀 ambil semua data SEKALI
    const data = await prisma.pendaftaran.findMany({
        where: {
            tahun_ajaran: jadwal.id_jadwal,
            status_pendaftaran: 'SUBMITTED', // Hanya hitung yang sudah benar-benar mendaftar
            tanggal_submit: {
                gte: start,
                lte: end
            }
        },
        select: {
            tanggal_submit: true,
            identitas_peserta_didik: {
                select: {
                    jenis_kelamin: {
                        select: { nama: true }
                    }
                }
            },
            pengumuman: {
                select: { pengumuman_hasil_seleksi: true }
            }
        }
    })

    // group manual di JS
    const map = {}

    for (const item of data) {
        // CLEAN CODE: Hindari bug UTC! Ekstrak YMD menggunakan formatter timezone yang dipaksa
        const dateKey = getLocalYMD(item.tanggal_submit)

        if (!map[dateKey]) {
            map[dateKey] = {
                date: getLocalDayMonth(item.tanggal_submit),
                pendaftar: 0,
                L: 0,
                P: 0,
                diterimaL: 0,
                diterimaP: 0
            }
        }

        map[dateKey].pendaftar++

        const jk = item.identitas_peserta_didik?.jenis_kelamin?.nama
        const isDiterima = item.pengumuman?.pengumuman_hasil_seleksi === "DITERIMA"

        if (jk === "LAKI-LAKI") {
            map[dateKey].L++
            if (isDiterima) map[dateKey].diterimaL++
        }
        if (jk === "PEREMPUAN") {
            map[dateKey].P++
            if (isDiterima) map[dateKey].diterimaP++
        }
    }

    // Mengisi array hari di antara "start" sampai "end"
    // Tidak memakai date-fns agar format aman karena semuanya adalah pure "Z"
    const result = [];
    let currentMs = start.getTime(); // dijamin setara jam 00:00:00Z sesuai batas
    const endMs = end.getTime();

    // CLEAN CODE: Mencari puncak pendaftaran dalam 1 kali putaran (O(N)) bersama pembuatan chart
    let puncak = { date: '-', pendaftar: 0 };

    while (currentMs <= endMs) {
        const currentDay = new Date(currentMs);
        const key = getLocalYMD(currentDay);

        const existing = map[key] || {
            pendaftar: 0,
            L: 0,
            P: 0,
            diterimaL: 0,
            diterimaP: 0
        };

        const dayData = {
            ...existing,
            date: existing.date || getLocalDayMonth(currentDay),
            fullDate: key,
            tgl: currentDay.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            pendaftarL: existing.L,
            pendaftarP: existing.P
        };

        if (dayData.pendaftar > puncak.pendaftar) {
            puncak = dayData;
        }

        result.push(dayData);

        // Loop melompat persis 24 jam ke hari berikutnya
        currentMs += 24 * 60 * 60 * 1000;
    }

    return { chartData: result, puncak };
}

// Line Chart
let cache = null
let lastFetch = 0

export async function getYearlyChart() {
    const now = Date.now()

    if (cache && now - lastFetch < 60000) {
        return cache
    }

    // 🚀 CLEAN CODE: Gunakan 'groupBy' agar Database yang menghitung, bukan RAM Server (O(1) Data Transfer)
    // Ingat: 'tahun_ajaran' di tabel Pendaftaran adalah Foreign Key yang merujuk ke 'id_jadwal'
    const groupedData = await prisma.pendaftaran.groupBy({
        by: ['tahun_ajaran'],
        where: {
            status_pendaftaran: 'SUBMITTED', // Hanya hitung yang sudah benar-benar mendaftar
        },
        _count: { _all: true }
    })

    // Ambil string tahun ajaran dari tabel jadwal berdasarkan ID yang didapat
    const jadwalIds = groupedData.map(g => g.tahun_ajaran)

    const jadwalList = await prisma.jadwal_pmb.findMany({
        where: { id_jadwal: { in: jadwalIds } },
        select: { id_jadwal: true, tahun_ajaran: true }
    })

    // Buat kamus (dictionary) untuk mapping ID Jadwal -> String Tahun Ajaran
    const jadwalMap = jadwalList.reduce((acc, j) => {
        acc[j.id_jadwal] = j.tahun_ajaran
        return acc
    }, {})

    // Format menjadi array untuk UI Line Chart
    cache = groupedData.map(g => ({
        year: jadwalMap[g.tahun_ajaran] || "Tidak Diketahui",
        pendaftar: g._count._all
    }))

    // Mengurutkan dari tahun terlama ke terbaru (Ascending) agar grafik mengarah ke kanan dengan benar
    cache.sort((a, b) => a.year.localeCompare(b.year))

    lastFetch = now
    return cache
}



// ─────────────────────────────────────────────
// READ — Statistik Ringkasan Verifikasi menu pendaftaran
// Menghitung rekap (Dashboard Summary) berdasarkan status_verifikasi secara efisien
// ─────────────────────────────────────────────
export async function getStatsPendaftaran(tahun_ajaran = null) {
    let targetTahun = tahun_ajaran;

    // Auto-fallback deteksi jadwal yang sedang berjalan
    if (!targetTahun) {
        let jadwalUtama = await prisma.jadwal_pmb.findFirst({
            where: { status_jadwal: "DIBUKA" }
        });

        if (!jadwalUtama) {
            jadwalUtama = await prisma.jadwal_pmb.findFirst({
                orderBy: { id_jadwal: "desc" }
            });
        }

        if (jadwalUtama) targetTahun = jadwalUtama.id_jadwal;
    }

    const where = {
        ...(targetTahun && { tahun_ajaran: targetTahun }),
        status_pendaftaran: "SUBMITTED" // Hanya hitung yang sudah resmi mendaftar
    };

    // Clean Code: Lakukan Grouping database 1 kali (sangat efisien & hemat resource)
    // Hindari melakukan query count() 5 kali secara terpisah.
    const groupedData = await prisma.pendaftaran.groupBy({
        by: ['status_verifikasi'],
        where,
        _count: { _all: true }
    });

    const totalSubmitted = await prisma.pendaftaran.count({ where });

    // Format struktur kembalian agar persis sama dengan konsumsi CardSummaryPendaftaran.jsx UI kita
    const stats = {
        total: totalSubmitted,
        menunggu: 0,
        diverifikasi: 0,
        perluPerbaikan: 0,
        ditolak: 0
    };

    groupedData.forEach((item) => {
        const count = item._count._all;

        switch (item.status_verifikasi) {
            case 'MENUNGGU_VERIFIKASI':
                stats.menunggu = count;
                break;
            case 'VERIFIKASI':
            case 'TERVERIFIKASI':
                stats.diverifikasi += count;
                break;
            case 'PERLU_PERBAIKAN':
            case 'MEMBUTUHKAN_PERBAIKAN':
                stats.perluPerbaikan += count;
                break;
            case 'TOLAK':
            case 'DITOLAK':
                stats.ditolak += count;
                break;
        }
    });

    return stats;
}


// ─────────────────────────────────────────────
// READ — Statistik Ringkasan Pengumuman
// Menghitung rekap (Dashboard) berdasarkan pengumuman_hasil_seleksi
// ─────────────────────────────────────────────
export async function getStatsPengumuman(tahun_ajaran = null) {
    let targetTahun = tahun_ajaran;

    // Auto-fallback deteksi jadwal yang sedang berjalan
    if (!targetTahun) {
        let jadwalUtama = await prisma.jadwal_pmb.findFirst({
            where: { status_jadwal: "DIBUKA" }
        });

        if (!jadwalUtama) {
            jadwalUtama = await prisma.jadwal_pmb.findFirst({
                orderBy: { id_jadwal: "desc" }
            });
        }

        if (jadwalUtama) targetTahun = jadwalUtama.id_jadwal;
    }

    // Filter pada tabel join (pendaftaran.tahun_ajaran + status_verifikasi)
    // Catatan: prisma.groupBy() tidak support filter nested relation,
    // sehingga pakai findMany + manual group count.
    const where = {
        pendaftaran: {
            status_verifikasi: 'VERIFIKASI', // sinkron dengan getAllPengumuman
            ...(targetTahun && { tahun_ajaran: targetTahun }),
        }
    };

    // Ambil semua pengumuman yang lolos filter (hanya field yang dibutuhkan)
    const rows = await prisma.pengumuman.findMany({
        where,
        select: { pengumuman_hasil_seleksi: true }
    });

    // Manual grouping di memori (rows jumlahnya terbatas per jadwal)
    const stats = {
        total: rows.length,
        menunggu: 0,
        diterima: 0,
        tidakDiterima: 0
    };

    rows.forEach(({ pengumuman_hasil_seleksi }) => {
        switch (pengumuman_hasil_seleksi) {
            case 'MENUNGGU_PENGUMUMAN':
            case 'MENUNGGU':
                stats.menunggu++;
                break;
            case 'DITERIMA':
                stats.diterima++;
                break;
            case 'TIDAK_DITERIMA':
                stats.tidakDiterima++;
                break;
        }
    });

    return stats;
}

// ─────────────────────────────────────────────
// READ — Statistik Ringkasan Daftar Ulang
// Menghitung rekap berdasarkan status_daftar_ulang
// ─────────────────────────────────────────────
export async function getStatsDaftarUlang(tahun_ajaran = null) {
    let targetTahun = tahun_ajaran;

    // Auto-fallback deteksi jadwal yang sedang berjalan
    if (!targetTahun) {
        let jadwalUtama = await prisma.jadwal_pmb.findFirst({
            where: { status_jadwal: "DIBUKA" }
        });

        if (!jadwalUtama) {
            jadwalUtama = await prisma.jadwal_pmb.findFirst({
                orderBy: { id_jadwal: "desc" }
            });
        }

        if (jadwalUtama) targetTahun = jadwalUtama.id_jadwal;
    }

    // Filter berantai: hanya ambil daftar ulang yang pengumuman-nya DITERIMA
    // Catatan: prisma.groupBy() tidak support filter nested relation dengan baik,
    // sehingga pakai findMany + manual group count (sama seperti stats pengumuman).
    const where = {
        pengumuman: {
            pengumuman_hasil_seleksi: 'DITERIMA', // sinkron dengan getAllDaftarUlang
            ...(targetTahun && {
                pendaftaran: {
                    tahun_ajaran: targetTahun
                }
            })
        }
    };

    // Ambil semua daftar ulang yang lolos filter (hanya field status_daftar_ulang yang diambil)
    const rows = await prisma.daftar_ulang.findMany({
        where,
        select: { status_daftar_ulang: true }
    });

    // Manual grouping di memori
    const stats = {
        total: rows.length,
        belum: 0,
        sudah: 0,
        mengundurkanDiri: 0
    };

    rows.forEach(({ status_daftar_ulang }) => {
        switch (status_daftar_ulang) {
            case 'BELUM':
                stats.belum++;
                break;
            case 'SUDAH':
                stats.sudah++;
                break;
            case 'MENGUNDURKAN_DIRI':
                stats.mengundurkanDiri++;
                break;
        }
    });

    return stats;
}
