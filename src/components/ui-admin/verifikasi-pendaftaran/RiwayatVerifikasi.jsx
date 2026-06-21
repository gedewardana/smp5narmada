'use client'
import { CheckCircle2, AlertCircle, XCircle, Clock, MessageSquare } from 'lucide-react'

const AKSI_CONFIG = {
    'DIVERIFIKASI': {
        label: 'Diverifikasi',
        icon: CheckCircle2,
        dot: 'bg-emerald-500',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    'LOLOS': {
        label: 'Lolos',
        icon: CheckCircle2,
        dot: 'bg-emerald-500',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    'PERLU_PERBAIKAN': {
        label: 'Perlu Perbaikan',
        icon: AlertCircle,
        dot: 'bg-amber-500',
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    'PERBAIKAN': {
        label: 'Perlu Perbaikan',
        icon: AlertCircle,
        dot: 'bg-amber-500',
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    'DITOLAK': {
        label: 'Ditolak',
        icon: XCircle,
        dot: 'bg-rose-500',
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    'TOLAK': {
        label: 'Ditolak',
        icon: XCircle,
        dot: 'bg-rose-500',
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
    },
}

function formatTanggal(iso) {
    if (!iso) return '-'
    return new Date(iso).toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}

export default function CatatanVerifikasi({ logs = [] }) {
    if (logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed">
                <MessageSquare className="w-10 h-10 mb-3 opacity-30 text-slate-400" />
                <p className="text-sm font-medium tracking-wide">Belum ada catatan verifikasi</p>
                <p className="text-[11px] mt-1 opacity-70">Riwayat akan muncul setelah dilakukan verifikasi.</p>
            </div>
        )
    }

    return (
        <div className="max-w-3xl">
            <div className="space-y-0">
                {logs.map((log, idx) => {
                    const normalizedAction = log.action ? log.action.toUpperCase().replace(/\s+/g, '_') : 'LOLOS'
                    const cfg = AKSI_CONFIG[normalizedAction] || AKSI_CONFIG['LOLOS']
                    const Icon = cfg.icon
                    const isLast = idx === logs.length - 1

                    return (
                        <div key={log.id} className="flex gap-4 group">
                            {/* Timeline dot + garis */}
                            <div className="flex flex-col items-center">
                                <div className={`w-3.5 h-3.5 rounded-full mt-1 flex-shrink-0 ring-4 ring-white shadow-sm z-10 transition-transform group-hover:scale-110 ${cfg.dot}`} />
                                {!isLast && <div className="w-[2px] flex-1 bg-slate-100 my-1 group-hover:bg-slate-200 transition-colors" />}
                            </div>

                            {/* Content */}
                            <div className="pb-6 flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${cfg.badge}`}>
                                        <Icon className="w-3.5 h-3.5" />
                                        {cfg.label}
                                    </span>

                                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium ml-1">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTanggal(log.dibuat_pada)}</span>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                        <span>Oleh: <span className="font-semibold text-slate-700">{log.diverifikasi_oleh}</span></span>
                                    </div>
                                </div>

                                {log.catatan ? (
                                    <div className="text-[13px] text-slate-700 bg-slate-50 border-l-2 border-slate-300 rounded-r-xl px-4 py-3 leading-relaxed shadow-sm">
                                        &ldquo;{log.catatan}&rdquo;
                                    </div>
                                ) : (
                                    <div className='flex items-center gap-2 bg-slate-50/50 border border-slate-100 border-dashed rounded-xl px-4 py-2.5'>
                                        <p className="text-[11px] text-slate-400 italic">Tidak ada catatan tambahan ditinggalkan.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
