'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, AlertCircle, Calendar, ArrowRight, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function RegistrationStatus({ jadwal, isLoading, children }) {
    if (isLoading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse">Memeriksa jadwal pendaftaran...</p>
            </div>
        )
    }

    if (!jadwal) {
        return (
            <div className="p-8 bg-red-50 rounded-3xl border border-red-100 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    <ShieldAlert className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Jadwal Tidak Ditemukan</h2>
                <p className="text-gray-600 max-w-md">
                    Maaf, saat ini sistem tidak menemukan jadwal pendaftaran yang aktif. Silakan hubungi panitia PMB untuk informasi lebih lanjut.
                </p>
                <Button variant="outline" asChild>
                    <Link href="/user/dashboard">Kembali ke Dashboard</Link>
                </Button>
            </div>
        )
    }

    const now = new Date()
    const startDate = new Date(jadwal.pendaftaran_mulai)
    const endDate = new Date(jadwal.pendaftaran_selesai)
    
    // Set hours to extreme for full day coverage
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)

    const isUpcoming = now < startDate
    const isExpired = now > endDate

    if (isUpcoming) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 sm:p-12 bg-white rounded-[2rem] border border-blue-100 shadow-xl shadow-blue-500/5 flex flex-col items-center text-center space-y-6"
            >
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 relative">
                    <Calendar className="w-10 h-10" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        SOON
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Pendaftaran Belum Dibuka</h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Sabar ya! Gelombang <span className="font-bold text-blue-600">{jadwal.nama_gelombang || 'Penerimaan'}</span> akan segera dibuka sesuai jadwal berikut:
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Mulai Pada</p>
                        <p className="text-sm font-bold text-gray-800">{new Date(jadwal.pendaftaran_mulai).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Berakhir Pada</p>
                        <p className="text-sm font-bold text-gray-800">{new Date(jadwal.pendaftaran_selesai).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                    </div>
                </div>

                <Button className="rounded-full px-8 bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="/user/dashboard">
                        Kembali ke Dashboard
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </Button>
            </motion.div>
        )
    }

    if (isExpired) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 sm:p-12 bg-white rounded-[2rem] border border-amber-100 shadow-xl shadow-amber-500/5 flex flex-col items-center text-center space-y-6"
            >
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                    <Clock className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Pendaftaran Telah Ditutup</h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Masa pendaftaran untuk gelombang ini telah berakhir pada <span className="font-bold text-amber-600">{new Date(jadwal.pendaftaran_selesai).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>.
                    </p>
                </div>

                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4 text-left max-w-lg">
                    <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                    <div>
                        <p className="text-sm font-bold text-amber-900 mb-1">Informasi Penting</p>
                        <p className="text-xs text-amber-800 leading-relaxed">
                            Jika Anda sudah melakukan pendaftaran sebelumnya, Anda tetap dapat memantau status verifikasi dan hasil seleksi melalui menu dashboard. Untuk pendaftaran baru, silakan tunggu pembukaan gelombang berikutnya.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                    <Button variant="outline" className="rounded-full px-8" asChild>
                        <Link href="/user/dashboard">Dashboard</Link>
                    </Button>
                    <Button className="rounded-full px-8 bg-amber-600 hover:bg-amber-700" asChild>
                        <Link href="/user/dashboard/pengumuman">
                            Cek Pengumuman
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </motion.div>
        )
    }

    // Jika dalam jadwal, tampilkan konten pendaftaran
    return children
}
