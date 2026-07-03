'use client'

import Link from 'next/link'
import { HelpCircle, ArrowRight, SkipForward, ArrowLeft } from 'lucide-react'

/**
 * StepQuestion — Premium confirmation card for optional form sections.
 * Asks the user whether they want to fill in optional data or skip it.
 */
export default function StepQuestion({ question, onYes, onNo, prevLink, isSkipping = false }) {
    return (
        <div className="relative bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Top Accent Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

            <div className="p-8 sm:p-10">
                {/* Back Link */}
                {prevLink && (
                    <div className="mb-6">
                        <Link
                            href={prevLink}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-all uppercase tracking-widest"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Kembali
                        </Link>
                    </div>
                )}

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <HelpCircle className="w-8 h-8 text-blue-500" />
                </div>

                {/* Question */}
                <div className="text-center mb-8">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">
                        {question}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
                        Jika tidak, bagian ini akan dilewati dan dapat dilengkapi kembali di kemudian hari.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={onNo}
                        disabled={isSkipping}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSkipping ? (
                            <>
                                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                <SkipForward className="w-4 h-4" />
                                Tidak, Lewati
                            </>
                        )}
                    </button>

                    <button
                        onClick={onYes}
                        disabled={isSkipping}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        Ya, Isi Data
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
