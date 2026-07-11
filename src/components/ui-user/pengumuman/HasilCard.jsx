'use client'

import { useRef } from 'react'
import { downloadPDF } from '@/utils/downloadPDF'
import { Trophy, Frown, ShieldCheck, Calendar, FileText, MessageSquare, MapPin, FileDown } from 'lucide-react'
import { formatSingleDate } from '@/utils/dateUtils'
import Link from 'next/link'
import TemplateSuratTerima from '@/components/ui-user/pengumuman/TemplateSuratTerima'


/**
 * HasilCard — Professional Admission Result Card
 */
function HasilCard({ pengumuman, data = {}, tahunAjaran = '-' }) {
    const suratRef = useRef(null)
    const diterima = pengumuman.pengumuman_hasil_seleksi === 'DITERIMA'

    const style = diterima
        ? {
            wrapper: 'border-emerald-200 bg-white shadow-[0_20px_50px_rgba(16,185,129,0.08)]',
            accent: 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400',
            badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            iconBg: 'bg-emerald-50 text-emerald-600',
            icon: Trophy,
            title: 'Selamat! Anda Diterima',
            subtitle: 'Anda terpilih sebagai siswa baru smp negeri 5 Narmada',
            verdict: 'DITERIMA',
            verdictColor: 'text-emerald-600'
        }
        : {
            wrapper: 'border-rose-200 bg-white shadow-[0_20px_50px_rgba(244,63,94,0.08)]',
            accent: 'bg-gradient-to-r from-rose-600 via-pink-500 to-rose-400',
            badge: 'bg-rose-50 text-rose-700 border-rose-100',
            iconBg: 'bg-rose-50 text-rose-600',
            icon: Frown,
            title: 'Keputusan Seleksi',
            subtitle: 'Terima kasih atas partisipasi Anda',
            verdict: 'TIDAK DITERIMA',
            verdictColor: 'text-rose-600'
        }

    const STUDENT_DATA = [
        { label: 'Nama Lengkap', value: data.nama_lengkap, icon: FileText },
        { label: 'No. Pendaftaran', value: data.nomor_pendaftaran, icon: HashIcon },
        { label: 'Asal Sekolah', value: data.nama_sekolah, icon: MapPin },
    ]

    function HashIcon(props) {
        return (
            <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>
        )
    }

    return (
        <div className={`relative border rounded-2xl overflow-hidden transition-all duration-700 ${style.wrapper}`}>
            {/* Top Accent Gradient */}
            <div className={`h-2 w-full ${style.accent}`} />

            {/* Hidden template for PDF generation */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '794px' }}>
                <div ref={suratRef} style={{ width: '794px' }}><TemplateSuratTerima data={data} /></div>
            </div>

            <div className="p-8 md:p-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
                    <div className="flex items-center gap-6">
                        <div className={`w-20 h-20 rounded-lg ${style.iconBg} flex items-center justify-center shadow-inner animate-in zoom-in-75 duration-700`}>
                            <style.icon className="w-10 h-10" />
                        </div>
                        <div>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest mb-3 ${style.badge}`}>
                                Status Pengumuman
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
                                {style.title}
                            </h2>
                            <p className="text-gray-500 font-medium mt-1 uppercase text-xs tracking-wide">
                                {style.subtitle}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 bg-gray-50 px-6 py-4 rounded-lg border border-gray-100 shrink-0">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Calendar className="w-3.5 h-3.5" /> Tanggal Pengumuman
                        </div>
                        <p className="text-sm font-black text-gray-900">
                            {formatSingleDate(pengumuman.tanggal_pengumuman)}
                        </p>
                    </div>
                </div>

                {/* Verdict Section */}
                <div className="relative mb-12">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-100 border-dashed"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <div className="bg-white px-6 py-2 rounded-full border border-gray-100 flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-blue-600" />
                            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Keputusan Resmi Panitia</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto text-center mb-10">
                    <p className="text-base text-gray-600 leading-relaxed">
                        Berdasarkan hasil seleksi administrasi, akademis, dan rapat pleno Panitia SPMB Tahun Pelajaran <strong>{tahunAjaran}</strong>, dengan ini menyatakan bahwa:
                    </p>
                </div>

                {/* Student Info Table (Modern Card) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    {STUDENT_DATA.map((item, idx) => (
                        <div key={idx} className="bg-gray-50/50 p-6 rounded-lg border border-gray-100/50 transition-all hover:bg-white hover:shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                            </div>
                            <p className="text-sm font-bold text-gray-900 truncate">
                                {item.value || '—'}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center py-6">
                    <p className="text-sm text-gray-500 uppercase font-black tracking-[0.3em] mb-4">Secara resmi dinyatakan</p>
                    <div className={`inline-block py-4 px-12 rounded-lg border-4 ${diterima ? 'border-emerald-100 bg-emerald-50' : 'border-rose-100 bg-rose-50'} animate-pulse duration-[3000ms]`}>
                        <h3 className={`text-4xl font-black tracking-tight ${style.verdictColor}`}>
                            {style.verdict}
                        </h3>
                    </div>
                    <p className="mt-8 text-sm text-gray-700 leading-relaxed font-medium">
                        Menjadi siswa/siswi <strong>SMP Negeri 5 Narmada</strong> <br />
                        Tahun Ajaran <strong>{tahunAjaran}</strong>.
                    </p>

                    {/* Tombol Unduh Surat Keputusan untuk status TIDAK_DITERIMA */}
                    {!diterima && (
                        <div className="flex justify-center mt-10">
                            <button
                                onClick={() => downloadPDF(suratRef, `Surat-Terima-${data.nomor_pendaftaran?.replace(/\s+/g, '-') || 'Pendaftar'}.pdf`)}
                                className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3.5 rounded-xl shadow-xl shadow-rose-500/25 flex items-center gap-3 text-sm font-black uppercase tracking-widest transition-all active:scale-95 group border border-rose-500 hover:border-rose-400"
                            >
                                <FileDown className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                                Unduh Surat Keputusan
                            </button>
                        </div>
                    )}
                </div>

                {/* Official Stamp/Notes */}
                {pengumuman.catatan && (
                    <div className="mt-12 bg-gray-900 rounded-lg p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <MessageSquare className="w-24 h-24" />
                        </div>
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Catatan Panitia</h4>
                            </div>
                            <p className="text-base text-gray-400 font-medium leading-relaxed italic">
                                "{pengumuman.catatan}"
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HasilCard
