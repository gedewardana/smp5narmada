'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Save, Send, Edit3, CheckCircle2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

function NavigationButtons({ 
    prevLink, 
    nextLink, 
    onSave, 
    onNext, 
    onCancel, 
    isFirstStep, 
    isLastStep, 
    mode = 'input', 
    alwaysEnableNext = false, 
    showSaveButton = true, 
    saveDisabled = false,
    submitFinall = false,
    isUpdate = false
    
}) {
    const isNextActive = mode === 'view' || alwaysEnableNext

    return (
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
            {/* Previous Button */}
            <div className="flex-1">
                {!isFirstStep && prevLink && (
                    <Link href={prevLink}>
                        <Button
                            variant="outline"
                            className="group h-11 px-5 rounded-xl border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            <span className="hidden sm:inline font-bold text-xs uppercase tracking-widest">Kembali</span>
                        </Button>
                    </Link>
                )}
            </div>

            {/* Save & Next Buttons */}
            <div className="flex items-center gap-3">
                {/* Save / Edit Button */}
                {showSaveButton && (
                    <Button
                        type="button"
                        onClick={onSave}
                        disabled={saveDisabled}
                        className={`h-11 px-8 rounded-xl font-bold transition-all active:scale-95 shadow-lg ${
                            mode === 'view' 
                            ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-gray-100' 
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                    >
                        {mode === 'view' ? (
                            <><Edit3 className="w-4 h-4 mr-2" /> Edit</>
                        ) : (
                            <><Save className="w-4 h-4 mr-2" /> {isUpdate ? 'Simpan' : 'Simpan'}</>
                        )}
                    </Button>
                )}

                {/* Next Button */}
                {!isLastStep && nextLink && (
                    <div className="flex items-center">
                        {isNextActive ? (
                            onNext ? (
                                <Button
                                    type="button"
                                    onClick={onNext}
                                    className="h-11 px-5 rounded-xl bg-gray-900 hover:bg-blue-600 text-white transition-all active:scale-95 shadow-lg shadow-gray-200 flex items-center gap-2 group"
                                >
                                    <span className="hidden sm:inline font-bold text-xs uppercase tracking-widest">Selanjutnya</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            ) : (
                                <Link href={nextLink}>
                                    <Button
                                        className="h-11 px-5 rounded-xl bg-gray-900 hover:bg-blue-600 text-white transition-all active:scale-95 shadow-lg shadow-gray-200 flex items-center gap-2 group"
                                    >
                                        <span className="hidden sm:inline font-bold text-xs uppercase tracking-widest">Selanjutnya</span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            )
                        ) : (
                            mode === 'input' && isUpdate ? (
                                <Button
                                    type="button"
                                    onClick={onCancel}
                                    className="h-11 px-5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all active:scale-95 flex items-center gap-2 group"
                                >
                                    <X className="w-4 h-4" />
                                    <span className="hidden sm:inline font-bold text-xs uppercase tracking-widest">Batal</span>
                                </Button>
                            ) : (
                                <Button
                                    disabled
                                    className="h-11 px-5 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed flex items-center gap-2"
                                >
                                    <span className="hidden sm:inline font-bold text-xs uppercase tracking-widest">Selanjutnya</span>
                                    <ArrowRight className="w-4 h-4 opacity-50" />
                                </Button>
                            )
                        )}
                    </div>
                )}

                {/* Submit Final Step */}
                {isLastStep && (
                    <Button
                        type="submit"
                        onClick={onSave}
                        disabled={submitFinall}
                        className={`h-11 px-8 rounded-xl font-bold transition-all active:scale-95 shadow-xl ${
                            submitFinall
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-100'
                        }`}
                    >
                        <CheckCircle2 className="w-4.5 h-4.5 mr-2" /> Submit
                    </Button>
                )}
            </div>
        </div>
    )
}

export default NavigationButtons
