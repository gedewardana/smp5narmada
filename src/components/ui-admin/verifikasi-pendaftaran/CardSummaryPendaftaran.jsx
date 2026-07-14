'use client'

import React from 'react'
import {
    Users,
    CheckCircle2,
    Clock,
    AlertCircle,
    XCircle
} from 'lucide-react'
import SummaryCard from '../../reasublecomponents/SummaryCard'
import { useDashboardData } from '@/hooks/useDashboardData'

export default function CardSummaryPendaftaran({ tahun_ajaran }) {
    const { data, isLoading } = useDashboardData({ tahun_ajaran });

    // Mapping aman dari respon API Dasbor (terintegrasi dengan getStatsPendaftaran)
    const statsData = data?.stats_verifikasi || {
        total: 0,
        diverifikasi: 0,
        menunggu: 0,
        perluPerbaikan: 0,
        ditolak: 0
    };

    // Helper untuk hitung persentase dinamis
    const calcTrend = (val) => {
        if (!statsData.total || statsData.total === 0) return '0%';
        return Math.round((val / statsData.total) * 100) + '%';
    };

    const config = [
        {
            label: 'Total Pendaftar',
            value: statsData.total,
            icon: Users,
            variant: 'blue',
            // trend: '100%',
            trendUp: true,
            description: data?.tahun_ajaran || 'Tahun Ajaran Aktif'
        },
        {
            label: 'Diverifikasi',
            value: statsData.diverifikasi,
            icon: CheckCircle2,
            variant: 'emerald',
            trend: calcTrend(statsData.diverifikasi),
            trendUp: true,
            description: 'Tingkat kelulusan'
        },
        {
            label: 'Menunggu',
            value: statsData.menunggu,
            icon: Clock,
            variant: 'amber',
            trend: calcTrend(statsData.menunggu),
            trendUp: false,
            description: 'Perlu diproses'
        },
        {
            label: 'Perlu Perbaikan',
            value: statsData.perluPerbaikan,
            icon: AlertCircle,
            variant: 'orange',
            trend: calcTrend(statsData.perluPerbaikan),
            trendUp: false,
            description: 'Dari total pendaftar'
        },
        {
            label: 'Ditolak',
            value: statsData.ditolak,
            icon: XCircle,
            variant: 'rose',
            trend: calcTrend(statsData.ditolak),
            trendUp: false,
            description: 'Tidak memenuhi syarat'
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {config.map((card, index) => (
                <SummaryCard
                    key={index}
                    index={index}
                    {...card}
                />
            ))}
        </div>
    )
}