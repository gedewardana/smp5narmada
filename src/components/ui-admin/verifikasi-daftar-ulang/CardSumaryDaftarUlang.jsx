'use client'

import React from 'react'
import {
    Users,
    ClipboardCheck,
    Clock,
    UserX
} from 'lucide-react'
import SummaryCard from '../../reasublecomponents/SummaryCard'
import { useDashboardData } from '@/hooks/useDashboardData'

export default function CardSumaryDaftarUlang({ tahun_ajaran }) {
    const { data, isLoading } = useDashboardData({ tahun_ajaran });

    // Mapping aman dari respon API Dasbor 
    const statsData = data?.stats_daftar_ulang || {
        total: 0,
        belum: 0,
        sudah: 0,
        mengundurkanDiri: 0
    };

    // Helper untuk hitung persentase dinamis terhadap "Total Diterima"
    const calcTrend = (val) => {
        const totalDiterima = data?.diterima ?? 0;
        if (!totalDiterima || totalDiterima === 0) return '0%';
        return Math.round((val / totalDiterima) * 100) + '%';
    };

    const config = [
        {
            label: 'Total Diterima',
            value: data?.diterima ?? 0,
            icon: Users,
            variant: 'blue',
            // trend: '100%',
            trendUp: true,
            description: data?.tahun_ajaran || 'Tahun Ajaran Aktif'
        },
        {
            label: 'Sudah Daftar Ulang',
            value: statsData.sudah,
            icon: ClipboardCheck,
            variant: 'emerald',
            trend: calcTrend(statsData.sudah),
            trendUp: true,
            description: 'Telah Melapor'
        },
        {
            label: 'Belum Daftar Ulang',
            value: statsData.belum,
            icon: Clock,
            variant: 'amber',
            trend: calcTrend(statsData.belum),
            trendUp: false,
            description: 'Perlu Konfirmasi'
        },
        {
            label: 'Mengundurkan Diri',
            value: statsData.mengundurkanDiri,
            icon: UserX,
            variant: 'rose',
            trend: calcTrend(statsData.mengundurkanDiri),
            trendUp: false,
            description: 'Batal / Mundur'
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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