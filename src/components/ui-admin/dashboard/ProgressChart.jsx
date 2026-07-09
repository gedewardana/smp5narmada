'use client'

import { useEffect, useState, useCallback } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts'
import { TrendingUp, Users, RefreshCw } from 'lucide-react'
import { getLocalYMD } from '@/utils/timezoneHelper'
import { useDashboardData } from '@/hooks/useDashboardData'

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-900/10 p-4 min-w-[160px]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{label}</p>
            {payload.map((entry) => (
                <div key={entry.dataKey} className="flex items-center justify-between gap-6 mb-1.5">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: entry.fill }} />
                        <span className="text-xs font-semibold text-slate-600">{entry.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 tabular-nums">{entry.value}</span>
                </div>
            ))}
        </div>
    )
}

// ─── Legend ───────────────────────────────────────────────────────────────────

const SERIES = [
    { key: 'pendaftar', label: 'Total', color: '#3b82f6' },
    { key: 'L', label: 'Laki-laki', color: '#10b981' },
    { key: 'P', label: 'Perempuan', color: '#f59e0b' },
]

// ─── Component ────────────────────────────────────────────────────────────────

function ProgressChart() {
    const { data: dashboardData, isLoading, mutate } = useDashboardData()
    const data = dashboardData?.chart || []
    
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [lastUpdated, setLastUpdated] = useState(null)

    // Perbarui waktu 'terakhir diperbarui' ketika data berhasil dimuat
    useEffect(() => {
        if (dashboardData) {
            setLastUpdated(new Date())
        }
    }, [dashboardData])

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await mutate()
        setIsRefreshing(false)
    }

    // Gunakan getLocalYMD untuk mencocokkan tanggal hari ini sesuai timezone WITA/WIB
    // agar tidak terjadi mismatch saat server berjalan di UTC
    const todayStr   = getLocalYMD(new Date())
    const todayEntry = data.find(d => d.fullDate === todayStr)
    const totalToday = todayEntry?.pendaftar ?? 0

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            {/* ── Header ── */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                        <TrendingUp className="w-4.5 h-4.5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-900 tracking-tight">
                            Trend Pendaftar Harian
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium">
                            {lastUpdated
                                ? `Diperbarui ${lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
                                : 'Memuat data...'
                            }
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Summary badge */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-xs font-black text-blue-700 tabular-nums">
                            {totalToday} hari ini
                        </span>
                    </div>

                    {/* Refresh button */}
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing || isLoading}
                        title="Refresh data"
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${(isRefreshing || isLoading) ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* ── Legend Pills ── */}
            <div className="flex items-center gap-3 px-6 py-3 border-b border-slate-50">
                {SERIES.map(({ key, label, color }) => (
                    <div key={key} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
                    </div>
                ))}
            </div>

            {/* ── Chart Area ── */}
            <div className="px-4 pt-5 pb-4">
                {isLoading ? (
                    <div className="h-[280px] flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <RefreshCw className="w-5 h-5 text-slate-300 animate-spin" />
                            <span className="text-xs text-slate-400 font-medium">Memuat grafik...</span>
                        </div>
                    </div>
                ) : data.length === 0 ? (
                    <div className="h-[280px] flex items-center justify-center">
                        <p className="text-sm text-slate-400 font-medium">Belum ada data pendaftar</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={data} barCategoryGap="30%" barGap={3}>
                            <CartesianGrid
                                strokeDasharray="0"
                                stroke="#f8fafc"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                axisLine={false}
                                tickLine={false}
                                width={32}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: '#f8fafc', radius: 8 }}
                            />
                            {SERIES.map(({ key, label, color }) => (
                                <Bar
                                    key={key}
                                    dataKey={key}
                                    name={label}
                                    fill={color}
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={32}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}

export default ProgressChart