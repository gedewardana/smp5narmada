import useSWR from 'swr'

/**
 * Hook untuk mengambil data pengumuman berdasarkan ID
 * @param {string|number} id - Bisa ID Pengumuman atau ID Pendaftaran
 * @param {string} type - 'pendaftaran' atau null
 */
export function usePengumumanID(id, type = null) {
    const fetcher = (url) => fetch(url).then((res) => res.json())

    // Generate URL based on params
    const url = id 
        ? `/api/pengumuman/${id}${type ? `?type=${type}` : ''}` 
        : null

    const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
        revalidateOnFocus: true,
        shouldRetryOnError: false
    })

    return {
        pengumuman: data?.data || null,
        isLoading,
        isError: error || (data && !data.success),
        mutate
    }
}
