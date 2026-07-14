import prisma from "@/lib/prisma";
import { calculateRemainingDays, formatDateRange } from "@/utils/dateUtils";

// ─────────────────────────────────────────────
// READ — Data StatsCard untuk Dashboard User
// Mengambil data pendaftaran milik user yang login
// ─────────────────────────────────────────────
export async function getUserDashboardData(id_pengguna) {
    // 1. Ambil data pendaftaran milik user ini (yang paling baru) beserta jadwalnya
    const pendaftaran = await prisma.pendaftaran.findFirst({
        where: { id_pengguna: Number(id_pengguna) },
        orderBy: { id_pendaftaran: "desc" },
        select: {
            id_pendaftaran: true,
            nomor_pendaftaran: true,
            status_pendaftaran: true,
            jalur_pendaftaran: true,
            status_verifikasi: true,
            tanggal_submit: true,
            tanggal_verifikasi: true,
            catatan: true,
            // Ambil info sekolah asal dan nama untuk ditampilkan di dashboard
            identitas_peserta_didik: {
                select: {
                    nama_lengkap: true,
                    nilai_skhu: true,
                    jenis_kelamin: {
                        select: { nama: true }
                    },
                    sekolah_asal: {
                        select: { nama_sekolah: true }
                    }
                }
            },
            // Ambil seluruh data jadwal yang bersangkutan dengan pendaftaran ini
            jadwal_pmb: true,
            // Ambil status pengumuman_hasil_seleksi jika sudah ada
            pengumuman: {
                select: {
                    pengumuman_hasil_seleksi: true,
                }
            }
        }
    });

    // 2. Tentukan jadwal mana yang akan menjadi acuan (jadwal_aktif)
    let jadwalAktif;
    if (pendaftaran && pendaftaran.jadwal_pmb) {
        // Jika user sudah punya pendaftaran, abaikan jadwal global is_active = true.
        // Gunakan jadwal dari pendaftaran miliknya agar dashboard sesuai dengan data historisnya.
        jadwalAktif = pendaftaran.jadwal_pmb;
    } else {
        // Jika user belum mendaftar, ambil jadwal PMB yang saat ini sedang buka (is_active = true)
        jadwalAktif = await prisma.jadwal_pmb.findFirst({
            where: { is_active: true }
        });

        // Fallback jika tidak ada jadwal aktif sama sekali
        if (!jadwalAktif) {
            jadwalAktif = await prisma.jadwal_pmb.findFirst({
                orderBy: { id_jadwal: 'desc' }
            });
        }
    }

    // 3. Jika belum ada pendaftaran sama sekali, kembalikan data kosong / default
    if (!pendaftaran) {
        const sisaHariFallback = jadwalAktif ? calculateRemainingDays(jadwalAktif.pendaftaran_selesai) : null;

        return {
            status_pendaftaran: "-",
            jalur_pendaftaran: "-",
            status_verifikasi: "-",
            sisa_hari: sisaHariFallback,
            tahun_ajaran: jadwalAktif ? jadwalAktif.tahun_ajaran : "-",
            pendaftaran_range: jadwalAktif ? formatDateRange(jadwalAktif.pendaftaran_mulai, jadwalAktif.pendaftaran_selesai) : "-",
            pengumuman_date: jadwalAktif && jadwalAktif.pengumuman 
                ? new Date(jadwalAktif.pengumuman).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) 
                : "-",
            daftar_ulang_range: jadwalAktif ? formatDateRange(jadwalAktif.pendaftaran_ulang_mulai, jadwalAktif.pendaftaran_ulang_selesai) : "-",
            jadwal_aktif: jadwalAktif,
        };
    }

    // 4. Hitung Sisa Hari Pendaftaran (Clean Code: Move to Utils)
    const sisaHari = calculateRemainingDays(pendaftaran.jadwal_pmb?.pendaftaran_selesai);

    // 5. Format enum menjadi label yang ramah untuk UI
    const labelStatus = {
        DRAFT: "Belum Mendaftar",
        SUBMITTED: "Terkirim",
    };

    const labelVerifikasi = {
        BELUM_DIVERIFIKASI: "Belum Diverifikasi",
        MENUNGGU_VERIFIKASI: "Menunggu Diverifikasi",
        VERIFIKASI: "Diverifikasi",
        TOLAK: "Ditolak",
        PERLU_PERBAIKAN: "Perlu Perbaikan",
    };

    const labelJalur = {
        ZONASI: "Zonasi",
    };

    return {
        status_pendaftaran: labelStatus[pendaftaran.status_pendaftaran] ?? pendaftaran.status_pendaftaran,
        jalur_pendaftaran: labelJalur[pendaftaran.jalur_pendaftaran] ?? pendaftaran.jalur_pendaftaran,
        status_verifikasi: labelVerifikasi[pendaftaran.status_verifikasi] ?? pendaftaran.status_verifikasi,
        sisa_hari: sisaHari,
        tahun_ajaran: pendaftaran.jadwal_pmb?.tahun_ajaran ?? null,
        nama_lengkap: pendaftaran.identitas_peserta_didik?.nama_lengkap ?? "-",
        jenis_kelamin: pendaftaran.identitas_peserta_didik?.jenis_kelamin?.nama ?? "-",
        nomor_pendaftaran: pendaftaran.nomor_pendaftaran ?? "-",
        nama_sekolah: pendaftaran.identitas_peserta_didik?.sekolah_asal?.nama_sekolah ?? "-",
        nilai_skhu: pendaftaran.identitas_peserta_didik?.nilai_skhu ?? "-",
        
        // Info Jadwal (untuk ProgressStepper)
        pendaftaran_range: formatDateRange(
            pendaftaran.jadwal_pmb?.pendaftaran_mulai, 
            pendaftaran.jadwal_pmb?.pendaftaran_selesai
        ),
        pengumuman_date: pendaftaran.jadwal_pmb?.pengumuman 
            ? new Date(pendaftaran.jadwal_pmb.pengumuman).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
            : "-",
            
        // Info Jadwal Daftar Ulang (Clean Code: Move to Utils)
        daftar_ulang_range: formatDateRange(
            pendaftaran.jadwal_pmb?.pendaftaran_ulang_mulai, 
            pendaftaran.jadwal_pmb?.pendaftaran_ulang_selesai
        ),

        // Raw value (untuk logic kondisi di komponen jika diperlukan)
        raw: {
            id_pendaftaran: pendaftaran.id_pendaftaran,
            status_pendaftaran: pendaftaran.status_pendaftaran,
            status_verifikasi: pendaftaran.status_verifikasi,
            tanggal_submit: pendaftaran.tanggal_submit,
            tanggal_verifikasi: pendaftaran.tanggal_verifikasi,
            catatan: pendaftaran.catatan,
            pengumuman_hasil_seleksi: pendaftaran.pengumuman?.pengumuman_hasil_seleksi,
        },
        
        jadwal_aktif: jadwalAktif,
    };
}
