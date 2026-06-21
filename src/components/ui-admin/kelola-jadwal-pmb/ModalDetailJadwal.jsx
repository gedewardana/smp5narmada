'use client'

import React, { useEffect, useState } from 'react'
import { X, Calendar, Users, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw, CalendarDays, Megaphone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useJadwal } from '@/hooks/useJadwal'

/* ─── helpers ─────────────────────────────────────── */
const STATUS_CONFIG = {
    DIBUKA: {
        label: 'Dibuka',
        icon: CheckCircle2,
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
    },
    DITUTUP: {
        label: 'Ditutup',
        icon: XCircle,
        className: 'bg-slate-100 text-slate-500 border-slate-200',
        dot: 'bg-slate-400',
    },
    BELUM_DIBUKA: {
        label: 'Belum Dibuka',
        icon: AlertCircle,
        className: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
    },
}

const MODE_LABEL = {
    ONLINE: 'Online',
    OFFLINE: 'Offline',
    // HYBRID: 'Hybrid',
}

const fmtDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric',
    })
}

const fmtRange = (start, end) => {
    if (!start || !end) return '—'
    const s = new Date(start).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    const e = new Date(end).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    return `${s}  –  ${e}`
}

/* ─── sub-components ──────────────────────────────── */
function InfoRow({ label, value, mono = false }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            <span className={`text-[13px] font-semibold text-slate-800 ${mono ? 'font-mono tabular-nums' : ''}`}>
                {value ?? '—'}
            </span>
        </div>
    )
}

function Section({ title, icon: Icon, children }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-indigo-400" />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{title}</span>
            </div>
            <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
                {children}
            </div>
        </div>
    )
}

function SectionRow({ label, value, mono = false }) {
    return (
        <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">{label}</span>
            <span className={`text-[12px] font-semibold text-slate-800 text-right ${mono ? 'font-mono tabular-nums' : ''}`}>
                {value ?? '—'}
            </span>
        </div>
    )
}

function Skeleton() {
    return (
        <div className="animate-pulse space-y-4 p-1">
            <div className="h-5 w-2/3 bg-slate-200 rounded-lg" />
            <div className="h-4 w-1/3 bg-slate-100 rounded" />
            <div className="grid grid-cols-2 gap-3 mt-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-12 bg-slate-100 rounded-xl" />
                ))}
            </div>
        </div>
    )
}

/* ─── main component ──────────────────────────────── */
export default function ModalDetailJadwal({ jadwalId, onClose, onEdit }) {
    const { getJadwalById } = useJadwal()
    const [jadwal, setJadwal] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchDetail = async () => {
        if (!jadwalId) return
        setLoading(true)
        setError(null)
        try {
            const data = await getJadwalById(jadwalId)
            setJadwal(data)
        } catch (err) {
            setError(err.message || 'Gagal memuat detail jadwal')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDetail()
    }, [jadwalId])

    /* close on backdrop click */
    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose?.()
    }

    const status = jadwal ? (STATUS_CONFIG[jadwal.status_jadwal] || STATUS_CONFIG.BELUM_DIBUKA) : null
    const StatusIcon = status?.icon

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={handleBackdrop}
        >
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 overflow-hidden flex flex-col max-h-[90vh]">

                {/* ── Header ── */}
                <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-[15px] font-black text-slate-900 leading-tight tracking-tight">
                            Detail Jadwal PMB
                        </h2>
                        {jadwal && (
                            <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest">
                                TA {jadwal.tahun_ajaran}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1.5 transition-all active:scale-95"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

                    {loading && <Skeleton />}

                    {error && (
                        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                            <AlertCircle className="w-8 h-8 text-red-400" />
                            <p className="text-[13px] font-semibold text-slate-600">{error}</p>
                            <Button size="sm" variant="outline" onClick={fetchDetail} className="gap-2 text-xs">
                                <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
                            </Button>
                        </div>
                    )}

                    {!loading && !error && jadwal && (
                        <>
                            {/* Status + Kuota */}
                            <div className="flex items-center justify-between gap-4 bg-slate-50 rounded-xl border border-slate-100 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${status.dot}`} />
                                    <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border leading-none ${status.className}`}>
                                        {status.label}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-500">
                                    <Users className="w-3.5 h-3.5" />
                                    <span className="text-[12px] font-bold tabular-nums">
                                        {jadwal.daya_tampung_murid?.toLocaleString('id-ID')}
                                        <span className="text-[10px] font-black text-slate-400 ml-1">Kuota</span>
                                    </span>
                                </div>
                            </div>

                            {/* Pendaftaran */}
                            <Section title="Pendaftaran" icon={CalendarDays}>
                                <SectionRow label="Periode" value={fmtRange(jadwal.pendaftaran_mulai, jadwal.pendaftaran_selesai)} mono />
                                <SectionRow label="Mode" value={MODE_LABEL[jadwal.mode_pendaftaran] ?? jadwal.mode_pendaftaran} />
                            </Section>

                            {/* Pengumuman */}
                            <Section title="Pengumuman" icon={Megaphone}>
                                <SectionRow label="Tanggal" value={fmtDate(jadwal.pengumuman)} mono />
                                <SectionRow label="Mode" value={MODE_LABEL[jadwal.mode_pengumuman] ?? jadwal.mode_pengumuman} />
                            </Section>

                            {/* Daftar Ulang */}
                            <Section title="Daftar Ulang" icon={Calendar}>
                                <SectionRow label="Periode" value={fmtRange(jadwal.pendaftaran_ulang_mulai, jadwal.pendaftaran_ulang_selesai)} mono />
                                <SectionRow label="Mode" value={MODE_LABEL[jadwal.mode_pendaftaran_ulang] ?? jadwal.mode_pendaftaran_ulang} />
                            </Section>

                            {/* Masa Pengenalan */}
                            <Section title="Masa Pengenalan" icon={Clock}>
                                <SectionRow label="Periode" value={fmtRange(jadwal.masa_pengenalan_mulai, jadwal.masa_pengenalan_selesai)} mono />
                                <SectionRow label="Mode" value={MODE_LABEL[jadwal.mode_pengenalan] ?? jadwal.mode_pengenalan} />
                            </Section>

                            {/* Meta */}
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <InfoRow label="Dibuat Pada" value={fmtDate(jadwal.dibuat_pada)} />
                                <InfoRow label="Diperbarui" value={fmtDate(jadwal.diperbaharui_pada)} />
                            </div>
                        </>
                    )}
                </div>

                {/* ── Footer ── */}
                {!loading && !error && jadwal && (
                    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-white">
                        <Button size="sm" variant="outline" onClick={onClose} className="text-xs">
                            Tutup
                        </Button>
                        <Button size="sm" onClick={() => { onEdit?.(jadwal); onClose?.() }} className="text-xs gap-1.5">
                            Edit Jadwal
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
