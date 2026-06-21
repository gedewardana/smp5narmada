/**
 * pengumumanConfig.js
 * Satu sumber kebenaran untuk warna dan label status pengumuman.
 * Dipakai di: FormModalPengumuman.jsx, SelectionsModal.jsx, badge status, dsb.
 */

import { CheckCircle2, XCircle } from 'lucide-react'

// ─── Warna per status ──────────────────────────────────────────────────────────
export const HASIL_SELEKSI_COLORS = {
    DITERIMA: {
        active  : 'border-green-500 bg-green-50 text-green-700',
        icon    : 'text-green-600',
        badge   : 'bg-green-100 text-green-800',
        btn     : 'bg-green-600 hover:bg-green-700 text-white',
        radio   : 'border-green-600 bg-green-600',
        hover   : 'hover:border-green-200 hover:bg-green-50',
        selected: 'border-green-500 bg-green-50 text-green-800 shadow-sm',
    },
    TIDAK_DITERIMA: {
        active  : 'border-rose-500 bg-rose-50 text-rose-700',
        icon    : 'text-rose-600',
        badge   : 'bg-rose-100 text-rose-800',
        btn     : 'bg-rose-600 hover:bg-rose-700 text-white',
        radio   : 'border-rose-600 bg-rose-600',
        hover   : 'hover:border-rose-200 hover:bg-rose-50',
        selected: 'border-rose-500 bg-rose-50 text-rose-800 shadow-sm',
    },
    MENUNGGU_PENGUMUMAN: {
        badge: 'bg-yellow-100 text-yellow-800',
    },
    default: {
        badge: 'bg-gray-100 text-gray-600',
    },
}

// ─── Opsi pilihan (untuk form radio / card selection) ─────────────────────────
export const SELECTION_OPTIONS = [
    {
        id    : 'DITERIMA',
        label : 'Diterima',
        icon  : CheckCircle2,
        colors: HASIL_SELEKSI_COLORS.DITERIMA,
    },
    {
        id    : 'TIDAK_DITERIMA',
        label : 'Tidak Diterima',
        icon  : XCircle,
        colors: HASIL_SELEKSI_COLORS.TIDAK_DITERIMA,
    },
]

// ─── Helper: ambil badge class dari nilai status ───────────────────────────────
export function getBadgeClass(status) {
    return (HASIL_SELEKSI_COLORS[status] ?? HASIL_SELEKSI_COLORS.default).badge
}
