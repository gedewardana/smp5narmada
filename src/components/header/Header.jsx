'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { Bell, ChevronDown, User, LogOut, Menu } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLogout } from '@/components/alerLogout/UseLogout'
import NotifikasiBadge from '@/components/notification/NotifikasiBadge'
import SidebarNotifikasi from '@/components/notification/SidebarNotifikasi'
import { getInitials, getAvatarGradient } from '@/utils/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu"
import { useNotifikasi } from '@/hooks/useNotifikasi'

// ─── Component ────────────────────────────────────────────────────────────────

export default function Header({ onMenuToggle }) {
    const logoutWithConfirm = useLogout()
    const { user, isLoading } = useAuth()
    const role = user?.role || 'USER'

    const [showNotifications, setShowNotifications] = useState(false)
    // Portal target — avoids backdrop-filter stacking context issue with fixed children
    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])

    const profileHref = role === 'ADMIN'
        ? '/admin/dashboard/profile'
        : '/user/dashboard/profile'

    const { unreadCount } = useNotifikasi()

    return (
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-6 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm shadow-slate-900/5">

            {/* ── Left: Hamburger (mobile) + Branding ── */}
            <div className="flex items-center gap-3">
                {/* Hamburger button — mobile only */}
                {onMenuToggle && (
                    <button
                        onClick={onMenuToggle}
                        className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-all"
                        title="Buka Menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                )}

                <div className="flex flex-col">
                    <h1 className="text-sm font-black text-gray-900 uppercase tracking-[0.15em] leading-none">
                        SPMB
                    </h1>
                    <p className="text-[10px] text-gray-400 font-medium tracking-wide leading-none mt-0.5">
                        Sistem Penerimaan Murid Baru
                    </p>
                </div>
            </div>

            {/* ── Right: Actions ─────────────────────────────── */}
            <div className="flex items-center gap-2">

                {/* Notification Button */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(prev => !prev)}
                        title="Notifikasi"
                        className={`
                            relative w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200
                            ${showNotifications
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                            }
                        `}
                    >
                        <Bell className="w-4.5 h-4.5" />
                        <NotifikasiBadge count={unreadCount} />
                    </button>
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-slate-100 mx-1" />

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 transition-all duration-200 group">
                            {/* Avatar */}
                            {user?.avatar ? (
                                <Image
                                    src={user.avatar}
                                    width={32}
                                    height={32}
                                    alt="Profile"
                                    className="object-cover rounded-full border border-slate-200"
                                />
                            ) : (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white bg-gradient-to-br ${getAvatarGradient(user?.nama_lengkap)} shadow-sm`}>
                                    {getInitials(user?.nama_lengkap)}
                                </div>
                            )}

                            {/* Name (desktop only) */}
                            <div className="hidden md:flex flex-col items-start leading-none">
                                <span className="text-[11px] font-black text-gray-900 max-w-[100px] truncate">
                                    {isLoading ? '...' : (user?.nama_lengkap || 'Pengguna')}
                                </span>
                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                    {role == 'USER' ? 'Pendaftar' : 'Admin'}
                                </span>
                            </div>

                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-52 p-1.5 rounded-2xl border border-slate-100 shadow-xl shadow-slate-900/10 bg-white">
                        {/* User Info Header */}
                        <div className="px-3 py-2.5 mb-1">
                            <p className="text-xs font-black text-gray-900 truncate">
                                {user?.nama_lengkap || 'Pengguna'}
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium truncate">
                                {user?.email || role}
                            </p>
                        </div>

                        <DropdownMenuSeparator className="my-1" />

                        <DropdownMenuItem asChild>
                            <Link
                                href={profileHref}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer"
                            >
                                <User className="w-4 h-4" />
                                Profil Saya
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-1" />

                        <DropdownMenuItem
                            onClick={logoutWithConfirm}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer focus:text-rose-600 focus:bg-rose-50"
                        >
                            <LogOut className="w-4 h-4" />
                            Keluar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Notification Sidebar — rendered via portal to escape header's backdrop-filter stacking context */}
            {mounted && createPortal(
                <SidebarNotifikasi
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                />,
                document.body
            )}
        </header>
    )
}