import useSWR from 'swr'

// Fetcher standard anti-fail
const fetcher = async (url) => {
    const res = await fetch(url)
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Terjadi kesalahan saat mengambil data pengumuman');
    }
    return res.json()
}

/**
 * Custom hook SWR untuk mengambil daftar pengumuman 
 * Clean Code: Digunakan di halaman List Pengumuman dengan flattening relasi Prisma
 * 
 * @param {Object} filters - Objek berisi filter pencarian (page, limit, pengumuman_hasil_seleksi, dll)
 */
export function usePengumuman(filters = {}) {
    // Membangun URL Search Params dinamis
    const searchParams = new URLSearchParams()
    
    // Auto-ignore filter bertipe null/undefined
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value)
        }
    })

    const queryString = searchParams.toString()
    const url = `/api/pengumuman${queryString ? `?${queryString}` : ''}`

    const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
        keepPreviousData: true, // Biar pas pindah halaman paginasi UX tidak nge-blink/loading kasar
    })

    // Clean Code: Data Flattening (Meratakan Objek Prisma Bersarang)
    const processedData = data?.data?.map(item => ({
        ...item, 
        // Mengeluarkan identitas anak keluar agar UI Komponen tidak pusing baca objek bersarang
        nama_lengkap: item.pendaftaran?.identitas_peserta_didik?.nama_lengkap || 'Tanpa Nama',
        nomor_pendaftaran: item.pendaftaran?.nomor_pendaftaran || '-',
        jalur_pendaftaran: item.pendaftaran?.jalur_pendaftaran || '-',
        asal_sekolah: item.pendaftaran?.identitas_peserta_didik?.sekolah_asal || '-',
        // Nama admin yang mendikte pengumuman
        diumumkan_oleh_nama: item.pengguna?.nama_lengkap || '-',
    })) || []

    return {
        data: processedData,
        pagination: data?.meta || null,
        error: error || (data?.success === false ? data.message : null),
        isLoading,
        mutate
    }
}