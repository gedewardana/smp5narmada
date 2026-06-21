import React from 'react'
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    FileEdit,
    XCircle,
    FileText
} from 'lucide-react'

function StatusBadge({ status }) {
    // Normalisasi status (jaga-jaga jika inputnya lowercase/mixed)
    const normalizedStatus = status ? status.toUpperCase() : 'UNKNOWN';

    const statusConfig = {
        'MENUNGGU_VERIFIKASI': {
            label: 'Menunggu',
            className: 'bg-amber-100 text-amber-600 ring-amber-600/10',
            iconColor: 'text-amber-600'
        },


        'VERIFIKASI': {
            label: 'Diverifikasi',
            icon: CheckCircle2,
            className: 'bg-green-100 text-green-700 ring-green-600/20 hover:bg-green-100',
            iconColor: 'text-green-600'
        },

        'TOLAK': {
            label: 'Ditolak',

            className: 'bg-red-100 text-red-700 ring-red-600/20',
            iconColor: 'text-red-600'
        },
        'PERLU_PERBAIKAN': {
            label: 'Perlu Perbaikan',

            className: 'bg-orange-100 text-orange-700 ring-orange-600/20',
            iconColor: 'text-orange-600'
        },

    }

    // Default config jika status tidak dikenali
    const config = statusConfig[normalizedStatus] || {
        label: normalizedStatus.replace(/_/g, ' '),
        icon: AlertCircle,
        className: 'bg-gray-50 text-gray-600 ring-gray-500/10',
        iconColor: 'text-gray-500'
    }

    const Icon = config.icon

    return (
        <span
            className={`
                inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium 
                ring-1 ring-inset transition-colors duration-200
                ${config.className}
            `}
        >
            {/* <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} strokeWidth={2} /> */}
            <span className="tracking-wide">{config.label}</span>
        </span>
    )
}

export default StatusBadge
