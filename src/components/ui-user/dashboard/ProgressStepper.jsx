'use client'

import React from 'react'
import Link from 'next/link'
import {
    CheckCircle2,
    ChevronRight,
    Calendar,
    XCircle,
} from 'lucide-react'
import StatusBadge, { STATUS_CONFIG } from '@/components/reasublecomponents/StatusBadge'
import { useUserDashboard } from '@/hooks/useUserDashboard'


// ─── Main Component ──────────────────────────────────────────────────────────

export default function TimelinePendaftaran() {
    const { data, isLoading: isDashboardLoading } = useUserDashboard()

    const raw = data?.raw

    // Clean Code: Mengonstruksi STEPS secara dinamis menggunakan data real dari Jadwal PMB
    const dynamicSteps = React.useMemo(() => [
        {
            id: 1,
            title: 'Pendaftaran Online',
            desc: 'Lengkapi formulir dan berkas persyaratan sesuai dokumen asli.',
            descByStatus: {
                active: 'Silakan lengkapi formulir dan unggah berkas persyaratan sesuai dokumen asli.',
                belum_dibuka: 'Pendaftaran belum dibuka. Pantau terus jadwal pendaftaran yang tersedia.',
                ditutup: 'Masa pendaftaran telah berakhir. Anda tidak dapat melakukan pendaftaran saat ini.',
                menunggu_verifikasi: 'Berkas Anda sedang diperiksa oleh panitia. Harap tunggu konfirmasi.',
                perlu_perbaikan: 'Panitia menemukan ketidaksesuaian pada berkas Anda. Segera perbaiki dan ajukan ulang.',
                tolak: 'Pendaftaran Anda tidak dapat dilanjutkan. Hubungi panitia untuk informasi lebih lanjut.',
                completed: 'Pendaftaran Anda telah selesai dan berhasil diverifikasi.',
            },
            link: '/user/dashboard/pendaftaran',
            date: data?.pendaftaran_range || '-',
            ctaLabel: 'Daftar',
            ctaLabelByStatus: {
                completed: 'Detail',
                menunggu_verifikasi: 'Detail',
                tolak: 'Detail',
                perlu_perbaikan: 'Detail',
            }
        },
        {
            id: 2,
            title: 'Pengumuman Hasil Seleksi',
            desc: 'Hasil keputusan resmi akan muncul di dashboard Anda pada tanggal pengumuman.',
            descByStatus: {
                active: 'Hasil keputusan resmi akan muncul di dashboard Anda pada tanggal pengumuman.',
                completed: 'Selamat! Anda telah diterima. Segera lakukan daftar ulang sesuai jadwal.',
                diterima: 'Selamat! Anda dinyatakan LULUS SELEKSI. Segera lakukan daftar ulang.',
                tidak_diterima: 'Mohon maaf, Anda dinyatakan TIDAK LULUS SELEKSI. Tetap semangat!',
            },
            link: '/user/dashboard/pengumuman',
            date: data?.pengumuman_date || '-',
            ctaLabel: 'Detail Pengumuman',
            ctaLabelByStatus: {
                completed: 'Detail',
                diterima: 'Detail',
                tidak_diterima: 'Detail',
            }
        },
    ], [data]);
    // ─── Logika Mapping Status Backend ke UI Stepper ───

    const resolveStatus = () => {
        let currentStep = 1
        let statusOverride = 'active'

        const jadwalStatus = data?.jadwal_aktif?.status_jadwal

        // Jika belum submit data (masih kosongan/Draft), terapkan blokir jadwal jika ada
        if (!raw || raw.status_pendaftaran === 'DRAFT') {
            if (jadwalStatus === 'BELUM_DIBUKA') return { currentStep: 1, statusOverride: 'belum_dibuka' }
            if (jadwalStatus === 'DITUTUP') return { currentStep: 1, statusOverride: 'ditutup' }
            return { currentStep: 1, statusOverride: 'active' }
        }

        const { status_pendaftaran, status_verifikasi, pengumuman_hasil_seleksi } = raw

        // Cek hasil seleksi terlebih dahulu jika sudah ada nilainya
        if (pengumuman_hasil_seleksi === 'DITERIMA') {
            return { currentStep: 2, statusOverride: 'diterima' }
        }
        if (pengumuman_hasil_seleksi === 'TIDAK_DITERIMA') {
            return { currentStep: 2, statusOverride: 'tidak_diterima' }
        }

        // Jika Pendaftaran sudah diverifikasi akhir (Lolos Verifikasi)
        if (status_pendaftaran === 'VERIFIKASI' || status_verifikasi === 'VERIFIKASI') {
            return { currentStep: 2, statusOverride: 'active' }
        }

        // Jika sudah Submit, cek status verifikasi
        if (status_pendaftaran === 'SUBMITTED') {
            if (status_verifikasi === 'TOLAK') {
                return { currentStep: 1, statusOverride: 'tolak' }
            }
            if (status_verifikasi === 'PERLU_PERBAIKAN') {
                return { currentStep: 1, statusOverride: 'perlu_perbaikan' }
            }
            return { currentStep: 1, statusOverride: 'menunggu_verifikasi' }
        }

        // Jika status Pendaftaran Ditolak total
        if (status_pendaftaran === 'TOLAK') {
            return { currentStep: 1, statusOverride: 'tolak' }
        }

        return { currentStep, statusOverride }
    }

    const { currentStep, statusOverride } = resolveStatus()

    const stepsWithStatus = dynamicSteps.map((step) => ({
        ...step,
        status:
            step.id < currentStep ? 'completed'
                : step.id === currentStep ? statusOverride
                    : 'pending',
    }))

    if (isDashboardLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                {[1, 2].map(i => (
                    <div key={i} className="flex gap-3 sm:gap-6">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl shrink-0" />
                        <div className="flex-1 h-32 bg-slate-50 rounded-2xl border border-slate-100" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {stepsWithStatus.map((step, index) => {
                const config = STATUS_CONFIG[step.status] || STATUS_CONFIG.pending
                const Icon = config.icon

                return (
                    <div key={step.id} className="relative flex items-start gap-3 sm:gap-6">

                        {/* ── Vertical Connector Line ── */}
                        {index < stepsWithStatus.length - 1 && (
                            <div className={`
                                absolute left-6 top-12 bottom-[-24px] w-0.5 rounded-full transition-colors duration-700
                                ${config.lineClass}
                            `} />
                        )}

                        {/* ── Step Circle ── */}
                        <div className="relative shrink-0 z-10">
                            <div className={`
                                w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border-2 transition-all duration-500 shadow-sm
                                ${config.circleClass}
                            `}>
                                {step.status === 'completed' || step.status === 'diterima'
                                    ? <CheckCircle2 className="w-6 h-6" />
                                    : step.status === 'tolak' || step.status === 'tidak_diterima'
                                        ? <XCircle className="w-6 h-6" />
                                        : step.id
                                }
                            </div>

                            {/* Pulse ring */}
                            {config.pulse && (
                                <div className={`absolute inset-0 rounded-2xl ${config.pulseClass} animate-ping -z-10`} />
                            )}
                        </div>

                        {/* ── Step Card ── */}
                        <div className={`
                            flex-1 p-4 sm:p-6 rounded-2xl border transition-all duration-500 mb-6
                            ${config.cardClass}
                        `}>
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                                <div className="break-words min-w-0 pr-2">
                                    <h4 className="text-sm sm:text-base font-black tracking-tight text-gray-900 leading-snug">
                                        {step.title}
                                    </h4>
                                    <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <Calendar className="w-3 h-3" />
                                        {step.date}
                                    </div>
                                </div>
                                <StatusBadge status={step.status} />
                            </div>

                            {/* Description — Berubah sesuai status */}
                            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-5">
                                {step.descByStatus?.[step.status] ?? step.desc}
                            </p>

                            {/* CTA Button — hanya untuk step yang showCta = true */}
                            {config.showCta && step.link && (
                                <Link
                                    href={step.link}
                                    className={`
                                        inline-flex items-center justify-center w-full sm:w-auto gap-2 sm:gap-2.5 px-4 py-3 sm:px-5 sm:py-2.5 rounded-xl 
                                        text-[10px] sm:text-xs font-black uppercase tracking-widest text-center
                                        shadow-lg transition-all group/btn
                                        hover:-translate-y-0.5 active:translate-y-0
                                        ${step.status === 'perlu_perbaikan'
                                            ? 'bg-orange-500 text-white shadow-orange-500/25 hover:bg-orange-600'
                                            : 'bg-blue-600 text-white shadow-blue-500/25 hover:bg-blue-700'
                                        }
                                    `}
                                >
                                    {step.ctaLabelByStatus?.[step.status] ?? step.ctaLabel}
                                    <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                </Link>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}