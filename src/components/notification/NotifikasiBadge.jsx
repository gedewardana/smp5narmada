'use client'

/**
 * NotifikasiBadge - Badge untuk jumlah notifikasi belum dibaca
 * Digunakan di Sidebar atau Header
 */
function NotifikasiBadge({ count }) {
    if (!count || count === 0) return null

    return (
        <span className="absolute top-0.5 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {count > 9 ? '9+' : count}
        </span>
    )
}

export default NotifikasiBadge