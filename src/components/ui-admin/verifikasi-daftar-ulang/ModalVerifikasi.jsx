'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { X, CheckCircle2, AlertCircle, MessageSquare, XCircle } from 'lucide-react'

function ModalVerifikasi({ daftarUlang, onClose, onSubmit }) {
    const [action, setAction] = useState('')
    const [catatan, setCatatan] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!daftarUlang) return null

    const actions = [
        {
            id: 'sudah',
            label: 'Sudah',
            description: 'Pendaftar sudah daftar ulang',
            icon: CheckCircle2,
            color: 'green',
            // description: 'Data sudah benar' // Deskripsi dipersingkat agar hemat tempat
        },
        {
            id: 'belum',
            label: 'Belum',
            description: 'Pendaftar belum daftar ulang',
            icon: AlertCircle,
            color: 'yellow',
            // description: 'Perlu perbaikan data'
        },
        {
            id: 'mengundurkan_diri',
            label: 'Mengundurkan Diri',
            description: 'Pendaftar mengundurkan diri',
            icon: XCircle,
            color: 'red',
            // description: 'Perlu perbaikan data'
        }

    ]

    const getColorClasses = (color) => {
        const classes = {
            green: {
                bg: 'bg-green-50',
                border: 'border-green-500',
                text: 'text-green-700',
                icon: 'text-green-600',
                button: 'bg-green-600 hover:bg-green-700'
            },

            red: {
                bg: 'bg-red-50',
                border: 'border-red-500',
                text: 'text-red-700',
                icon: 'text-red-600',
                button: 'bg-red-600 hover:bg-red-700'
            },
            yellow: {
                bg: 'bg-yellow-50',
                border: 'border-yellow-500',
                text: 'text-yellow-700',
                icon: 'text-yellow-600',
                button: 'bg-yellow-600 hover:bg-yellow-700'
            }
        }
        return classes[color]
    }

    const handleSubmit = async () => {
        if (!action) {
            alert('Pilih aksi verifikasi terlebih dahulu')
            return
        }

        if ((action === 'perbaikan' || action === 'tolak') && !catatan.trim()) {
            alert('Catatan wajib diisi untuk aksi ini')
            return
        }

        setIsSubmitting(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500))
            onSubmit && onSubmit({
                action,
                catatan,
                daftarUlangId: daftarUlang.id_daftar_ulang
            })
            onClose()
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            {/* 
                TRICK 1: max-h-[90vh] membatasi tinggi modal agar tidak melebihi layar.
                TRICK 2: flex flex-col membuat struktur Header-Body-Footer rapi.
            */}
            <div className="bg-white rounded-lg shadow-2xl max-w-lg md:max-w-2xl flex flex-col max-h-[90vh] w-1/3 animate-in fade-in zoom-in duration-200">

                {/* Header (Statis - Tidak Ikut Scroll) */}
                <div className="flex-none flex items-center justify-between px-5 py-3 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Verifikasi Daftar Ulang</h2>
                        <p className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full w-fit">
                            <span className="font-semibold">
                                {daftarUlang.nomor_pendaftaran}
                            </span>
                            <span className="text-gray-400">|</span>
                            <span className="truncate max-w-[180px]">
                                {daftarUlang.nama_lengkap}
                            </span>
                        </p>
                    </div>
                    <button
                        title='Tutup'
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content (Scrollable - overflow-y-auto) */}
                {/* TRICK 3: Area ini bisa di-scroll jika kontennya panjang */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5">

                    {/* Action Selection */}
                    <div>

                        <div className="mb-2 inline-flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-semibold">
                            <span className="text-gray-500 font-medium">
                                Status Saat Ini:
                            </span>
                            <span className="text-gray-600">
                                Belum Daftar Ulang
                            </span>
                        </div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Pilih Aksi
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {actions.map((item) => {
                                const Icon = item.icon
                                const colors = getColorClasses(item.color)
                                const isSelected = action === item.id

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setAction(item.id)}
                                        className={`
                                            w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left
                                            ${isSelected
                                                ? `${colors.bg} ${colors.border}`
                                                : 'bg-white border-gray-200 hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        <div className={`
                                            p-1.5 rounded-lg flex-shrink-0
                                            ${isSelected ? colors.bg : 'bg-gray-100'}
                                        `}>
                                            <Icon className={`w-4 h-4 ${isSelected ? colors.icon : 'text-gray-400'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`text-sm font-semibold ${isSelected ? colors.text : 'text-gray-900'}`}>
                                                {item.label}
                                            </h3>
                                            <p className={`text-xs ${isSelected ? colors.text : 'text-gray-600'}`}>
                                                {item.description}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <CheckCircle2 className={`w-4 h-4 ${colors.text}`} />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>


                </div>

                {/* Footer (Statis - Tidak Ikut Scroll) */}
                <div className="flex-none flex items-center justify-end gap-3 px-5 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                    <Button
                        onClick={onClose}
                        disabled={isSubmitting}
                        variant="outline"
                        size='sm'
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant='default'
                        disabled={!action || isSubmitting}
                        size='sm'
                    >
                        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default ModalVerifikasi
