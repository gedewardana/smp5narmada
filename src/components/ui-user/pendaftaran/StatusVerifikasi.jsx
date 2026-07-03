'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { motion } from 'framer-motion'
import ButtonReasuble from '@/components/buttonreasuble/ButtonReasuble'
import {
    CheckCircle2, Clock, AlertTriangle, XCircle,
    ArrowLeft, Printer, MessageCircle, Edit3, ChevronRight, Download
} from 'lucide-react'
import { downloadPDF } from '@/utils/downloadPDF'
import { useUserDashboard } from '@/hooks/useUserDashboard'
import KartuPreview from '@/components/ui-user/kartu/KartuPreview'

const STATUS_CONFIG = {
    MENUNGGU_VERIFIKASI: {
        color: 'blue',
        icon: <Clock className="w-8 h-8 text-blue-600 animate-[pulse_2s_infinite]" />,
        badge: '⏳ Menunggu Verifikasi',
        title: 'Tahap Verifikasi Pendaftaran',
        description: 'Data pendaftaran Anda sedang dalam antrean pemeriksaan oleh panitia. Proses ini biasanya memakan waktu 1–3 hari kerja.',
        checklist: ['Data diterima sistem', 'Menunggu validasi dokumen'],
    },
    VERIFIKASI: {
        color: 'emerald',
        icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
        badge: '✅ Diverifikasi',
        title: 'Pendaftaran Telah Diverifikasi',
        description: 'Selamat! Data Anda telah dinyatakan lengkap dan lolos tahap verifikasi administrasi.',
        checklist: ['Data Pendaftaran Lengkap', 'Verifikasi Administrasi Lolos'],
    },
    PERLU_PERBAIKAN: {
        color: 'amber',
        icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
        badge: '⚠️ Perlu Perbaikan',
        title: 'Terdapat Data yang Tidak Sesuai',
        description: 'Panitia menemukan beberapa data yang memerlukan koreksi. Mohon perbaiki sesuai catatan sebelum batas waktu berakhir.',
    },
    TOLAK: {
        color: 'red',
        icon: <XCircle className="w-8 h-8 text-red-600" />,
        badge: '❌ Pendaftaran Ditolak',
        title: 'Mohon Maaf, Anda Tidak Lolos',
        description: 'Berdasarkan hasil verifikasi dokumen, pendaftaran Anda tidak dapat kami proses lebih lanjut karena belum memenuhi kriteria.',
    }
}

export default function StatusVerifikasi({
    status = 'MENUNGGU_VERIFIKASI',
    catatan = null,
    tanggalPengumuman = '22 Februari 2026',
    detailCard = null,
    tanggalVerifikasi = null,
}) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.MENUNGGU_VERIFIKASI
    const themeColor = cfg.color

    // Ref untuk elemen KartuPreview yang akan di-capture sebagai PDF
    const kartuRef = useRef(null)
    const router = useRouter()

    // Ambil data kartu dari dashboard
    const { data: dashboardData } = useUserDashboard()
    const kartuData = {
        nomor_pendaftaran: dashboardData?.nomor_pendaftaran || '-',
        nama_lengkap: dashboardData?.nama_lengkap || '-',
        asal_sekolah: dashboardData?.nama_sekolah || '-',
        nilai_skhu: dashboardData?.nilai_skhu || '-',
        tanggal_verifikasi: dashboardData?.raw?.tanggal_verifikasi
            ? new Date(dashboardData.raw.tanggal_verifikasi).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            })
            : '-'
    }

    const handleDownload = () => {
        downloadPDF(kartuRef, `Kartu-Pendaftaran-${kartuData.nomor_pendaftaran}.pdf`)
    }

    const handlePerbaikiData = () => {
        if (dashboardData?.jadwal_aktif?.is_active) {
            router.push('/user/dashboard/pendaftaran/review-data')
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Pendaftaran Ditutup',
                text: 'Mohon maaf, pendaftaran telah ditutup. Anda tidak dapat memperbaiki data saat ini.',
                confirmButtonColor: '#3085d6',
            })
        }
    }

    // Map warna Tailwind secara dinamis (untuk menghindari purge CSS issue)
    const themes = {
        blue: { bg: 'bg-blue-50/50', border: 'border-blue-100', accent: 'bg-blue-600', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
        emerald: { bg: 'bg-emerald-50/50', border: 'border-emerald-100', accent: 'bg-emerald-600', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
        amber: { bg: 'bg-amber-50/50', border: 'border-amber-100', accent: 'bg-amber-600', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' },
        red: { bg: 'bg-red-50/50', border: 'border-red-100', accent: 'bg-red-600', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
    }

    const style = themes[themeColor]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl border ${style.border} ${style.bg} overflow-hidden shadow-sm backdrop-blur-sm`}
        >
            <div className={`h-1.5 w-full ${style.accent}`} />

            <div className="p-6 md:p-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Visual Status Side */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left shrink-0">
                        <div className={`w-20 h-20 rounded-2xl bg-white shadow-sm border ${style.border} flex items-center justify-center mb-4 transition-transform hover:rotate-3`}>
                            {cfg.icon}
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${style.badge}`}>
                            {cfg.badge}
                        </span>
                    </div>

                    {/* Main Info Side */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-3">{cfg.title}</h2>
                        <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl">{cfg.description}</p>

                        {/* Status Checkpoints */}
                        {cfg.checklist && (
                            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
                                {cfg.checklist.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm font-bold text-gray-500">
                                        <div className={`w-1.5 h-1.5 rounded-full ${style.accent}`} />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Dynamic Sections Based on Status */}
                        <div className="space-y-4">
                            {/* Special Section: SUCCESS/VERIFIED */}
                            {status === 'VERIFIKASI' && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-white/80 p-5 rounded-2xl border border-emerald-100 shadow-sm group hover:border-emerald-300 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <Printer className="w-5 h-5 text-emerald-600" />
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500" />
                                        </div>
                                        <h4 className="text-sm font-bold text-gray-900">Kartu Pendaftaran</h4>
                                        <p className="text-xs text-gray-500 mb-3">Wajib dibawa saat verifikasi offline.</p>
                                        <button
                                            onClick={handleDownload}
                                            className="text-xs font-black text-emerald-600 uppercase tracking-wider hover:underline flex items-center gap-2 cursor-pointer"
                                        >
                                            Silahkan download <Download className="w-4 h-4" />
                                        </button>

                                        {/* Hidden KartuPreview sebagai target PDF */}
                                        <div ref={kartuRef} className="absolute -left-[9999px] top-0 w-[794px] pointer-events-none">
                                            <KartuPreview data={kartuData} />
                                        </div>
                                    </div>
                                    <div className="bg-white/80 p-5 rounded-2xl border border-gray-100 shadow-sm">
                                        <Clock className="w-5 h-5 text-blue-600 mb-2" />
                                        <h4 className="text-sm font-bold text-gray-900">Hasil Seleksi</h4>
                                        <p className="text-xs text-gray-500">Diumumkan pada <span className="font-bold text-gray-700">{tanggalPengumuman}</span></p>
                                    </div>
                                </div>
                            )}

                            {/* Catatan Panitia */}
                            {catatan && (
                                <div className="bg-white border-l-4 border-amber-400 p-5 rounded-r-2xl shadow-sm">
                                    <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-2">Instruksi Panitia</h4>
                                    <p className="text-sm text-gray-700 italic leading-relaxed">"{catatan}"</p>
                                </div>
                            )}

                            {/* Render Detail Card from Parent */}
                            {detailCard && <div className="mt-4">{detailCard}</div>}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-10 flex flex-wrap gap-4 border-t border-gray-100 pt-8">
                            {status === 'PERLU_PERBAIKAN' ? (
                                <>
                                    <ButtonReasuble onClick={handlePerbaikiData} variant="primary">
                                        <Edit3 className="w-4 h-4 mr-2" /> Perbaiki Data
                                    </ButtonReasuble>
                                    <ButtonReasuble href="https://wa.me/..." variant="outline">
                                        <MessageCircle className="w-4 h-4 mr-2" /> Tanya Panitia
                                    </ButtonReasuble>
                                </>
                            ) : (
                                <ButtonReasuble href="/user/dashboard" variant="secondary">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
                                </ButtonReasuble>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}