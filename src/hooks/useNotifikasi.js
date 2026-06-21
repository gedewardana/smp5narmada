import useSWR, { mutate as globalMutate } from 'swr'
import { useMemo, useState } from 'react'
import { isToday, isYesterday, parseISO } from 'date-fns'
import { useAuth } from './useAuth'

/**
 * useNotifikasi Hook
 * Mengelola pengambilan data notifikasi dan aksi terkait (baca/hapus).
 */
export function useNotifikasi() {
    const { user } = useAuth()
    const id_pengguna = user?.id_pengguna
    const [limit, setLimit] = useState(5) // Default load 5 pesan

    const fetcher = (url) => fetch(url).then((res) => res.json())
    
    // Fetch notifications only if user is logged in
    const { data, error, isLoading, mutate } = useSWR(
        id_pengguna ? `/api/notifikasi?id_pengguna=${id_pengguna}&limit=${limit}` : null,
        fetcher
    )

    // Load More Function
    const loadMore = () => {
        setLimit(prev => prev + 5)
    }

    // 1. Menandai Satu Notifikasi Terbaca
    const markRead = async (id_notif) => {
        try {
            const res = await fetch(`/api/notifikasi/${id_notif}`, {
                method: 'PATCH',
            })
            const result = await res.json()
            if (result.success) {
                globalMutate(
                    (key) => typeof key === 'string' && key.startsWith(`/api/notifikasi?id_pengguna=${id_pengguna}`),
                    undefined,
                    { revalidate: true }
                )
            }
            return result
        } catch (error) {
            console.error("Gagal menandai notifikasi:", error)
        }
    }

    // 2. Menandai Semua Terbaca
    const markAllRead = async () => {
        if (!id_pengguna) return
        try {
            const res = await fetch(`/api/notifikasi?id_pengguna=${id_pengguna}`, {
                method: 'PUT',
            })
            const result = await res.json()
            if (result.success) {
                globalMutate(
                    (key) => typeof key === 'string' && key.startsWith(`/api/notifikasi?id_pengguna=${id_pengguna}`),
                    undefined,
                    { revalidate: true }
                )
            }
            return result
        } catch (error) {
            console.error("Gagal menandai semua notifikasi:", error)
        }
    }

    // 3. Menghapus Notifikasi
    const removeNotif = async (id_notif) => {
        try {
            const res = await fetch(`/api/notifikasi/${id_notif}`, {
                method: 'DELETE',
            })
            const result = await res.json()
            if (result.success) {
                globalMutate(
                    (key) => typeof key === 'string' && key.startsWith(`/api/notifikasi?id_pengguna=${id_pengguna}`),
                    undefined,
                    { revalidate: true }
                )
            }
            return result
        } catch (error) {
            console.error("Gagal menghapus notifikasi:", error)
        }
    }

    const notificationsData = data?.data || [];

    // Grouping Logic dipindahkan ke Hook (Clean Code)
    const groupedNotifications = useMemo(() => {
        const groups = {
            today: [],
            yesterday: [],
            earlier: []
        };

        notificationsData.forEach(notif => {
            if (!notif.dibuat_pada) {
                groups.earlier.push(notif);
                return;
            }
            
            try {
                const date = parseISO(notif.dibuat_pada);
                if (isToday(date)) {
                    groups.today.push(notif);
                } else if (isYesterday(date)) {
                    groups.yesterday.push(notif);
                } else {
                    groups.earlier.push(notif);
                }
            } catch (err) {
                groups.earlier.push(notif);
            }
        });

        return groups;
    }, [notificationsData]);

    return {
        notifications: notificationsData,
        groupedNotifications,
        unreadCount: data?.unreadCount || 0,
        isLoading,
        isError: error,
        markRead,
        markAllRead,
        removeNotif,
        refresh: mutate,
        loadMore,
        hasMore: data?.totalCount ? notificationsData.length < data.totalCount : false
    }
}
