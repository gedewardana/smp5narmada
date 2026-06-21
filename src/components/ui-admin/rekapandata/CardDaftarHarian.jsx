'use client'

import React from 'react'
import {
    Target,
    Percent,
    Zap,
    BarChart3,
    TrendingUp,
    Users
} from 'lucide-react'
import SummaryCard from '../../reasublecomponents/SummaryCard'
import { useDashboardData } from '@/hooks/useDashboardData'







export default function CardDaftarHarian({ selectedYear }) {


    const { data, isLoading } = useDashboardData({ tahun_ajaran: selectedYear })

    const STATS_CONFIG = [
        {
            label: 'Daya Tampung',
            value: data?.daya_tampung ?? 0,
            description: `Tersisa ${data?.rekap_harian?.sisaKursi ?? 0} kursi lagi`,
            icon: Target,
            variant: 'blue',
            trend: { value: `${data?.rekap_harian?.persentasePeminat ?? 0}%`, label: 'Peminat' }
        },
        {
            label: 'Tingkat Diterima',
            value: `${data?.rekap_harian?.tingkatDiterima ?? 0}%`,
            description: 'Berdasarkan total pendaftar',
            icon: Percent,
            variant: 'emerald',
            trend: { value: 'Live', label: 'Real-time' }
        },
        {
            label: 'Puncak Pendaftaran',
            value: data?.rekap_harian?.puncakPendaftaran ?? 0,
            description: `Terjadi pada ${data?.rekap_harian?.tanggalPuncak ?? '-'}`,
            icon: Zap,
            variant: 'amber',
            trend: { value: 'Tertinggi', label: 'Harian' }
        },
        {
            label: 'Rata-rata Harian',
            value: data?.rekap_harian?.rerataHarian ?? 0,
            description: 'Siswa baru per hari',
            icon: BarChart3,
            variant: 'indigo',
            trend: { value: `${data?.rekap_harian?.totalHari ?? 0} Hari`, label: 'Durasi PMB' }
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {STATS_CONFIG.map((item, index) => (
                <SummaryCard
                    key={index}
                    index={index}
                    label={item.label}
                    value={isLoading ? '...' : item.value}
                    icon={item.icon}
                    variant={item.variant}
                    description={item.description}
                >
                    {item.trend && !isLoading && (
                        <div className="flex items-center justify-between w-full mt-2 pt-2">
                            <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.variant === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                                    item.variant === 'blue' ? 'bg-blue-50 text-blue-600' :
                                        'bg-slate-50 text-slate-500'
                                    }`}>
                                    {item.trend.value}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                    {item.trend.label}
                                </span>
                            </div>

                            {/* Decorative Sparkline lookalike or small icon */}
                            {item.label === 'Tingkat Diterima' && (
                                <TrendingUp className="w-3 h-3 text-emerald-400" />
                            )}
                        </div>
                    )}
                </SummaryCard>
            ))}
        </div>
    )
}