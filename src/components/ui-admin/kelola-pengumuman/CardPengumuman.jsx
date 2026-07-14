'use client'

import React from 'react'
import {
    Users,
    ClipboardList,
    CheckCircle2,
    XCircle
} from 'lucide-react'
import SummaryCard from '../../reasublecomponents/SummaryCard'
import { useDashboardData } from '@/hooks/useDashboardData'

export default function CardPengumuman({ tahun_ajaran }) {
    const { data: dashboardData, isLoading } = useDashboardData({ tahun_ajaran })

    // Fallback if data is not loaded yet
    const stats = dashboardData?.stats_pengumuman || {
        total: 0,
        menunggu: 0,
        diterima: 0,
        tidakDiterima: 0
    }

    const config = [
        {
            label: 'Total Diumumkan',
            value: stats.total,
            icon: Users,
            variant: 'blue',
            trend: '100%',
            description: 'Total pendaftar tetap'
        },
        {
            label: 'Menunggu Pengumuman',
            value: stats.menunggu,
            icon: ClipboardList,
            variant: 'amber',
            // Simple trend logic (example only): percentage out of total
            trend: stats.total > 0 ? `${Math.round((stats.menunggu / stats.total) * 100)}%` : '0%',
            description: 'Belum diputuskan'
        },
        {
            label: 'Diterima',
            value: stats.diterima,
            icon: CheckCircle2,
            variant: 'emerald',
            trend: stats.total > 0 ? `${Math.round((stats.diterima / stats.total) * 100)}%` : '0%',
            description: 'Lolos seleksi'
        },
        {
            label: 'Tidak Diterima',
            // Match with key returned from getStatsPengumuman
            value: stats.tidakDiterima, 
            icon: XCircle,
            variant: 'rose',
            trend: stats.total > 0 ? `${Math.round((stats.tidakDiterima / stats.total) * 100)}%` : '0%',
            description: 'Tidak Lolos'
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {config.map((card, index) => (
                <SummaryCard
                    key={index}
                    index={index}
                    isLoading={isLoading}
                    {...card}
                />
            ))}
        </div>
    )
}