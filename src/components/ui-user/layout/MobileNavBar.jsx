'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
    Home,
    FileText,
    Megaphone,
    User,
    LogOut,
} from 'lucide-react'
import { useLogout } from '@/components/alerLogout/UseLogout'

const menuItems = [
    { icon: Home,      label: 'Dashboard',   href: '/user/dashboard' },
    { icon: FileText,  label: 'Daftar',      href: '/user/dashboard/pendaftaran' },
    { icon: Megaphone, label: 'Pengumuman',  href: '/user/dashboard/pengumuman' },
    { icon: User,      label: 'Profil',      href: '/user/dashboard/profile' },
]

function NavItem({ icon: Icon, label, href }) {
    const pathname = usePathname()

    const isActive = href === '/user/dashboard'
        ? pathname === href
        : pathname.startsWith(href)

    return (
        <Link
            href={href}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 group"
        >
            {/* Icon wrapper */}
            <span className={`
                relative flex items-center justify-center w-10 h-7 rounded-xl
                transition-all duration-200
                ${isActive ? 'bg-blue-500/15' : 'group-active:bg-white/5'}
            `}>
                {isActive && (
                    <span className="absolute inset-x-3 -top-0.5 h-0.5 bg-blue-400 rounded-full" />
                )}
                <Icon className={`w-5 h-5 transition-all duration-200 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
            </span>

            {/* Label */}
            <span className={`text-[10px] font-bold tracking-tight transition-colors duration-200 ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>
                {label}
            </span>
        </Link>
    )
}

export default function MobileNavBar() {
    const logoutWithConfirm = useLogout()

    return (
        <nav className={`
            fixed bottom-0 left-0 right-0 z-50
            md:hidden
            bg-slate-950/95 backdrop-blur-xl
            border-t border-white/5
            flex items-stretch
            safe-area-bottom
        `}
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            {menuItems.map((item) => (
                <NavItem key={item.href} {...item} />
            ))}

            {/* Logout button */}
            <button
                onClick={logoutWithConfirm}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 group"
            >
                <span className="flex items-center justify-center w-10 h-7 rounded-xl group-active:bg-rose-500/10 transition-all duration-200">
                    <LogOut className="w-5 h-5 text-slate-500 group-hover:text-rose-400 transition-colors duration-200" />
                </span>
                <span className="text-[10px] font-bold tracking-tight text-slate-500 group-hover:text-rose-400 transition-colors duration-200">
                    Keluar
                </span>
            </button>
        </nav>
    )
}
