'use client'
import React, { useState } from 'react'
import { MessageSquare, Save, AlertCircle } from 'lucide-react'

function CatatanPanitia({ pendaftaranId, initialCatatan = '', editable = true, onSave }) {
    const [catatan, setCatatan] = useState(initialCatatan)
    const [isSaving, setIsSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Simulasi API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            if (onSave) {
                await onSave(catatan)
            }

            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (error) {
            console.error('Error saving catatan:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const charCount = catatan.length
    const maxChars = 1000

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Catatan Panitia</h3>
            </div>

            {editable ? (
                <div className="space-y-4">
                    {/* Info Alert */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium">Catatan untuk pendaftar</p>
                            <p className="text-blue-700 mt-1">
                                Catatan ini akan dilihat oleh pendaftar jika status pendaftaran diubah menjadi "Perlu Perbaikan"
                            </p>
                        </div>
                    </div>

                    {/* Textarea */}
                    <div>
                        <textarea
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            maxLength={maxChars}
                            rows={6}
                            placeholder="Tuliskan catatan untuk pendaftar... (contoh: berkas yang perlu diperbaiki, kesalahan data, dll)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                                Karakter: {charCount} / {maxChars}
                            </span>
                            {charCount > maxChars * 0.9 && (
                                <span className="text-xs text-yellow-600 font-medium">
                                    Mendekati batas maksimal
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !catatan.trim()}
                            className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all
                ${isSaving || !catatan.trim()
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
                                }
              `}
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Menyimpan...' : 'Send'}
                        </button>

                        {saved && (
                            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Tersimpan
                            </span>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    {catatan ? (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{catatan}</p>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Belum ada catatan dari panitia</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default CatatanPanitia