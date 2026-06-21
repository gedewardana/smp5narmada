'use client'
import React from 'react'
import { Edit2Icon, CheckSquare, Megaphone, CheckCircle2, GraduationCap, Globe, Building2, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function VisualTemlineJadwal({ onOpenModal, jadwalData }) {

    // variabel untuk menentukan apakah akan menampilkan tombol edit atau tambah
    const isEdit = jadwalData?.id_jadwal

    const fmt = (dateStr) => {
        if (!dateStr) return '-'
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        }).format(new Date(dateStr))
    }


    const jadwalpmb = [
        {
            icon: CheckSquare,
            label: 'Pendaftaran',
            mode: 'online',
            date: `${fmt(jadwalData?.pendaftaran_mulai)} — ${fmt(jadwalData?.pendaftaran_selesai)}`,
            color: 'bg-sky-500',
            lightColor: 'bg-sky-50',
            textColor: 'text-sky-600',
            borderColor: 'border-sky-200',
        },
        {
            icon: Megaphone,
            label: 'Pengumuman',
            mode: 'online',
            date: fmt(jadwalData?.pengumuman),
            color: 'bg-violet-500',
            lightColor: 'bg-violet-50',
            textColor: 'text-violet-600',
            borderColor: 'border-violet-200',
        },
        {
            icon: CheckCircle2,
            label: 'Daftar Ulang',
            mode: 'offline',
            date: `${fmt(jadwalData?.pendaftaran_ulang_mulai)} — ${fmt(jadwalData?.pendaftaran_ulang_selesai)}`,
            color: 'bg-orange-500',
            lightColor: 'bg-orange-50',
            textColor: 'text-orange-600',
            borderColor: 'border-orange-200',
        },
        {
            icon: GraduationCap,
            label: 'Masa Pengenalan',
            mode: 'offline',
            date: `${fmt(jadwalData?.masa_pengenalan_mulai)} — ${fmt(jadwalData?.masa_pengenalan_selesai)}`,
            color: 'bg-teal-500',
            lightColor: 'bg-teal-50',
            textColor: 'text-teal-600',
            borderColor: 'border-teal-200',
        },
    ]



    const statusConfig = {
        DIBUKA: { label: 'Dibuka', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        DITUTUP: { label: 'Ditutup', cls: 'bg-gray-500 text-white border-gray-200' },
        BELUM_DIBUKA: { label: 'Belum Dibuka', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    }



    const st = statusConfig[jadwalData?.status_jadwal] || statusConfig.BELUM_DIBUKA

    return (
        <Card className="mt-6">
            <CardHeader>
                {/* Top bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Tahun Ajaran</span>
                            <span className="text-base font-bold text-gray-800 leading-tight pt-1">{jadwalData?.tahun_pelajaran}</span>
                        </div>

                        <div className="w-px h-8 bg-gray-200 mx-1" />

                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Daya Tampung</span>
                            <span className="text-base font-bold text-gray-800 leading-tight pt-1">{jadwalData?.daya_tampung_murid} Siswa</span>
                        </div>
                        <div className="w-px h-8 bg-gray-200 mx-1" />

                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Status PMB</span>
                            <span className={`text-base rounded-full px-2 ${st.cls}`}>{st.label}</span>
                        </div>
                    </div>
                    <Button
                        onClick={onOpenModal}
                        size="sm"
                        variant='default'
                    >
                        {isEdit ? <Edit2Icon className="w-4 h-4" /> : <Plus className="w-4 h-4" />}

                    </Button>
                </div>

                {/* Stepper - desktop horizontal, mobile vertical */}
                <div className="hidden md:flex items-start gap-0">
                    {jadwalpmb.map((step, i) => {
                        const Icon = step.icon
                        const isLast = i === jadwalpmb.length - 1
                        return (
                            <React.Fragment key={i}>
                                <div className="flex flex-col items-center flex-1 min-w-0">
                                    {/* Icon circle */}
                                    <div className={`w-12 h-12 rounded-2xl ${step.lightColor} ${step.borderColor} border-2 flex items-center justify-center mb-3`}>
                                        <Icon className={`w-5 h-5 ${step.textColor}`} />
                                    </div>

                                    {/* Label + badge */}
                                    <span className="text-sm font-bold text-gray-800 text-center leading-tight mb-1">{step.label}</span>
                                    <div className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider mb-2 ${step.textColor}`}>
                                        {step.mode === 'online'
                                            ? <><Globe className="w-3 h-3" /> Online</>
                                            : <><Building2 className="w-3 h-3" /> Offline</>
                                        }
                                    </div>

                                    {/* Date */}
                                    <div className={`w-full text-center text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 leading-snug`}>
                                        {step.date}
                                    </div>
                                </div>

                                {/* Connector */}
                                {!isLast && (
                                    <div className="flex items-start pt-6 px-1">
                                        <div className="w-8 h-px bg-gray-200 mt-0"></div>
                                    </div>
                                )}
                            </React.Fragment>
                        )
                    })}
                </div>

                {/* Mobile vertical */}
                <div className="flex md:hidden flex-col gap-4">
                    {jadwalpmb.map((step, i) => {
                        const Icon = step.icon
                        const isLast = i === jadwalpmb.length - 1
                        return (
                            <div key={i} className="flex gap-4">
                                {/* Left: icon + line */}
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-xl ${step.lightColor} ${step.borderColor} border-2 flex items-center justify-center shrink-0`}>
                                        <Icon className={`w-4 h-4 ${step.textColor}`} />
                                    </div>
                                    {!isLast && <div className="w-px flex-1 bg-gray-200 my-2" />}
                                </div>

                                {/* Right: content */}
                                <div className="pb-2">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-sm font-bold text-gray-800">{step.label}</span>
                                        <span className={`text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 ${step.textColor}`}>
                                            {step.mode === 'online'
                                                ? <><Globe className="w-3 h-3" /> Online</>
                                                : <><Building2 className="w-3 h-3" /> Offline</>
                                            }
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">{step.date}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardHeader>
        </Card>
    )
}

export default VisualTemlineJadwal