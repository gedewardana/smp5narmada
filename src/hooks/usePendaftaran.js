
// Hook ini secara otomatis menyiapkan kerangka URL Search Params dinamis jika nanti Anda mau memfilter data berdasarkan tahun pelajaran, status kelulusan, limit halaman, dan lain-lain.

import useSWR from 'swr'

// Fetcher untuk mengambil data JSON dari API
const fetcher = async (url) => {
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error('Terjadi kesalahan saat mengambil data pendaftaran')
    }
    return res.json()
}

/**
 * Custom hook SWR untuk mengambil daftar pendaftaran
 * Ekstraksi ke hook terpisah agar clean code & dapat digunakan ulang (reusable).
 * 
 * @param {Object} filters - Objek berisi filter pencarian (page, limit, status_verifikasi, dll)
 */
export function usePendaftaran(filters = {}) {
    // Membangun URL dengan query string dari objek filters
    const searchParams = new URLSearchParams()
    
    // Hanya memuat filter yang memiliki nilai (tidak undefined/null)
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value)
        }
    })

    const queryString = searchParams.toString()
    const url = `/api/pendaftaran${queryString ? `?${queryString}` : ''}`

    const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
        keepPreviousData: true,
    })

    // Clean Code: Transformasi data untuk mempermudah akses di komponen UI
    const processedData = data?.data?.map(item => ({
        ...item,
        // Flatten nama_lengkap dari relasi Prisma yang panjang
        nama_lengkap: item.pengguna_pendaftaran_id_penggunaTopengguna?.nama_lengkap || 'Tanpa Nama',
        email_pendaftar: item.pengguna_pendaftaran_id_penggunaTopengguna?.email || '',
    })) || []

    return {
        data: processedData,
        pagination: data?.meta || null,
        error,
        isLoading,
        mutate
    }
}
