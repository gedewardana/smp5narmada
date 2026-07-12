'use client'

import React from 'react'
import { Calendar, Users, Target, UserCheck } from 'lucide-react'
import { format } from 'date-fns'
import { id as localeID } from 'date-fns/locale'
import SummaryCard from '../../reasublecomponents/SummaryCard'
import { useDashboardData } from '@/hooks/useDashboardData'

export default function CardSummary() {
    const { data, isLoading } = useDashboardData()

    const today = format(new Date(), "dd MMM yyyy", { locale: localeID })

    const cards = [
        {
            label: 'Total Pendaftar',
            value: data?.total_pendaftar ?? 0,
            description: data ? `Tahun Ajaran ${data.tahun_ajaran}` : 'Memuat data...',
            icon: Calendar,
            variant: 'blue',
            details: data ? { L: data.laki_laki, P: data.perempuan } : null
        },
        {
            label: 'Pendaftar Hari Ini',
            value: data?.hari_ini ?? 0,
            description: today,
            icon: Users,
            variant: 'indigo',
            details: data ? { L: data.laki_laki_hari_ini ?? 0, P: data.perempuan_hari_ini ?? 0 } : null // Assuming API might provide daily breakdown
        },
        {
            label: 'Daya Tampung',
            value: data?.daya_tampung ?? 0,
            description: 'Target Kapasitas Siswa',
            icon: Target,
            variant: 'amber',
            capacity: data ? { terisi: data.diterima, total: data.daya_tampung } : null
        },
        {
            label: 'Siswa Diterima',
            value: data?.diterima ?? 0,
            description: 'Data Kelulusan Seleksi',
            icon: UserCheck,
            variant: 'emerald',
            // details: data ? { L: data.laki_laki_diterima ?? 0, P: data.perempuan_diterima ?? 0 } : null
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((item, index) => (
                <SummaryCard
                    key={index}
                    index={index}
                    label={item.label}
                    value={item.value}
                    icon={item.icon}
                    variant={item.variant}
                    description={item.description}
                    isLoading={isLoading}
                >
                    {/* Gender Breakdown Slot */}
                    {item.details && (
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50/50 text-blue-600 rounded-lg border border-blue-100/50">
                                <span className="opacity-50">L:</span>
                                {item.details.L}
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-rose-50/50 text-rose-600 rounded-lg border border-rose-100/50">
                                <span className="opacity-50">P:</span>
                                {item.details.P}
                            </div>
                        </div>
                    )}

                    {/* Capacity Progress Slot */}
                    {item.capacity && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-slate-400">Terisi</span>
                                <span className="text-amber-600">{item.capacity.terisi} / {item.capacity.total}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min((item.capacity.terisi / item.capacity.total) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    )}
                </SummaryCard>
            ))}
        </div>
    )
}
