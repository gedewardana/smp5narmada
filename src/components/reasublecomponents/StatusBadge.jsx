'use client'

import React from 'react'
import {
    CheckCircle2,
    Circle,
    Clock,
    Search,
    AlertTriangle,
    XCircle,
    Lock,
    CalendarClock
} from 'lucide-react'

// ─── Status Config (Satu Sumber Kebenaran) ────────────────────────────────────
// Berisi konfigurasi visual untuk Badge, Stepper, dan Card berdasarkan status.

export const STATUS_CONFIG = {
    completed: {
        icon: CheckCircle2,
        label: 'Selesai',
        badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        circleClass: 'bg-emerald-500 text-white border-emerald-300 shadow-emerald-100',
        cardClass: 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm',
        lineClass: 'bg-emerald-300',
        showCta: true,
        pulse: false,
    },
    active: {
        icon: Clock,
        label: 'Berlangsung',
        badgeClass: 'bg-blue-50 text-blue-600 border-blue-100',
        circleClass: 'bg-blue-600 text-white border-blue-300 shadow-blue-100',
        cardClass: 'bg-blue-50/50 border-blue-100 shadow-lg shadow-blue-500/5',
        lineClass: 'bg-slate-100',
        showCta: true,
        pulse: true,
        pulseClass: 'bg-blue-400/25',
    },
    menunggu_verifikasi: {
        icon: Search,
        label: 'Menunggu Verifikasi',
        badgeClass: 'bg-amber-50 text-amber-600 border-amber-100',
        circleClass: 'bg-amber-400 text-white border-amber-300 shadow-amber-100',
        cardClass: 'bg-amber-50/40 border-amber-100 shadow-sm',
        lineClass: 'bg-slate-100',
        showCta: true,
        pulse: true,
        pulseClass: 'bg-amber-400/25',
    },
    perlu_perbaikan: {
        icon: AlertTriangle,
        label: 'Perlu Perbaikan',
        badgeClass: 'bg-orange-50 text-orange-600 border-orange-100',
        circleClass: 'bg-orange-500 text-white border-orange-300 shadow-orange-100',
        cardClass: 'bg-orange-50/40 border-orange-200 shadow-sm',
        lineClass: 'bg-slate-100',
        showCta: true,
        pulse: true,
        pulseClass: 'bg-orange-400/25',
    },
    tolak: {
        icon: XCircle,
        label: 'Ditolak',
        badgeClass: 'bg-rose-50 text-rose-600 border-rose-100',
        circleClass: 'bg-rose-500 text-white border-rose-300 shadow-rose-100',
        cardClass: 'bg-rose-50/30 border-rose-100',
        lineClass: 'bg-slate-100',
        showCta: true,
        pulse: false,
    },
    diterima: {
        icon: CheckCircle2,
        label: 'Diterima',
        badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        circleClass: 'bg-emerald-500 text-white border-emerald-300 shadow-emerald-100',
        cardClass: 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-200 shadow-sm',
        lineClass: 'bg-emerald-300',
        showCta: true,
        pulse: true,
        pulseClass: 'bg-emerald-400/25',
    },
    tidak_diterima: {
        icon: XCircle,
        label: 'Tidak Diterima',
        badgeClass: 'bg-rose-50 text-rose-600 border-rose-100',
        circleClass: 'bg-rose-500 text-white border-rose-300 shadow-rose-100',
        cardClass: 'bg-rose-50/30 border-rose-100',
        lineClass: 'bg-slate-100',
        showCta: true,
        pulse: false,
    },
    pending: {
        icon: Circle,
        label: 'Belum Dimulai',
        badgeClass: 'bg-gray-50 text-gray-400 border-gray-100',
        circleClass: 'bg-white text-slate-300 border-slate-100',
        cardClass: 'bg-white border-slate-100',
        lineClass: 'bg-slate-100',
        showCta: false,
        pulse: false,
    },
    belum_dibuka: {
        icon: CalendarClock,
        label: 'Belum Dibuka',
        badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
        circleClass: 'bg-slate-100 text-slate-400 border-slate-200',
        cardClass: 'bg-slate-50/50 border-slate-100',
        lineClass: 'bg-slate-100',
        showCta: false,
        pulse: false,
    },
    ditutup: {
        icon: Lock,
        label: 'Telah Ditutup',
        badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
        circleClass: 'bg-slate-200 text-slate-500 border-slate-300',
        cardClass: 'bg-slate-50 border-slate-200',
        lineClass: 'bg-slate-100',
        showCta: false,
        pulse: false,
    },
}

/**
 * StatusBadge — Komponen badge status yang konsisten.
 * @param {string} status - Key status dari STATUS_CONFIG
 */
export default function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
    const Icon = config.icon
    return (
        <span className={`
            px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest 
            border flex items-center gap-1.5 whitespace-nowrap
            ${config.badgeClass}
        `}>
            <Icon className="w-3 h-3" />
            {config.label}
        </span>
    )
}
