import useSWR from 'swr'

// Fetcher function untuk mengambil data JSON dari API
const fetcher = async (url) => {
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error('Terjadi kesalahan saat mengambil data dashboard')
    }
    const json = await res.json()
    console.log("=== SWR DASHBOARD FETCHER RESPONSE ===", json)
    return json
}

// Custom hook SWR untuk Dashboard Admin
export function useDashboardData(filters = {}) {
    // Membangun URL dengan query string dari objek filters
    const searchParams = new URLSearchParams()
    
    // Hanya memuat filter yang memiliki nilai (tidak undefined/null)
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value)
        }
    })

    const queryString = searchParams.toString()
    const url = `/api/admin/dashboard${queryString ? `?${queryString}` : ''}`

    const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
        // Konfigurasi opsional (sesuaikan dengan kebutuhan):
        // refreshInterval: 60000, 
        // revalidateOnFocus: true, 
    })

    return {
        data,
        error,
        isLoading,
        mutate // Bisa dipakai kalau ingin paksa refresh data secara manual
    }
}
