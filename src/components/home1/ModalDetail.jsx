'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, MapPin, Calendar, Users, Star, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function ModalDetail({ isOpen, onClose, data }) {
    if (!isOpen || !data) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
                {/* Backdrop with Blur */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
                    className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]"
                >
                    {/* Close Button - Mobile */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-gray-900 lg:hidden shadow-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Left Side: Image Section */}
                    <div className="relative w-full lg:w-[45%] h-64 lg:h-auto bg-gray-100">
                        <Image
                            src={data.image}
                            alt={data.title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />

                        {/* Badge Over Image (Mobile Only) */}
                        <div className="absolute bottom-4 left-4 lg:hidden">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg">
                                <Star className="w-3.5 h-3.5" />
                                {data.badge}
                            </span>
                        </div>
                    </div>

                    {/* Right Side: Content Section */}
                    <div className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <div className="hidden lg:block">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${data.badgeColor || 'bg-blue-100 text-blue-700'}`}>
                                    <Trophy className="w-3.5 h-3.5" />
                                    {data.badge}
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="hidden lg:flex p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-4">
                            {data.title}
                        </h2>

                        <p className="text-gray-600 leading-relaxed mb-8 text-sm sm:text-base">
                            {data.description}
                        </p>

                        {/* Meta Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div className="flex items-start gap-3 sm:gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 transition-colors hover:bg-gray-50">
                                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600">
                                    <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Pemenang</p>
                                    <p className="text-sm sm:text-base font-bold text-gray-800 leading-tight break-words">{data.pemenang || 'Siswa SMPN 5 Narmada'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 sm:gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 transition-colors hover:bg-gray-50">
                                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-purple-600">
                                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Lokasi</p>
                                    <p className="text-sm sm:text-base font-bold text-gray-800 leading-tight break-words">{data.lokasi || 'Mataram, NTB'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 sm:gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 transition-colors hover:bg-gray-50 md:col-span-2">
                                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-emerald-600">
                                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Waktu Pelaksanaan</p>
                                    <p className="text-sm sm:text-base font-bold text-gray-800 leading-tight break-words">{data.tanggal || 'Tahun 2025'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Highlights */}
                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Detail Pencapaian</h4>
                            <div className="grid grid-cols-3 gap-3">
                                {data.stats?.map((stat, idx) => (
                                    <div key={idx} className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                        <p className="text-[10px] text-gray-500 mb-1 font-medium">{stat.label}</p>
                                        <p className="text-xs sm:text-sm font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer CTA */}
                        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs font-bold">{data.tanggal || 'Tahun 2025'}</span>
                            </div>
                            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                                Bagikan
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
