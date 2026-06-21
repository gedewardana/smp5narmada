'use client'

/**
 * StatusBadge - Badge status hasil seleksi
 */
function StatusBadge({ status }) {
    const getBadgeStyle = (status) => {
        const styles = {
            'MENUNGGU_PENGUMUMAN': {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                label: 'Menunggu Pengumuman'
            },
            'DITERIMA': {
                bg: 'bg-green-100',
                text: 'text-green-800',
                label: 'Diterima'
            },
            'TIDAK_DITERIMA': {
                bg: 'bg-red-100',
                text: 'text-red-800',
                label: 'Tidak Diterima'
            }
        }
        return styles[status] || styles['MENUNGGU_PENGUMUMAN']
    }

    const style = getBadgeStyle(status)

    return (
        <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${style.bg} ${style.text}`}>
            {style.label}
        </span>
    )
}

export default StatusBadge
