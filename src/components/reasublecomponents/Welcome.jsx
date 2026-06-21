'use client';

import React from 'react';
import { LayoutDashboard, Calendar } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useUserDashboard } from '@/hooks/useUserDashboard';

export default function Welcome() {
    const { data: session } = useSession();
    const { data, isLoading } = useUserDashboard();

    // Destructuring session data
    const userName = session?.user?.nama_lengkap || 'User';
    const isAdmin = session?.user?.role === 'ADMIN';

    return (
        <div className="w-full">
            {/* Main Card - White Theme */}
            <div className="relative overflow-hidden rounded-3xl bg-white p-8 md:p-12 text-gray-900 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg group">
                
                {/* Subtle Decorative Background Elements (Light Theme) */}
                <div className="absolute top-0 right-0 -translate-y-16 translate-x-16 w-72 h-72 bg-blue-50 rounded-full opacity-70 group-hover:scale-110 transition-transform duration-1000 ease-in-out" />
                <div className="absolute bottom-0 left-0 translate-y-20 -translate-x-20 w-96 h-96 bg-indigo-50 rounded-full opacity-60" />

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
                    {/* Welcome Text Section */}
                    <div className="flex-1 z-10">
                        <div className="flex items-center gap-3 mb-6">
                            {/* Icon Container - Light Blue */}
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                                <LayoutDashboard className="w-6 h-6" />
                            </div>
                            {/* Badge - Light */}
                            <div className="px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                Personal Dashboard
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-4 leading-tight text-gray-950">
                            Selamat Datang,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                                {userName}!
                            </span>
                        </h1>
                        
                        <p className="text-gray-600 font-normal max-w-xl leading-relaxed text-sm md:text-base">
                            {isAdmin
                                ? 'Selamat datang di Portal Pendaftaran Siswa Baru SMPN 5 Narmada. Kelola sistem, verifikasi data, dan pantau aktivitas pengguna melalui panel ini.'
                                : 'Selamat datang di Portal Pendaftaran Siswa Baru SMPN 5 Narmada. Lengkapi data Anda dan pantau progres pendaftaran Anda secara berkala di sini.'}
                        </p>
                    </div>

                    {/* Academic Year Badge - Clean White */}
                    <div className="flex flex-col items-start md:items-end gap-3 shrink-0 z-10">
                        <div className="bg-white border border-gray-100 rounded-2xl p-7 flex flex-col items-start md:items-end gap-1 shadow-sm group-hover:border-blue-100 transition-all duration-300">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-blue-700 uppercase tracking-widest mb-1.5">
                                <Calendar className="w-4 h-4 text-blue-500" /> Tahun Pelajaran
                            </div>
                            
                            {isLoading ? (
                                <div className="h-8 w-28 bg-gray-100 animate-pulse rounded-md" />
                            ) : (
                                <span className="text-2xl font-extrabold tracking-tight text-gray-950">
                                    {data?.tahun_ajaran || '---/---'}
                                </span>
                            )}

                            <div className="mt-5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100 flex items-center gap-2 uppercase tracking-wider">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Periode Aktif
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}