'use client'

import React, { useState } from 'react'
import { X, MapPin, Trophy, Star, Eye, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BerkasViewer from '../verifikasi-pendaftaran/BerkasViewer'
import { handleDownload } from '@/utils/downloadUtils'



import { usePengumumanID } from '@/hooks/usePengumumanID'

export default function ModalDetail({ isOpen, initialData, onClose, onSelectItem }) {
    const [berkasToView, setBerkasToView] = useState(null)
    
    // Ambil ID dari initialData (bisa dari list)
    const id_pengumuman = initialData?.id_pengumuman
    
    // Fetch detail lengkap menggunakan hook
    const { pengumuman, isLoading } = usePengumumanID(id_pengumuman, null)

    if (!isOpen) return null

    // Mengambil info dasar (bisa dari initialData sementara loading, atau dari hasil fetch)
    const dataDisplay = pengumuman || initialData
    const identitas = dataDisplay?.pendaftaran?.identitas_peserta_didik
    
    const nama = identitas?.nama_lengkap || 'Pendaftar'
    const noDaftar = dataDisplay?.pendaftaran?.nomor_pendaftaran || '-'
    
    // Mapping Data Alamat dari relasi bersarang
    const kelurahanData = identitas?.kelurahan || {}
    const kecamatanData = kelurahanData?.kecamatan || {}
    const kabupatenData = kecamatanData?.kabupaten || {}
    const provinsiData = kabupatenData?.provinsi || {}

    const alamat = {
        alamat_tempat_tinggal: identitas?.alamat_tempat_tinggal || "-",
        rt: identitas?.rt || "-",
        rw: identitas?.rw || "-",
        nama_provinsi: provinsiData?.nama_provinsi || "-",
        nama_kabupaten: kabupatenData?.nama_kabupaten || "-",
        nama_kecamatan: kecamatanData?.nama_kecamatan || "-",
        dusun: identitas?.dusun || "-",
        kelurahan_desa: kelurahanData?.kelurahan_desa || "-", 
        kode_pos: kelurahanData?.kode_pos || "-",
    }

    // Mapping Data Prestasi
    const prestasi = identitas?.prestasi || []

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
                    <div>
                        <h2 className="text-lg font-black text-slate-800">Detail Pendaftaran</h2>
                        <p className="text-sm font-medium text-slate-500 mt-0.5">{nama} • {noDaftar}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors shadow-sm"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body - Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                    
                    {isLoading ? (
                        <div className="flex items-center justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <>
                            {/* Section: Alamat */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-800">Alamat Tempat Tinggal</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">RT</p>
                                        <p className="text-sm font-semibold text-slate-800">{alamat.rt}</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">RW</p>
                                        <p className="text-sm font-semibold text-slate-800">{alamat.rw}</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Alamat Lengkap</p>
                                        <p className="text-sm font-semibold text-slate-800">{alamat.alamat_tempat_tinggal}</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Provinsi </p>
                                        <p className="text-sm font-semibold text-slate-800">{alamat.nama_provinsi}</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Kabupaten</p>
                                        <p className="text-sm font-semibold text-slate-800">{alamat.nama_kabupaten}</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Kecamatan</p>
                                        <p className="text-sm font-semibold text-slate-800">{alamat.nama_kecamatan}</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Kelurahan/Desa</p>
                                        <p className="text-sm font-semibold text-slate-800 font-mono">{alamat.kelurahan_desa}</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Nama Dusun</p>
                                        <p className="text-sm font-semibold text-slate-800 font-mono">{alamat.dusun}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Prestasi */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm">
                                        <Trophy className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-800">Data Prestasi</h3>
                                </div>

                                {prestasi.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {prestasi.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                                                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                                                    <Star className="w-5 h-5" fill="currentColor" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="text-sm font-bold text-slate-800">{item.nama_prestasi}</h4>
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                                                            {item.tahun_prestasi}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-medium text-slate-500 mb-2">
                                                        {item.jenis_prestasi} • Tingkat {item.tingkat_prestasi}
                                                    </p>
                                                    <p className="text-xs text-slate-400 font-medium">Penyelenggara: {item.penyelenggara_prestasi}</p>
                                                </div>
                                                {item.bukti_prestasi && (
                                                    <div className="ml-auto mt-3 flex items-center gap-2">
                                                        <button 
                                                            onClick={() => setBerkasToView([{
                                                                path_file: item.bukti_prestasi,
                                                                nama_file: item.nama_file || item.bukti_prestasi.split('/').pop().split('?')[0] || `Bukti Prestasi - ${item.nama_prestasi}`,
                                                                jenis_berkas: 'Sertifikat Prestasi'
                                                            }])}
                                                            className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shadow-sm hover:bg-slate-200 transition-colors" 
                                                            title="Lihat Bukti"
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownload(item.bukti_prestasi, item.nama_file || item.bukti_prestasi.split('/').pop().split('?')[0] || `Bukti Prestasi - ${item.nama_prestasi}`)}
                                                            className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shadow-sm hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
                                                            title="Unduh Bukti"
                                                        >
                                                            <Download className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                                        <p className="text-sm font-medium text-slate-400">Tidak ada data prestasi.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0 flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="font-bold">
                        Tutup
                    </Button>
                    {onSelectItem && (
                        <Button 
                            variant={['DITERIMA', 'TIDAK_DITERIMA'].includes(dataDisplay?.pengumuman_hasil_seleksi) ? "verifikasi2" : "verifikasi"}
                            onClick={() => {
                                onSelectItem(initialData);
                            }}
                            className="font-bold"
                        >
                            {['DITERIMA', 'TIDAK_DITERIMA'].includes(dataDisplay?.pengumuman_hasil_seleksi) ? "Edit Hasil" : "Input Hasil"}
                        </Button>
                    )}
                </div>
            </div>

            {/* Berkas Viewer Overlay */}
            {berkasToView && (
                <BerkasViewer 
                    berkas={berkasToView} 
                    onClose={() => setBerkasToView(null)} 
                />
            )}
        </div>
    )
}
