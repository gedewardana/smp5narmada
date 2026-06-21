'use client'

import React from 'react'
import { 
    CheckCircle2, 
    Info, 
    AlertTriangle, 
    XCircle, 
    FileText, 
    Bell,
    UserCheck,
    MessageSquare,
    AlertCircle
} from 'lucide-react'

const NotifikasiIcon = ({ kategori }) => {
    // Definisi container icon premium
    const getIconContent = () => {
        switch (kategori) {
            case 'SUCCESS':
                return {
                    icon: CheckCircle2,
                    bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                    glow: 'shadow-emerald-500/5'
                }
            case 'WARNING':
                return {
                    icon: AlertTriangle,
                    bg: 'bg-amber-50 text-amber-600 border-amber-100',
                    glow: 'shadow-amber-500/5'
                }
            case 'DANGER':
                return {
                    icon: AlertCircle,
                    bg: 'bg-rose-50 text-rose-600 border-rose-100',
                    glow: 'shadow-rose-500/5'
                }
            case 'FILE':
                return {
                    icon: FileText,
                    bg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
                    glow: 'shadow-indigo-500/5'
                }
            case 'USER':
                return {
                    icon: UserCheck,
                    bg: 'bg-cyan-50 text-cyan-600 border-cyan-100',
                    glow: 'shadow-cyan-500/5'
                }
            case 'INFO':
            default:
                return {
                    icon: Info,
                    bg: 'bg-blue-50 text-blue-600 border-blue-100',
                    glow: 'shadow-blue-500/5'
                }
        }
    }

    const { icon: Icon, bg, glow } = getIconContent()

    return (
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 ${bg} ${glow} group-hover:scale-110`}>
            <Icon className="w-5 h-5 stroke-[2.5]" />
        </div>
    )
}

export default NotifikasiIcon
