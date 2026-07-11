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
        day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Makassar' 
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
    
    const formatDay = (d) => d.toLocaleDateString('id-ID', { day: '2-digit', timeZone: 'Asia/Makassar' });
    const formatMonthYear = (d) => d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric', timeZone: 'Asia/Makassar' });
    
    // Jika bulan dan tahun sama, format: "DD–DD Bulan YYYY"
    if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
        return `${formatDay(startDate)}–${formatDay(endDate)} ${formatMonthYear(endDate)}`;
    }
    
    // Fallback jika lintas bulan/tahun
    return `${formatDay(startDate)} ${formatMonthYear(startDate)} – ${formatDay(endDate)} ${formatMonthYear(endDate)}`;
}

/**
 * Menghitung sisa hari dari sekarang hingga tanggal target.
 * Perbandingan dilakukan per-hari (tengah malam → tengah malam) menggunakan 
 * zona waktu Asia/Makassar agar tidak terpengaruh oleh jam UTC server.
 * @param {Date|string} targetDate 
 * @returns {number|null}
 */
export function calculateRemainingDays(targetDate) {
    if (!targetDate) return null;

    // 1. Ambil YYYY-MM-DD dari target menggunakan zona waktu lokal (Asia/Makassar)
    // Ini menangani kasus dimana tanggal dari DB bergeser jamnya (contoh 16:00 UTC)
    const end = new Date(targetDate);
    const endStr = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Makassar',
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(end);
    const [endMonth, endDayStr, endYear] = endStr.split('/');
    const endMidnight = new Date(`${endYear}-${endMonth}-${endDayStr}T00:00:00.000Z`);

    // 2. Ambil YYYY-MM-DD hari ini berdasarkan zona waktu lokal (Asia/Makassar)
    const now = new Date();
    const nowStr = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Makassar',
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(now);
    const [nowMonth, nowDayStr, nowYear] = nowStr.split('/');
    const nowMidnight = new Date(`${nowYear}-${nowMonth}-${nowDayStr}T00:00:00.000Z`);

    const diffTime = endMidnight.getTime() - nowMidnight.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
}
