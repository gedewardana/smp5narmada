'use client'

import Image from 'next/image'
import {
    LockKeyhole,
    User,
    Mail,
    Shield,
    Activity,
    Calendar as CalendarIcon,
    Fingerprint,
    ShieldCheck,
    ChevronRight,
    Circle
} from 'lucide-react'
import { getInitials, getAvatarGradient } from '@/utils/avatar'
import { Button } from '../ui/button'
import { useAuth } from '@/hooks/useAuth'

export default function ProfileCard({ onOpenChangePassword }) {
    const { user } = useAuth()

    // Mapping role
    const roleMap = {
        USER: 'Pendaftar',
        ADMIN: 'Administrator',
    };

    const formatTanggal = (iso) =>
        new Date(iso).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        })

    const INFO = [
        { label: 'Nama Lengkap', value: user?.nama_lengkap ?? '—', icon: User },
        { label: 'Email Terdaftar', value: user?.email ?? '—', icon: Mail },
        {
            label: 'Akses',
            value: roleMap[user?.role] ?? '—',
            icon: Shield,
            isBadge: true,
            badgeType: 'blue'
        },
        { label: 'Status Akun', value: user?.status_akun?.replace('_', ' ') ?? '—', icon: Activity, isBadge: true, badgeType: 'emerald' },
        { label: 'ID Pengguna', value: `#${user?.id_pengguna ?? '—'}`, icon: Fingerprint },
        { label: 'Tanggal Bergabung', value: user?.dibuat_pada ? formatTanggal(user.dibuat_pada) : '—', icon: CalendarIcon },
    ]

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden animate-in fade-in duration-700">

            {/* Header / Banner Area */}
            <div className="relative h-40 bg-gray-900 overflow-hidden group">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] group-hover:scale-150 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950 opacity-100" />
                <div className="absolute bottom-6 left-8 flex items-center gap-2">
                    {/* <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-blue-300">
                        Profil Pengguna
                    </div> */}
                </div>
            </div>

            <div className="px-8 pb-10">
                {/* Avatar / Initials Part (Overlapping) */}
                <div className="relative -mt-16 mb-8 inline-block group">
                    <div className="w-32 h-32 rounded-full p-1.5 bg-white shadow-2xl relative z-10">
                        <div className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center text-3xl font-black text-white shadow-inner transition-transform group-hover:scale-[0.98] duration-500 bg-gradient-to-br ${getAvatarGradient(user?.nama_lengkap || '')}`}>
                            {user?.avatar ? (
                                <Image
                                    src={user.avatar}
                                    width={128}
                                    height={128}
                                    alt="Avatar"
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <span>{getInitials(user?.nama_lengkap)}</span>
                            )}
                        </div>
                    </div>
                    {/* Badge Verifikasi */}
                    {(user?.status_akun === 'AKTIF' || user?.status_akun === 'Terverifikasi') && (
                        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-10 h-10 rounded-2xl bg-white p-1 z-20 shadow-lg">
                            <div className=" w-full h-full rounded-xl bg-blue-600 text-white flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                        </div>
                    )}
                </div>

                {/* User Content */}
                <div className="flex flex-col md:flex-row md:items-start gap-12">
                    <div className="flex-1">
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
                                {user?.nama_lengkap ?? 'Calon Siswa'}
                            </h2>
                            <p className="text-gray-400 font-bold uppercase text-[11px] tracking-[0.2em] mt-1">
                                {user?.role?.replace('_', ' ') || 'Siswa Baru'}
                            </p>
                        </div>

                        {/* Info Grid Component */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
                            {INFO.map((item, idx) => (
                                <div key={idx} title={item.value} className="group/item flex items-center gap-5 p-4 rounded-lg bg-gray-50/50 border border-gray-100/50 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-100 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-lg bg-white border border-gray-50 flex items-center justify-center text-gray-400 group-hover/item:text-blue-600 group-hover/item:scale-110 transition-all duration-500 shadow-sm">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>

                                        {item.isBadge ? (
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-tight ${item.badgeType === 'blue'
                                                ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                }`}>
                                                <Circle className={`w-2 h-2 fill-current ${item.badgeType === 'emerald' ? 'animate-pulse' : ''}`} />
                                                {item.value}
                                            </div>
                                        ) : (
                                            <p className="text-sm font-bold text-gray-800 truncate pr-4">
                                                {item.value}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions Side Area */}
                    <div className="shrink-0 w-full md:w-72">
                        <div className="bg-gray-50 p-8 rounded-lg border border-gray-100">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Aksi Keamanan</h4>
                            <div className="space-y-4">
                                <Button
                                    onClick={onOpenChangePassword}
                                    variant="outline"
                                    className="w-full h-14 rounded-lg font-bold bg-white border-white shadow-xl shadow-gray-200/50 hover:bg-blue-600 hover:text-white transition-all active:scale-[0.98] group flex items-center justify-between px-6"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                                            <LockKeyhole className="w-4 h-4" />
                                        </div>
                                        <span>Ganti Password</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1" />
                                </Button>
                            </div>

                            <div className="mt-8 p-5 bg-amber-50/50 border border-amber-100 rounded-lg flex items-start gap-4">
                                <Activity className="w-5 h-5 text-amber-500 shrink-0" />
                                <div>
                                    <p className="text-xs font-black text-amber-700 uppercase tracking-tight mb-1">Peringatan Akun</p>
                                    <p className="text-[10px] text-amber-600 font-medium leading-relaxed">
                                        Jangan bagikan kata sandi Anda kepada siapapun untuk menjaga keamanan data.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}