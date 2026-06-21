/**
 * dateUtils.js — Kumpulan helper untuk memproses tanggal pendaftaran
 */

/**
 * Memformat tanggal tunggal (Contoh: "10 Juli 2025")
 * @param {Date|string} date 
 * @returns {string}
 */
export function formatSingleDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString('id-ID', { 
        day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' 
    });
}

/**
 * Memformat rentang tanggal (Contoh: "05–10 Juli 2025")
 * @param {Date|string} start 
 * @param {Date|string} end 
 * @returns {string}
 */
export function formatDateRange(start, end) {
    if (!start || !end) return "-";
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const formatDay = (d) => d.toLocaleDateString('id-ID', { day: '2-digit', timeZone: 'UTC' });
    const formatMonthYear = (d) => d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    
    // Jika bulan dan tahun sama, format: "DD–DD Bulan YYYY"
    if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
        return `${formatDay(startDate)}–${formatDay(endDate)} ${formatMonthYear(endDate)}`;
    }
    
    // Fallback jika lintas bulan/tahun
    return `${formatDay(startDate)} ${formatMonthYear(startDate)} – ${formatDay(endDate)} ${formatMonthYear(endDate)}`;
}

/**
 * Menghitung sisa hari dari sekarang hingga tanggal target.
 * Perbandingan dilakukan per-hari (tengah malam → tengah malam) agar tidak terpengaruh
 * oleh jam saat fungsi dipanggil (misal jam 23:50 tidak dianggap sudah besok).
 * @param {Date|string} targetDate 
 * @returns {number|null}
 */
export function calculateRemainingDays(targetDate) {
    if (!targetDate) return null;

    // Prisma @db.Date disimpan sebagai T00:00:00.000Z (UTC midnight).
    // Kita ekstrak string YYYY-MM-DD lalu buat objek Date midnight lokal agar apple-to-apple.
    const end = new Date(targetDate);
    const endDateStr = end.toLocaleDateString('en-CA', { timeZone: 'UTC' }); // "YYYY-MM-DD"
    const endDay = new Date(`${endDateStr}T00:00:00`); // midnight waktu lokal server/browser

    const nowDay = new Date();
    nowDay.setHours(0, 0, 0, 0); // midnight waktu lokal hari ini

    const diffTime = endDay.getTime() - nowDay.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
}
