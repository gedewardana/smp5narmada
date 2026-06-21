'use client'

import React from 'react'
import {
    ClipboardCheck,
    Target,
    ShieldCheck,
    Hourglass
} from 'lucide-react'
import SummaryCard from '@/components/reasublecomponents/SummaryCard'
import { useUserDashboard } from '@/hooks/useUserDashboard'

export default function StatsCard() {
    const { data, isLoading } = useUserDashboard()

    const sisaHariLabel = data?.sisa_hari != null
        ? data.sisa_hari > 0 ? `${data.sisa_hari} Hari Lagi`
          : data.sisa_hari === 0 ? 'Hari Terakhir'
          : 'Berakhir'
        : '-'

    const stats = [
        {
            label: 'Status Pendaftaran',
            value: data?.status_pendaftaran ?? '-',
            description: 'Lengkapi Formulir dan Berkas',
            icon: ClipboardCheck,
            variant: 'blue'
        },
        {
            label: 'Jalur Seleksi',
            value: data?.jalur_pendaftaran ?? '-',
            description: 'Berdasarkan domisili terdekat',
            icon: Target,
            variant: 'indigo'
        },
        {
            label: 'Verifikasi Pendaftaran',
            value: data?.status_verifikasi ?? '-',
            description: 'Oleh panitia pusat pendaftaran',
            icon: ShieldCheck,
            variant: 'emerald'
        },
        {
            label: 'Sisa Waktu',
            value: sisaHariLabel,
            description: 'Batas akhir pendaftaran online',
            icon: Hourglass,
            variant: 'rose'
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <SummaryCard
                    key={index}
                    index={index}
                    label={stat.label}
                    value={isLoading ? '...' : stat.value}
                    icon={stat.icon}
                    variant={stat.variant}
                    description={stat.description}
                />
            ))}
        </div>
    )
}