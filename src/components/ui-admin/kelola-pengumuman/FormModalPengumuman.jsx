'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, Loader2, User, FileText, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SELECTION_OPTIONS } from './pengumumanConfig'



const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function FormPengumuman({ initialData, onSubmit, onClose }) {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        id_pengumuman: '',
        pengumuman_hasil_seleksi: '',
        catatan: ''
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                id_pengumuman: initialData.id_pengumuman || '',
                pengumuman_hasil_seleksi: initialData.pengumuman_hasil_seleksi || '',
                catatan: initialData.catatan || ''
            })
        }
    }, [initialData])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.pengumuman_hasil_seleksi || formData.pengumuman_hasil_seleksi === initialData?.pengumuman_hasil_seleksi) return
        
        setIsLoading(true)
        try {
            await onSubmit?.(formData)
            onClose?.()
        } finally {
            setIsLoading(false)
        }
    }

    const currentStatus = initialData?.pengumuman_hasil_seleksi
    const isEditing = ['DITERIMA', 'TIDAK_DITERIMA'].includes(currentStatus)
    const canSubmit = formData.pengumuman_hasil_seleksi && formData.pengumuman_hasil_seleksi !== currentStatus

    // Warna button Simpan ikut option yang dipilih
    const selectedOption = SELECTION_OPTIONS.find(o => o.id === formData.pengumuman_hasil_seleksi)
    const btnClass = canSubmit
        ? selectedOption?.colors.btn
        : 'bg-gray-300 text-gray-500 cursor-not-allowed'

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose?.()}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex-none flex items-start justify-between px-6 py-5 border-b border-gray-200">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-gray-900">
                                {isEditing ? 'Edit Pengumuman' : 'Input Hasil Seleksi'}
                            </h2>
                            {/* {currentStatus && (
                                <span className={cx(
                                    'px-2 py-0.5 rounded-full text-xs font-medium',
                                    currentStatus === 'DITERIMA' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                )}>
                                    {currentStatus === 'DITERIMA' ? 'Diterima' : 'Tidak Diterima'}
                                </span>
                            )} */}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium">
                                <FileText className="w-3.5 h-3.5" />
                                {initialData?.nomor_pendaftaran || '-'}
                            </span>
                            <span className="text-gray-300">|</span>F
                            <span className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" />
                                {initialData?.nama_lengkap || '-'}
                            </span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={onClose} 
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        
                        {/* Selection Cards */}
                        <section className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-900">
                                Hasil Seleksi <span className="text-rose-500">*</span>
                            </label>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {SELECTION_OPTIONS.map((option) => {
                                    const Icon = option.icon
                                    const isSelected = formData.pengumuman_hasil_seleksi === option.id
                                    const isDisabled = currentStatus === option.id
                                    
                                    return (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() => !isDisabled && setFormData(prev => ({ ...prev, pengumuman_hasil_seleksi: option.id }))}
                                            disabled={isDisabled}
                                            className={cx(
                                                'relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left',
                                                isSelected && option.colors.active,
                                                !isSelected && !isDisabled && 'border-gray-200 hover:border-gray-300 bg-white',
                                                isDisabled && 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50',
                                                isSelected && 'ring-2 ring-offset-1'
                                            )}
                                        >
                                            <div className={cx(
                                                'p-2 rounded-lg transition-colors',
                                                isSelected ? 'bg-white/50' : 'bg-gray-100'
                                            )}>
                                                <Icon className={cx(
                                                    'w-5 h-5',
                                                    isSelected ? option.colors.icon : 'text-gray-400'
                                                )} />
                                            </div>
                                            
                                            <span className={cx(
                                                'font-semibold',
                                                isSelected ? 'text-gray-900' : 'text-gray-700'
                                            )}>
                                                {option.label}
                                            </span>
                                            
                                            {isSelected && (
                                                <CheckCircle2 className={cx(
                                                    'w-5 h-5 ml-auto',
                                                    option.colors.icon
                                                )} />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                            
                            {isEditing && (
                                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-amber-500" />
                                    Pilih opsi lain untuk mengubah status saat ini
                                </p>
                            )}
                        </section>

                        {/* Notes */}
                        <section className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-900">
                                Catatan <span className="text-gray-400 font-normal">(opsional)</span>
                            </label>
                            <textarea
                                value={formData.catatan}
                                onChange={(e) => setFormData(prev => ({ ...prev, catatan: e.target.value }))}
                                rows={4}
                                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                placeholder="Tambahkan catatan jika diperlukan..."
                            />
                            <div className="flex justify-end">
                                <span className="text-xs text-gray-400">{formData.catatan.length}/500</span>
                            </div>
                        </section>

                    </div>
                </form>

                {/* Footer */}
                <div className="flex-none flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="outline"
                        size="sm"
                        disabled={isLoading}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!canSubmit || isLoading}
                        size="sm"
                        className={cx('min-w-[120px]', btnClass)}
                    >
                        {isLoading ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan...</>
                        ) : (
                            <><Save className="w-4 h-4 mr-2" />Simpan</>
                        )}
                    </Button>
                </div>

            </div>
        </div>
    )
}