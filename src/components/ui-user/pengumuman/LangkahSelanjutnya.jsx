'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { downloadPDF } from '@/utils/downloadPDF'
import TemplateSuratTerima from '@/components/ui-user/pengumuman/TemplateSuratTerima'
import TemplatePernyataanSiswa from '@/components/ui-user/pengumuman/TemplatePernyataanSiswa'
import TemplatePernyataanOrtu from '@/components/ui-user/pengumuman/TemplatePernyataanOrtu'
import TemplateRincianBaju from '@/components/ui-user/pengumuman/TemplateRincianBaju'
import {
    FileDown,
    CheckCircle2,
    MapPin,
    Calendar,
    Clock,
    AlertCircle,
    Printer,
    Rocket,
    Info,
    ChevronRight,
    Search
} from 'lucide-react'

const DOKUMEN = [
    {
        no: '1',
        label: 'Surat Tanda Terima',
        icon: FileDown,
        refKey: 'suratTerima',
        fileName: (nomor) => `Surat-Terima-${nomor}.pdf`,
    },
    {
        no: '2',
        label: 'Surat Pernyataan Siswa',
        icon: FileDown,
        refKey: 'pernyataanSiswa',
        fileName: (nomor) => `Pernyataan-Siswa-${nomor}.pdf`,
    },
    {
        no: '3',
        label: 'Surat Pernyataan Orang Tua',
        icon: FileDown,
        refKey: 'pernyataanOrtu',
        fileName: (nomor) => `Pernyataan-OrangTua-${nomor}.pdf`,
    },
    {
        no: '4',
        label: 'Rincian Baju Seragam',
        icon: FileDown,
        refKey: 'rincianBaju',
        fileName: (nomor) => `Rincian-Baju-${nomor}.pdf`,
    },
]

export default function LangkahSelanjutnya({
    data = {},
    tanggalDaftarUlang = '-',
    lokasiDaftarUlang = 'SMP Negeri 5 Narmada',
    jamOperasional = '08.00–14.00 WITA',
}) {
    const refs = {
        suratTerima: useRef(),
        pernyataanSiswa: useRef(),
        pernyataanOrtu: useRef(),
        rincianBaju: useRef(),
    }

    const nomor = data?.nomor_pendaftaran || 'Draft'

    const REQUIREMENTS = [
        'Surat Tanda Penerimaan (Hasil download)',
        'Surat Pernyataan Siswa (Hasil download)',
        'Surat Pernyataan Orang Tua (Hasil download)',
        'Rincian Baju Seragam (Hasil download)',
        'Fotokopi Akta Kelahiran (2 lembar)',
        'Fotokopi Kartu Keluarga (KK) (2 lembar)',
        'Surat Keterangan Kelulusan (SKL) asli',
        'Fotokopi Kartu KIP / KKS (Jika ada)',
        'Fotokopi KTP Orang Tua (1 lembar)',
    ]

    return (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Hidden templates for PDF generation */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '794px' }}>
                <div ref={refs.suratTerima} style={{ width: '794px' }}><TemplateSuratTerima data={data} /></div>
                <div ref={refs.pernyataanSiswa} style={{ width: '794px' }}><TemplatePernyataanSiswa data={data} /></div>
                <div ref={refs.pernyataanOrtu} style={{ width: '794px' }}><TemplatePernyataanOrtu data={data} /></div>
                <div ref={refs.rincianBaju} style={{ width: '794px' }}><TemplateRincianBaju data={data} /></div>
            </div>

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
                        <Rocket className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Apa Langkah Selanjutnya?</h2>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-0.5">Proses Daftar Ulang Offline</p>
                    </div>
                </div>
                <p className="text-gray-500 font-medium ml-13 max-w-2xl leading-relaxed">
                    Selamat atas kelulusan Anda. Selesaikan proses pendaftaran ulang secara tatap muka (offline) di sekolah sesuai jadwal berikut.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Stepper Column */}
                <div className="lg:col-span-12 space-y-12">

                    {/* STEP 1: Download Documents */}
                    <div className="relative pl-12 sm:pl-16">
                        <div className="absolute left-0 top-0 w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black z-10 shadow-sm">
                            01
                        </div>
                        <div className="absolute left-5 sm:left-6 top-10 sm:top-12 bottom-[-48px] w-0.5 bg-gray-100" />

                        <div>
                            <h3 className="text-lg font-black text-gray-900 mb-2">Persiapkan & Cetak Dokumen Resmi</h3>
                            <p className="text-sm text-gray-500 font-medium mb-6">Unduh dan cetak seluruh berkas pendaftaran berikut sebagai syarat utama daftar ulang.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                {DOKUMEN.map((doc, idx) => (
                                    <div key={idx} className="group p-5 bg-white border border-gray-100 rounded-lg hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all mb-4 flex items-center justify-center">
                                            <doc.icon className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm font-black text-gray-800 mb-4 h-10 leading-snug line-clamp-2">
                                            {doc.label}
                                        </p>
                                        <button
                                            onClick={() => downloadPDF(refs[doc.refKey], doc.fileName(nomor))}
                                            className="w-full h-10 cursor-pointer rounded-lg bg-gray-50 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-700 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 border border-transparent group-hover:border-blue-100"
                                        >
                                            Download <FileDown className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50/50 px-3 py-1.5 rounded-lg border border-amber-100 w-fit">
                                <Info className="w-3 h-3" /> Gunakan kertas A4 dan pastikan cetakan terbaca jelas
                            </div>
                        </div>
                    </div>

                    {/* STEP 2: Gather Requirements */}
                    <div className="relative pl-12 sm:pl-16">
                        <div className="absolute left-0 top-0 w-10 sm:w-12 h-10 sm:h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-black z-10 shadow-sm">
                            02
                        </div>
                        <div className="absolute left-5 sm:left-6 top-10 sm:top-12 bottom-[-48px] w-0.5 bg-gray-100" />

                        <div>
                            <h3 className="text-lg font-black text-gray-900 mb-2">Lengkapi Berkas Pendukung</h3>
                            <p className="text-sm text-gray-500 font-medium mb-6">Siapkan dokumen fisik berikut (asli dan fotokopi) untuk diserahkan ke Panitia.</p>

                            <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm overflow-hidden group">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                                    {REQUIREMENTS.map((req, idx) => (
                                        <div key={idx} className="flex items-start gap-3 group/item">
                                            <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-sm text-gray-600 font-medium group-hover/item:text-gray-900">
                                                {req}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STEP 3: Visit School */}
                    <div className="relative pl-12 sm:pl-16">
                        <div className="absolute left-0 top-0 w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black z-10 shadow-sm">
                            03
                        </div>

                        <div>
                            <h3 className="text-lg font-black text-gray-900 mb-2">Verifikasi Berkas di Sekolah</h3>
                            <p className="text-sm text-gray-500 font-medium mb-6">Kunjungi lokasi pendaftaran ulang sesuai jadwal resmi yang telah ditentukan.</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex items-center gap-5 p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 group-hover:text-amber-500">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tanggal</p>
                                        <p className="text-sm font-black text-gray-900">{tanggalDaftarUlang}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5 p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lokasi</p>
                                        <p className="text-sm font-black text-gray-900">{lokasiDaftarUlang}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5 p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Jam Kerja</p>
                                        <p className="text-sm font-black text-gray-900">{jamOperasional}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Critical Deadline Alert */}
            <div className="mt-16 group relative overflow-hidden rounded-3xl bg-gray-900 p-8 md:p-10 text-white shadow-2xl shadow-gray-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-all duration-700" />
                <div className="relative flex flex-col md:flex-row items-center gap-8">
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-8 h-8 text-rose-500 animate-pulse" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h4 className="text-lg font-black mb-2 flex items-center justify-center md:justify-start gap-2 uppercase tracking-tight">
                            Peringatan Penting
                        </h4>
                        <p className="text-gray-400 font-medium leading-relaxed">
                            Batas waktu pendaftaran ulang adalah sesuai jadwal di atas. Peserta yang tidak hadir melakukan pendaftaran ulang hingga hari terakhir dianggap <span className="text-rose-400 font-bold">MENGUNDURKAN DIRI</span> secara otomatis dari sistem pendaftaran.
                        </p>
                    </div>
                    <div className="shrink-0 flex items-center justify-center h-12 w-12 rounded-full border border-white/10 text-white/20">
                        <Info className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>
    )
}
