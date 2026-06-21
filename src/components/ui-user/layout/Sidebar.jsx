'use client'

import Link from 'next/link'
import Image from 'next/image'
import { 
    Home, 
    FileText, 
    User, 
    LogOut, 
    Megaphone, 
    SplitSquareHorizontal,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import ItemAktif from '@/components/reasublecomponents/ActivItemSidebar'
import { useLogout } from '@/components/alerLogout/UseLogout'

const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/user/dashboard' },
    { icon: FileText, label: 'Pendaftaran', href: '/user/dashboard/pendaftaran' },
    { icon: Megaphone, label: 'Pengumuman', href: '/user/dashboard/pengumuman' },
    { icon: User, label: 'Profil Saya', href: '/user/dashboard/profile' },
    // { icon: User, label: 'Kartu Pendaftaran', href: '/user/dashboard/pendaftaran/kartu/preview' },
]

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
    const logoutWithConfirm = useLogout()

    return (
        <aside className={`
            hidden md:flex
            fixed left-0 top-0 h-screen flex-col
            bg-slate-950 border-r border-white/5
            transition-all duration-300 ease-in-out z-40
            ${isCollapsed ? 'w-20' : 'w-64'}
        `}>
            {/* ── Header ─────────────────────────────────── */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
                <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={32}
                        height={32}
                        className="object-contain shrink-0"
                    />
                    <span className="font-black text-white whitespace-nowrap tracking-tight">SpenLinar</span>
                </div>

                {isCollapsed && (
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={32}
                        height={32}
                        className="object-contain mx-auto"
                    />
                )}

                {/* Collapse Toggle Button */}
                {!isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(true)}
                        title="Tutup Sidebar"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all shrink-0"
                    >
                        <SplitSquareHorizontal className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* ── Navigation ─────────────────────────────── */}
            <nav className="flex-1 py-4 overflow-y-auto">
                <ul className="space-y-1 px-3">
                    {menuItems.map((item) => (
                        <li key={item.href}>
                            <ItemAktif
                                href={item.href}
                                icon={item.icon}
                                label={item.label}
                                isCollapsed={isCollapsed}
                            />
                        </li>
                    ))}
                </ul>
            </nav>

            {/* ── Footer - Logout ─────────────────────────── */}
            <div className="p-3 border-t border-white/5 shrink-0">
                <button
                    onClick={logoutWithConfirm}
                    title={isCollapsed ? 'Keluar' : ''}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-rose-400 hover:text-white hover:bg-rose-500/20 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!isCollapsed && (
                        <span className="text-sm font-bold">Keluar</span>
                    )}
                </button>
            </div>

            {/* ── Expand Button (when collapsed) ──────────── */}
            {isCollapsed && (
                <button
                    onClick={() => setIsCollapsed(false)}
                    title="Buka Sidebar"
                    className="absolute top-1/2 -translate-y-1/2 -right-3.5 w-7 h-7 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 shadow-lg transition-all"
                >
                    <ChevronRight className="w-3.5 h-3.5" />
                </button>
            )}
        </aside>
    )
}
