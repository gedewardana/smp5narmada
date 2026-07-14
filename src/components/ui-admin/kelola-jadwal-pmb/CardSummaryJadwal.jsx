'use client'

import React, { useMemo } from 'react'
import {
    CalendarRange,
    CheckCircle2,
    Users,
    History,
    Clock
} from 'lucide-react'
import SummaryCard from '../../reasublecomponents/SummaryCard'

export default function CardSummaryJadwal({ summary = null, isLoading = false }) {

    // Logic pemrosesan data (Server-Side pre-calculated)
    const stats = useMemo(() => {
        // Fallback data jika belum ada/loading
        const s = summary || {
            total: 0,
            activeAcademicYear: '—',
            totalCapacity: 0,
            registrationCountdown: '—',
            isWarning: false
        }

        return [
            {
                label: 'Total Jadwal',
                value: s.total,
                icon: CalendarRange,
                variant: 'blue',
                trend: 'Gelombang',
                description: 'Total Jadwal Terdaftar'
            },
            {
                label: 'Tahun Aktif',
                value: s.activeAcademicYear,
                icon: CheckCircle2,
                variant: 'emerald',
                trend: s.activeAcademicYear !== '—' ? 'AKTIF' : 'OFFLINE',
                description: 'Jadwal Operasional Aktif'
            },
            {
                label: 'Total Kuota',
                value: s.totalCapacity,
                icon: Users,
                variant: 'amber',
                trend: 'Siswa',
                description: 'Akumulasi Kapasitas'
            },
            {
                label: 'Sisa Waktu',
                value: s.registrationCountdown,
                icon: s.isWarning ? Clock : History,
                variant: s.isWarning ? 'rose' : 'indigo',
                trend: 'Deadline',
                description: 'Countdown Pendaftaran'
            }
        ]
    }, [summary])

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((card, index) => (
                <SummaryCard
                    key={index}
                    index={index}
                    {...card}
                    isLoading={isLoading}
                />
            ))}
        </div>
    )
}
