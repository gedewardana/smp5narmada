'use client'

import React, { useMemo } from 'react'
import BerkasUploadItem from './BerkasUploadItem'
import { FileText, CheckCircle2 } from 'lucide-react'

/**
 * BerkasUploadList - List semua berkas yang perlu diupload dengan ringkasan progres
 */
export default function BerkasUploadList({ uploadedFiles, onFileSelect, onDelete }) {
    const berkasList = useMemo(() => [
        { jenis: 'AKTA', label: 'Akta Kelahiran', mandatory: true },
        { jenis: 'KK', label: 'Kartu Keluarga', mandatory: true },
        { jenis: 'SKL', label: 'Surat Keterangan Lulus', mandatory: true },
        { jenis: 'KTP_AYAH', label: 'Kartu Tanda Penduduk Ayah', mandatory: true },
        { jenis: 'KTP_IBU', label: 'Kartu Tanda Penduduk Ibu', mandatory: true },
        { jenis: 'KIP', label: 'Kartu Indonesia Pintar', mandatory: false },
    ], [])

    const getUploadedFile = (jenis) => {
        return uploadedFiles?.find(f => f.jenis_berkas === jenis)
    }

    // Hitung progres upload
    const stats = useMemo(() => {
        const total = berkasList.length
        const totalMandatory = berkasList.filter(b => b.mandatory).length
        const uploaded = uploadedFiles?.length || 0
        const isComplete = uploaded >= totalMandatory
        
        return { total, uploaded, isComplete }
    }, [berkasList, uploadedFiles])

    return (
        <div className="space-y-8">
            {/* Header & Progress Summary */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Progres Dokumen</p>
                        <p className="text-lg font-black text-gray-900 leading-none">
                            {stats.uploaded} <span className="text-slate-300">/</span> {stats.total}
                        </p>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                        stats.isComplete ? 'bg-emerald-500 text-white animate-bounce-short' : 'bg-slate-200 text-slate-400'
                    }`}>
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Upload Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {berkasList.map((berkas) => (
                    <BerkasUploadItem
                        key={berkas.jenis}
                        jenisBerkas={berkas.jenis}
                        label={berkas.label}
                        mandatory={berkas.mandatory}
                        currentFile={getUploadedFile(berkas.jenis)}
                        onFileSelect={onFileSelect}
                        onDelete={onDelete}
                    />
                ))}
            </div>

            {/* Footer Notice */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-black">!</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                    Pastikan dokumen yang diunggah terbaca dengan jelas. Panitia berhak meminta unggah ulang jika berkas tidak sesuai atau tidak valid.
                </p>
            </div>
        </div>
    )
}
