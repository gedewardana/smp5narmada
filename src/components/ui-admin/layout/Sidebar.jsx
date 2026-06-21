'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
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
    ChevronRight,
    ChevronDown,
    ClipboardCheck,
    Calendar,
    Users,
    X
} from 'lucide-react'
import ItemAktif from '@/components/reasublecomponents/ActivItemSidebar'
import { useLogout } from '@/components/alerLogout/UseLogout'

const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
    {
        icon: ClipboardCheck,
        label: 'Verifikasi',
        isGroup: true,
        children: [
            { label: 'Pendaftaran', href: '/admin/dashboard/verifikasi-pendaftaran' },
            { label: 'Daftar Ulang', href: '/admin/dashboard/verifikasi-daftar-ulang' },
        ]
    },
    { icon: Megaphone, label: 'Pengumuman', href: '/admin/dashboard/kelolapengumuman' },
    { icon: FileText, label: 'Laporan PMB', href: '/admin/dashboard/daftar-harian-pmb' },
    // { icon: FileText, label: 'Laporan PMB', href: '/admin/dashboard/reports' },
    { icon: Calendar, label: 'Manajemen Jadwal', href: '/admin/dashboard/kelola-jadwal-pmb' },
    { icon: Users, label: 'Manajemen User', href: '/admin/dashboard/manajemen-user' },
    { icon: User, label: 'Profil Saya', href: '/admin/dashboard/profile' },
    // { icon: SplitSquareHorizontal, label: 'Cetak Rekap', href: '/admin/dashboard/xx' },
]

function MenuItemGroup({ item, isCollapsed }) {
    const pathname = usePathname()
    const isActive = item.children.some(child => pathname.startsWith(child.href))
    const [isOpen, setIsOpen] = useState(isActive)

    useEffect(() => {
        if (isActive && !isCollapsed) {
            setIsOpen(true)
        } else if (isCollapsed) {
            setIsOpen(false)
        }
    }, [isActive, pathname, isCollapsed])

    return (
        <div className="space-y-1">
            <button
                onClick={() => {
                    if (isCollapsed) return;
                    setIsOpen(!isOpen)
                }}
                title={isCollapsed ? item.label : ''}
                className={`
                    w-full relative flex items-center justify-between px-3 py-2.5 rounded-xl
                    transition-all duration-200 group
                    ${isActive
                        ? 'bg-white/10 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }
                `}
            >
                {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-r-full" />
                )}
                <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isActive ? 'text-blue-400' : ''} group-hover:scale-110`} />
                    {!isCollapsed && (
                        <span className="text-sm font-semibold whitespace-nowrap tracking-tight">
                            {item.label}
                        </span>
                    )}
                </div>
                {!isCollapsed && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                )}
            </button>

            {(!isCollapsed && isOpen) && (
                <ul className="pl-8 pr-2 py-1 space-y-1">
                    {item.children.map((child) => {
                        const isChildActive = pathname.startsWith(child.href)
                        return (
                            <li key={child.href}>
                                <Link
                                    href={child.href}
                                    className={`
                                        block px-3 py-2 text-sm rounded-lg transition-colors
                                        ${isChildActive
                                            ? 'bg-blue-500/10 text-blue-400 font-medium'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isChildActive ? 'bg-blue-400' : 'bg-slate-600'}`} />
                                        <span className="truncate">{child.label}</span>
                                    </div>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, onMobileClose }) {
    const logoutWithConfirm = useLogout()

    return (
        <>
            {/* ── Mobile Backdrop Overlay ── */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={onMobileClose}
                />
            )}

            {/* ── Sidebar ── */}
            <aside className={`
                fixed left-0 top-0 h-screen flex flex-col
                bg-slate-950 border-r border-white/5
                transition-all duration-300 ease-in-out z-50
                md:z-40
                ${
                    // Mobile: tersembunyi di kiri, muncul saat isMobileOpen
                    // Desktop: selalu tampil, lebar berubah sesuai isCollapsed
                    isMobileOpen
                        ? 'translate-x-0 w-72'
                        : '-translate-x-full md:translate-x-0'
                }
                ${!isMobileOpen ? (isCollapsed ? 'md:w-20' : 'md:w-64') : ''}
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
            <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
                <ul className="space-y-1 px-3">
                    {menuItems.map((item) => (
                        <li key={item.label}>
                            {item.isGroup ? (
                                <MenuItemGroup item={item} isCollapsed={isCollapsed} />
                            ) : (
                                <ItemAktif
                                    href={item.href}
                                    icon={item.icon}
                                    label={item.label}
                                    isCollapsed={isCollapsed}
                                />
                            )}
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
                    {(!isCollapsed || isMobileOpen) && (
                        <span className="text-sm font-bold">Keluar</span>
                    )}
                </button>
            </div>

            {/* ── Close Button (mobile drawer) ── */}
            {isMobileOpen && (
                <button
                    onClick={onMobileClose}
                    className="absolute top-4 right-4 md:hidden w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    title="Tutup Menu"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            {/* ── Expand Button (when collapsed, desktop only) ── */}
            {isCollapsed && !isMobileOpen && (
                <button
                    onClick={() => setIsCollapsed(false)}
                    title="Buka Sidebar"
                    className="absolute top-1/2 -translate-y-1/2 -right-3.5 w-7 h-7 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 shadow-lg transition-all hidden md:flex"
                >
                    <ChevronRight className="w-3.5 h-3.5" />
                </button>
            )}
        </aside>
        </>
    )
}
