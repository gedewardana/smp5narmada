// ─────────────────────────────────────────────
// TIMEZONE HELPER (CLEAN CODE FIX)
// ─────────────────────────────────────────────
// Mengatasi masalah "data kemarin masuk ke hari ini" yang sering terjadi
// karena perbedaan zona waktu antara Database/Server Hosting (Biasanya UTC +0) 
// dan Lokasi Pengguna (Misal WITA +8 atau WIB +7).
// ─────────────────────────────────────────────

const REAL_TIMEZONE = "Asia/Makassar"; // Sesuaikan zona lokasi aslinya

export function getLocalDayBounds(dateObj) {
    // 1. Ekstrak string tanggal berdasarkan zona waktu NYATA pengguna
    const tzDateStr = new Intl.DateTimeFormat('en-US', {
        timeZone: REAL_TIMEZONE,
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(dateObj);
    const [month, day, year] = tzDateStr.split('/');
    
    // 2. Prisma otomatis membungkus literal string MySQL sebagai UTC murni ('Z').
    // Oleh karena itu, kita paksa waktu query dari batas awal (00:00) ke batas akhir (23:59)
    // langsung menggunakan format 'Z' MURNI, AGAR prisma mengirim literal string yang 100% PERSIS ke MySQL.
    const start = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    const end = new Date(`${year}-${month}-${day}T23:59:59.999Z`);
    
    return { start, end };
}

export function getLocalYMD(dateObj) {
    // Karena Prisma mengkonversi otomatis timestamp MySQL (contoh: '2026-04-06 19:31:40')
    // menjadi JS Date dengan anggapan itu adalah UTC ('2026-04-06T19:31:40Z'),
    // Maka nilai tahun, bulan, harinya 100% TEPAT TERSIMPAN di komponen nilai UTC-nya!
    // Kita extrak "UTC" murni tanpa ditambahkan zona waktu lokal lagi (mencegah double-shift)
    const tzDateStr = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(dateObj);
    const [month, day, year] = tzDateStr.split('/');
    return `${year}-${month}-${day}`;
}

export function getLocalDayMonth(dateObj) {
    return new Intl.DateTimeFormat('id-ID', {
        timeZone: 'UTC',
        day: '2-digit', month: 'short'
    }).format(dateObj);
}
