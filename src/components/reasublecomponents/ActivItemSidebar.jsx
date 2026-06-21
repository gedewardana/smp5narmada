'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ItemAktif({ href, icon: Icon, label, isCollapsed }) {
    const pathname = usePathname()

    const isActive = () => {
        if (href === '/admin/dashboard' || href === '/user/dashboard') {
            return pathname === href
        }
        return pathname.startsWith(href)
    }

    const active = isActive()

    return (
        <Link
            href={href}
            title={isCollapsed ? label : ''}
            className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200 group
                ${active
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }
            `}
        >
            {/* Active Indicator Bar */}
            {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-r-full" />
            )}

            {/* Icon */}
            <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${active ? 'text-blue-400' : ''} group-hover:scale-110`} />

            {/* Label */}
            {!isCollapsed && (
                <span className="text-sm font-semibold whitespace-nowrap tracking-tight">
                    {label}
                </span>
            )}
        </Link>
    )
}