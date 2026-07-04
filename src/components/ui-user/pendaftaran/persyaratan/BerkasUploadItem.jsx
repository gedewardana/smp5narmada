'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    UploadCloud,
    FileText,
    CheckCircle2,
    Eye,
    Trash2,
    Clock
} from "lucide-react"

/**
 * BerkasUploadItem - Premium, Professional Card for Document Upload
 */
export default function BerkasUploadItem({
    jenisBerkas,
    label,
    mandatory,
    onFileSelect,
    currentFile,
    disabled,
    onDelete
}) {
    const isUploaded = !!currentFile

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group relative bg-white rounded-2xl border transition-all duration-500 overflow-hidden ${isUploaded
                    ? 'border-emerald-100 shadow-sm shadow-emerald-500/5'
                    : 'border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200'
                }`}
        >
            {/* Status Accent Bar */}
            <div className={`absolute top-0 left-0 w-full h-1 transition-colors duration-500 ${isUploaded ? 'bg-emerald-500' : 'bg-slate-100 group-hover:bg-blue-500'
                }`} />

            <div className="p-6">
                {/* Header: Label & Status Badge */}
                <div className="flex items-start justify-between mb-6">
                    <div className="space-y-1">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight flex items-center gap-1.5">
                            {label}
                            {mandatory && <span className="text-rose-500" title="Wajib">*</span>}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {isUploaded ? 'Dokumen Terverifikasi' : 'Belum Ada Berkas'}
                        </p>
                    </div>

                    <div className={`
                        px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all duration-500
                        ${isUploaded
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-slate-50 text-slate-400 border border-slate-100'}
                    `}>
                        {isUploaded ? (
                            <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Uploaded</span>
                            </>
                        ) : (
                            <>
                                <Clock className="w-3 h-3" />
                                <span>Pending</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Upload Zone / File Info */}
                <div className="flex flex-col">
                    <input
                        type="file"
                        id={`upload-${jenisBerkas}`}
                        onChange={(e) => {
                            const file = e.target.files[0]
                            if (file) onFileSelect(jenisBerkas, file)
                        }}
                        className="hidden"
                        accept="image/*,.pdf"
                        disabled={disabled}
                    />

                    <label
                        htmlFor={`upload-${jenisBerkas}`}
                        className={`
                            relative block w-full rounded-xl border-2 border-dashed transition-all duration-500 cursor-pointer overflow-hidden
                            ${isUploaded 
                                ? 'bg-emerald-50/30 border-emerald-200 py-4 px-4' 
                                : 'bg-slate-50/50 border-slate-200 py-8 px-4 hover:border-blue-400 hover:bg-blue-50/30'}
                            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`
                                w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-500
                                ${isUploaded ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 shadow-sm group-hover:scale-110 group-hover:text-blue-500'}
                            `}>
                                {isUploaded ? <FileText className="w-5 h-5" /> : <UploadCloud className="w-6 h-6" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                {isUploaded ? (
                                    <>
                                        <p className="text-xs font-bold text-gray-800 truncate">
                                            {currentFile.nama_file || currentFile.name}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-medium truncate">
                                            Diunggah pada {new Date(currentFile.diunggah_pada || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-xs font-black text-gray-600 uppercase tracking-tight">Klik untuk Upload</p>
                                        <p className="text-[10px] text-gray-400 font-medium italic truncate">Format: PDF atau Gambar (Maks. 2MB)</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </label>

                    {/* Action Controls (Always Visible when Uploaded, Premium Mobile Layout) */}
                    <AnimatePresence>
                        {isUploaded && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="flex items-center gap-2 overflow-hidden"
                            >
                                <a
                                    title="Lihat Berkas"
                                    href={currentFile.path_file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-bold text-xs"
                                >
                                    <Eye className="w-4 h-4" />
                                    Lihat Berkas
                                </a>

                                <button
                                    type="button"
                                    title="Hapus Berkas"
                                    onClick={() => onDelete(currentFile.jenis_berkas)}
                                    disabled={disabled}
                                    className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white transition-all font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Hapus
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}
