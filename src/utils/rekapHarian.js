// ─────────────────────────────────────────────
// Perhitungan Rekap Data Harian (Non-Query / Fast Computation)
// Helper Murni (Pure Function) untuk mengkalkulasi puncak dan rata-rata
// ─────────────────────────────────────────────
export function getRekapHarian(jadwal, puncak, totalPendaftar, diterima) {
    // 1. Puncak Pendaftaran Tertinggi
    // 2. Menghitung Total Hari Pendaftaran (Durasi Pendaftaran)
    const start = new Date(jadwal.pendaftaran_mulai);
    const end = new Date(jadwal.pendaftaran_selesai);
    
    const diffTime = Math.abs(end - start);
    let totalHari = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    if (totalHari <= 0) totalHari = 1; 

    // 3. Rerata Harian (Target Daya Tampung per Hari)
    const dayaTampung = jadwal.daya_tampung_murid || 1;
    const rerataHarian = Math.round(dayaTampung / totalHari);

    // 4. Kalkulasi Kapasitas & Persentase (Membersihkan Komponen UI Frontend)
    const sisaKursi = Math.max(0, dayaTampung - (diterima || 0));
    const persentasePeminat = Math.round(((totalPendaftar || 0) / dayaTampung) * 100);
    const tingkatDiterima = Number((((diterima || 0) / (totalPendaftar || 1)) * 100).toFixed(1));

    return {
        puncakPendaftaran: puncak.pendaftar,
        tanggalPuncak: puncak.date,
        rerataHarian,
        totalHari,
        sisaKursi,
        persentasePeminat,
        tingkatDiterima
    };
}
