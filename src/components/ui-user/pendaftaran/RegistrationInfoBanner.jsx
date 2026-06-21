'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MapPin, Save, CalendarCheck, ShieldCheck,
    FileWarning, Lightbulb, ChevronDown
} from 'lucide-react'
import { useUserDashboard } from '@/hooks/useUserDashboard'



export default function RegistrationInfoBanner() {
 const { data, isLoading } = useUserDashboard()

    const INFO_ITEMS = [
    { 
        icon: MapPin, 
        bg: 'bg-blue-50', 
        color: 'text-blue-600', 
        label: 'Jalur', 
        value: data?.jalur_pendaftaran || '-' },
    { 
        icon: Save, 
        bg: 'bg-emerald-50', 
        color: 'text-emerald-600', 
        label: 'Progres', 
        value: 'Auto-Save' },
    { 
        icon: CalendarCheck, 
        bg: 'bg-amber-50', 
        color: 'text-amber-600', 
        label: 'Waktu Pendaftaran', 
        date: data?.pendaftaran_range || 'Memuat jadwal...'},    
    { 
        icon: ShieldCheck, 
        bg: 'bg-indigo-50', 
        color: 'text-indigo-600', 
        label: 'Data', 
        value: 'Aman' },
]

    
    const [showTips, setShowTips] = useState(false)

    return (
        <div className="space-y-4 mb-8">

            {/* Quick Stats Grid / Swipeable on Mobile */}
            <div className="flex overflow-x-auto md:overflow-visible md:grid md:grid-cols-4 gap-3 md:gap-4 snap-x snap-mandatory pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
                {INFO_ITEMS.map((item) => (
                    <div key={item.label} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-center gap-3 transition-transform hover:scale-[1.02] shrink-0 w-[75%] sm:w-[45%] md:w-auto snap-center">
                        <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-tight">{item.label}</p>
                            {item.date ? (
                                <p className="text-xs font-extrabold text-gray-900 leading-snug break-words">{item.date}</p>
                            ) : (
                                <p className="text-sm font-extrabold text-gray-900">{item.value}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Alert & Tips Wrapper */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-3 sm:gap-4 bg-amber-50/30">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                            <FileWarning className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-1">Verifikasi Data Resmi</h4>
                            <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
                                Pastikan NIK dan No. KK sesuai dengan dokumen asli. Kesalahan input dapat menghambat proses validasi zonasi.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowTips(!showTips)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-amber-700 text-[11px] font-bold hover:bg-amber-100 transition-colors self-start sm:self-auto shrink-0"
                    >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Tips</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showTips ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                <AnimatePresence>
                    {showTips && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-gray-50"
                        >
                            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {['Siapkan scan KK & Akta (.pdf/.jpg)', 'Gunakan jaringan internet yang stabil', 'Simpan setiap selesai satu halaman', 'Cek email secara berkala'].map((tip, i) => (
                                    <div key={i} className="flex items-center gap-3 group">
                                        <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0 group-hover:scale-125 transition-transform" />
                                        <span className="text-xs text-gray-600 font-semibold">{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}