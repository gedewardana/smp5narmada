// ─────────────────────────────────────────────
// TIMEZONE HELPER (CLEAN CODE FIX)
// ─────────────────────────────────────────────
// Mengatasi masalah zona waktu antara Vercel/TiDB Cloud (UTC)
// dan waktu lokal pengguna (Asia/Makassar WITA UTC+8).
// ─────────────────────────────────────────────

const REAL_TIMEZONE = "Asia/Makassar";
const TIMEZONE_OFFSET = "+08:00"; // WITA adalah UTC+8 (Tidak ada DST)

export function getLocalDayBounds(dateObj) {
    // 1. Dapatkan tanggal bulan tahun dalam zona waktu lokal
    const tzDateStr = new Intl.DateTimeFormat('en-US', {
        timeZone: REAL_TIMEZONE,
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(dateObj);
    const [month, day, year] = tzDateStr.split('/');

    // 2. Buat batas awal (00:00) dan akhir (23:59) berdasar hari lokal
    // Dengan menyertakan offset lokal (+08:00), Date akan mengkonversinya 
    // menjadi UTC yang valid.
    // Contoh: 15 Juli 00:00 WITA akan terkonversi otomatis ke 14 Juli 16:00 UTC.
    // Sehingga query Prisma akan menangkap tanggal dengan 100% akurat.
    const start = new Date(`${year}-${month}-${day}T00:00:00.000${TIMEZONE_OFFSET}`);
    const end = new Date(`${year}-${month}-${day}T23:59:59.999${TIMEZONE_OFFSET}`);

    return { start, end };
}

export function getLocalYMD(dateObj) {
    // Ekstrak Tahun-Bulan-Hari ke dalam zona waktu pengguna (Bukan UTC)
    // Supaya 14 Juli jam 23:00 UTC tetap terbaca sebagai 15 Juli di Makassar
    const tzDateStr = new Intl.DateTimeFormat('en-US', {
        timeZone: REAL_TIMEZONE,
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(dateObj);
    const [month, day, year] = tzDateStr.split('/');
    return `${year}-${month}-${day}`;
}

export function getLocalDayMonth(dateObj) {
    // Format ke "15 Jul" dengan zona waktu pengguna
    return new Intl.DateTimeFormat('id-ID', {
        timeZone: REAL_TIMEZONE,
        day: '2-digit', month: 'short'
    }).format(dateObj);
}
