import useSWR from 'swr'
import { useSession } from 'next-auth/react'

const fetcher = async (url) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Gagal mengambil data dashboard pengguna')
    const json = await res.json()
    return json.data
}

// Custom hook SWR untuk Dashboard User
export function useUserDashboard() {
    const { data: session, status } = useSession()

    // Ambil id_pengguna dari session (sesuai callback session di nextauth route.js)
    const id_pengguna = session?.user?.id_pengguna

    // Hanya fetch jika session sudah siap dan id_pengguna tersedia
    const key = status === 'authenticated' && id_pengguna
        ? `/api/user/dashboard?id_pengguna=${id_pengguna}`
        : null

    const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
        revalidateOnFocus: true,
    })

    return { data, error, isLoading: status === 'loading' || isLoading, mutate }
}

