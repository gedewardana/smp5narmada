import React from 'react'

function HasilSeleksiBadge({ hasil }) {
    const badgeStyles = {
        'DITERIMA': 'bg-green-100 text-green-700 border-green-300',
        'TIDAK_DITERIMA': 'bg-red-100 text-red-700 border-red-300',
        'MENUNGGU_PENGUMUMAN': 'bg-yellow-100 text-yellow-700 border-yellow-300'
    }

    const badgeLabels = {
        'DITERIMA': 'Diterima',
        'TIDAK_DITERIMA': 'Tidak Diterima',
        'MENUNGGU_PENGUMUMAN': 'Menunggu'
    }

    const style = badgeStyles[hasil] || badgeStyles['MENUNGGU_PENGUMUMAN']
    const label = badgeLabels[hasil] || 'Menunggu'

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
            {label}
        </span>
    )
}

export default HasilSeleksiBadge