'use client'

import React, { useState } from 'react'
import {
    FileText,
    Users,
    TrendingUp,
    Calendar,
    ChevronUp,
    ChevronDown,
    Minus,
    ArrowUpRight,
} from 'lucide-react'
import { useDashboardData } from '@/hooks/useDashboardData'
// Tidak ada mock data di luar komponen

function getTrend(current, prev) {
    if (!prev) return 'neutral'
    const currTotal = current.pendaftarL + current.pendaftarP
    const prevTotal = prev.pendaftarL + prev.pendaftarP
    if (currTotal > prevTotal) return 'up'
    if (currTotal < prevTotal) return 'down'
    return 'neutral'
}

function TrendIcon({ trend }) {
    if (trend === 'up') return <ChevronUp className="w-3.5 h-3.5 text-emerald-500" />
    if (trend === 'down') return <ChevronDown className="w-3.5 h-3.5 text-rose-500" />
    return <Minus className="w-3.5 h-3.5 text-slate-400" />
}

function GenderPill({ value, gender }) {
    const isL = gender === 'L'
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
            ${isL
                ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                : 'bg-pink-50 text-pink-700 ring-1 ring-pink-200'
            }`}>
            <span className="opacity-60 text-[10px]">{gender}</span>
            {value}
        </span>
    )
}

export default function DaftarHarianTable({ selectedYear }) {
    const [hoveredRow, setHoveredRow] = useState(null)
    const { data, isLoading } = useDashboardData({ tahun_ajaran: selectedYear })

    // Ambil data live dari rekap chart
    const DataRekapHarian = data?.chart || []

    // Menghitung barWidth dinamis (mencegah pembagian dengan nol)
    const computedMax = DataRekapHarian.length > 0
        ? Math.max(...DataRekapHarian.map(r => r.pendaftarL + r.pendaftarP))
        : 1
    const maxTotal = computedMax > 0 ? computedMax : 1

    const totals = DataRekapHarian.reduce((acc, r) => ({
        pendaftarL: acc.pendaftarL + r.pendaftarL,
        pendaftarP: acc.pendaftarP + r.pendaftarP,
        diterimaL: acc.diterimaL + r.diterimaL,
        diterimaP: acc.diterimaP + r.diterimaP,
    }), { pendaftarL: 0, pendaftarP: 0, diterimaL: 0, diterimaP: 0 })

    // Sinkronisasi dengan sumber kebenaran (Backend) agar sama persis dengan kartu di atasnya
    const totalDaftar = data?.total_pendaftar ?? (totals.pendaftarL + totals.pendaftarP)
    const totalDiterima = data?.diterima ?? (totals.diterimaL + totals.diterimaP)
    const acceptRate = data?.rekap_harian?.tingkatDiterima ?? 0

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

            {/* ── PRINT HEADER (hanya muncul saat print) ── */}
            <div className="text-center py-4 hidden print:block border-b border-black">
                <p className="text-xs font-bold uppercase tracking-widest">
                    Daftar Harian Penerimaan Calon Peserta Murid Baru
                </p>
                <p className="text-xs font-bold uppercase">SMP Negeri 5 Narmada</p>
                <p className="text-xs">Tahun Pelajaran {data?.tahun_ajaran || '...'}</p>
            </div>

            {/* ── PANEL HEADER (layar) ── */}
            <div className="print:hidden px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
                        <Calendar className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-800 leading-tight">
                            Daftar Harian PMB
                        </h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">Tahun Pelajaran {data?.tahun_ajaran || '...'}</p>
                    </div>
                </div>

                {/* Quick stats */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-500">Total</span>
                        <span className="text-xs font-bold text-slate-700">{totalDaftar}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs text-emerald-600">Diterima</span>
                        <span className="text-xs font-bold text-emerald-700">{acceptRate}%</span>
                    </div>
                </div>
            </div>

            {/* ── TABLE ── */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">

                    {/* THEAD */}
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-800 to-slate-700 print:bg-none">
                            <th rowSpan="3"
                                className="border border-slate-600/50 print:border-black px-3 py-3 text-xs font-semibold text-slate-300 print:text-black w-10">
                                No
                            </th>
                            <th rowSpan="3"
                                className="border border-slate-600/50 print:border-black px-4 py-3 text-xs font-semibold text-slate-300 print:text-black text-left min-w-[180px]">
                                Hari / Tanggal
                            </th>
                            <th colSpan="3"
                                className="border border-slate-600/50 print:border-black px-3 py-2 text-xs font-semibold text-blue-300 print:text-black uppercase tracking-wider">
                                Pendaftar
                            </th>
                            <th colSpan="3"
                                className="border border-slate-600/50 print:border-black px-3 py-2 text-xs font-semibold text-emerald-300 print:text-black uppercase tracking-wider">
                                Diterima
                            </th>
                            <th rowSpan="3"
                                className="border border-slate-600/50 print:border-black px-3 py-3 text-xs font-semibold text-slate-300 print:text-black w-16">
                                Trend
                            </th>
                        </tr>
                        <tr className="bg-gradient-to-r from-slate-800 to-slate-700 print:bg-none">
                            <th colSpan="3"
                                className="border border-slate-600/50 print:border-black px-3 py-1.5 text-[11px] font-medium text-blue-200 print:text-black">
                                SD
                            </th>
                            <th colSpan="3"
                                className="border border-slate-600/50 print:border-black px-3 py-1.5 text-[11px] font-medium text-emerald-200 print:text-black">
                                SD
                            </th>
                        </tr>
                        <tr className="bg-slate-700/80 print:bg-none">
                            {['L', 'P', 'Sub'].map((h, i) => (
                                <th key={`d-${i}`}
                                    className="border border-slate-600/50 print:border-black px-3 py-2 text-[11px] font-semibold text-slate-300 print:text-black w-14">
                                    {h === 'Sub' ? <span className="text-slate-400 print:text-black">∑</span> : h}
                                </th>
                            ))}
                            {['L', 'P', 'Sub'].map((h, i) => (
                                <th key={`t-${i}`}
                                    className="border border-slate-600/50 print:border-black px-3 py-2 text-[11px] font-semibold text-slate-300 print:text-black w-14">
                                    {h === 'Sub' ? <span className="text-slate-400 print:text-black">∑</span> : h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* TBODY */}
                    <tbody>
                        {DataRekapHarian.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-600">Belum ada data</p>
                                            <p className="text-xs text-slate-400 mt-1">Data harian PMB akan tampil di sini</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : DataRekapHarian.map((row, i) => {
                            // 1. Menjumlahkan total pendaftar Laki-laki + Perempuan pada HARI ITU
                            const subPendaftar = row.pendaftarL + row.pendaftarP
                            // 2. Menjumlahkan total diterima Laki-laki + Perempuan pada HARI ITU
                            const subDiterima = row.diterimaL + row.diterimaP
                            // 3. Mengambil data trend dari baris sebelumnya
                            const trend = getTrend(row, DataRekapHarian[i - 1])
                            // 4. Menghitung lebar bar chart (opsional) dari jumlah pendaftar L + P pada hari itu
                            const barWidth = Math.round((subPendaftar / maxTotal) * 100)
                            const isHovered = hoveredRow === i

                            return (
                                <tr
                                    key={i}
                                    onMouseEnter={() => setHoveredRow(i)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    className={`transition-colors duration-150 border-b border-slate-50
                                        ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                                        ${isHovered ? '!bg-indigo-50/70' : ''}
                                        print:bg-white print:border-black`}
                                >
                                    {/* No */}
                                    <td className="border-x border-slate-100 print:border-black px-3 py-3 text-center">
                                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold
                                            ${isHovered
                                                ? 'bg-indigo-500 text-white'
                                                : 'bg-slate-100 text-slate-500'
                                            } transition-colors`}>
                                            {i + 1}
                                        </span>
                                    </td>

                                    {/* Tanggal */}
                                    <td className="border-x border-slate-100 print:border-black px-4 py-3">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-xs font-semibold ${isHovered ? 'text-indigo-700' : 'text-slate-700'} transition-colors`}>
                                                {row.tgl}
                                            </span>
                                            {/* Progress bar — hanya layar */}
                                            <div className="print:hidden w-full bg-slate-100 rounded-full h-1">
                                                <div
                                                    className="h-1 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 transition-all duration-500"
                                                    style={{ width: `${barWidth}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>

                                    {/* Pendaftar L */}
                                    <td className="border-x border-slate-100 print:border-black px-3 py-3 text-center">
                                        <GenderPill value={row.pendaftarL} gender="L" />
                                    </td>
                                    {/* Pendaftar P */}
                                    <td className="border-x border-slate-100 print:border-black px-3 py-3 text-center">
                                        <GenderPill value={row.pendaftarP} gender="P" />
                                    </td>
                                    {/* Sub Pendaftar */}
                                    <td className="border-x border-slate-100 print:border-black px-3 py-3 text-center">
                                        <span className="text-xs font-bold text-slate-700">{subPendaftar}</span>
                                    </td>

                                    {/* Diterima L */}
                                    <td className="border-x border-slate-100 print:border-black px-3 py-3 text-center">
                                        <GenderPill value={row.diterimaL} gender="L" />
                                    </td>
                                    {/* Diterima P */}
                                    <td className="border-x border-slate-100 print:border-black px-3 py-3 text-center">
                                        <GenderPill value={row.diterimaP} gender="P" />
                                    </td>
                                    {/* Sub Diterima */}
                                    <td className="border-x border-slate-100 print:border-black px-3 py-3 text-center">
                                        <span className="inline-flex items-center gap-1">
                                            <span className="text-xs font-bold text-emerald-700">{subDiterima}</span>
                                            <ArrowUpRight className="w-3 h-3 text-emerald-400 print:hidden" />
                                        </span>
                                    </td>

                                    {/* Trend */}
                                    <td className="border-x border-slate-100 print:border-black px-3 py-3 text-center print:hidden">
                                        <div className="flex justify-center">
                                            <TrendIcon trend={trend} />
                                        </div>
                                    </td>
                                    {/* Trend (print fallback) */}
                                    <td className="hidden print:table-cell border border-black px-3 py-3 text-center text-xs">
                                        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'}
                                    </td>
                                </tr>
                            )
                        })}

                        {/* ── BARIS TOTAL ── */}
                        <tr className="bg-gradient-to-r from-slate-800 to-slate-700 print:bg-none border-t-2 border-slate-300">
                            <td colSpan="2"
                                className="border border-slate-600/50 print:border-black px-4 py-3 text-left">
                                <span className="text-xs font-bold text-white print:text-black uppercase tracking-wider">
                                    Jumlah
                                </span>
                            </td>
                            <td className="border border-slate-600/50 print:border-black px-3 py-3 text-center">
                                <GenderPill value={totals.pendaftarL} gender="L" />
                            </td>
                            <td className="border border-slate-600/50 print:border-black px-3 py-3 text-center">
                                <GenderPill value={totals.pendaftarP} gender="P" />
                            </td>
                            <td className="border border-slate-600/50 print:border-black px-3 py-3 text-center">
                                <span className="text-xs font-black text-white print:text-black">{totalDaftar}</span>
                            </td>
                            <td className="border border-slate-600/50 print:border-black px-3 py-3 text-center">
                                <GenderPill value={totals.diterimaL} gender="L" />
                            </td>
                            <td className="border border-slate-600/50 print:border-black px-3 py-3 text-center">
                                <GenderPill value={totals.diterimaP} gender="P" />
                            </td>
                            <td className="border border-slate-600/50 print:border-black px-3 py-3 text-center">
                                <span className="text-xs font-black text-emerald-300 print:text-black">{totalDiterima}</span>
                            </td>
                            <td className="border border-slate-600/50 print:border-black px-3 py-3 text-center print:hidden">
                                <span className="text-[10px] font-bold text-violet-300">
                                    {acceptRate}%
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ── FOOTER KETERANGAN ── */}
            <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:border-black">
                <div className="flex items-center gap-4 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
                        <strong>L</strong> = Laki-laki
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-400 inline-block" />
                        <strong>P</strong> = Perempuan
                    </span>
                    <span className="flex items-center gap-1.5 print:hidden">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                        <strong>∑</strong> = Sub-total
                    </span>
                </div>
                <div className="print:hidden flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[11px] text-emerald-600 font-medium">
                        Tingkat penerimaan: <strong>{acceptRate}%</strong>
                    </span>
                </div>
            </div>
        </div>
    )
}