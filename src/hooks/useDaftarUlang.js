import useSWR from 'swr'

// Fetcher standard anti-fail
const fetcher = async (url) => {
    const res = await fetch(url)
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Terjadi kesalahan saat mengambil data daftar ulang');
    }
    return res.json()
}

/**
 * Custom hook SWR untuk mengambil daftar ulang 
 * Menggunakan Clean Code Pattern: Mengisolasi parameter dan meratakan Data Bersarang
 * 
 * @param {Object} filters - Objek berisi filter pencarian (page, limit, search, status_daftar_ulang)
 */
export function useDaftarUlang(filters = {}) {
    // Membangun URL Search Params dinamis
    const searchParams = new URLSearchParams()
    
    // Auto-ignore filter bertipe null/undefined/string kosong
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value)
        }
    })

    const queryString = searchParams.toString()
    const url = `/api/daftarulang${queryString ? `?${queryString}` : ''}`

    const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
        keepPreviousData: true, // Biar pas pindah halaman UX tidak berkedip
    })

    // Clean Code: Data Flattening (Meratakan Objek Prisma Bersarang)
    const processedData = data?.data?.map(item => ({
        ...item, 
        // Mengeluarkan properti dalam ke luar, sehingga komponen tabel di UI sangat mudah membacanya
        nama_lengkap: item.pengumuman?.pendaftaran?.identitas_peserta_didik?.nama_lengkap || 'Tanpa Nama',
        id_pendaftaran: item.pengumuman?.pendaftaran?.id_pendaftaran,
        nomor_pendaftaran: item.pengumuman?.pendaftaran?.nomor_pendaftaran || '-',
        asal_sekolah: item.pengumuman?.pendaftaran?.identitas_peserta_didik?.sekolah_asal || '-',
        // Nama admin yang melayani daftar ulang siswa
        diinput_oleh_nama: item.pengguna?.nama_lengkap || '-',
    })) || []

    return {
        data: processedData,
        pagination: data?.meta || null,
        error: error || (data?.success === false ? data.message : null),
        isLoading,
        mutate
    }
}
