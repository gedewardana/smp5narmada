'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import VerifikasiButton from './VerifikasiButton'
import {
    User, Users, Home, Trophy, FileCheck,
    ClipboardList, FolderOpen, CheckCircle, X,
    MoreVertical, Clock, CheckCircle2, LogOut
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getInitials, getAvatarGradient } from '@/utils/avatar'

const STATUS_OPTIONS = [
    { 
        value: 'BELUM', 
        label: 'Belum', 
        icon: Clock, 
        className: 'text-amber-600 focus:text-amber-600 focus:bg-amber-50' 
    },
    { 
        value: 'SUDAH', 
        label: 'Sudah', 
        icon: CheckCircle2, 
        className: 'text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50' 
    },
    { 
        value: 'MENGUNDURKAN_DIRI', 
        label: 'Mengundurkan Diri', 
        icon: LogOut, 
        className: 'text-rose-500 focus:text-red-500 focus:bg-red-50' 
    },
]

// ─── Navigation Config ────────────────────────────────────────────────────────

const NAVIGATION = [
    {
        id: 'formulir_pendaftaran',
        label: 'Formulir Pendaftaran',
        icon: ClipboardList,
        children: [
            { id: 'identitas',  label: 'Identitas',     icon: User     },
            { id: 'dataayah',   label: 'Data Ayah',     icon: Users    },
            { id: 'dataibu',    label: 'Data Ibu',      icon: Users    },
            { id: 'datawali',   label: 'Data Wali',     icon: Users    },
            { id: 'periodik',   label: 'Data Periodik', icon: Home     },
            { id: 'prestasi',   label: 'Prestasi',      icon: Trophy   },
        ],
    },
    {
        id: 'berkas_persyaratan',
        label: 'Berkas Persyaratan',
        icon: FolderOpen,
        children: [
            { id: 'berkas_persyaratan', label: 'Berkas Persyaratan', icon: FileCheck },
        ],
    },
  
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function Header({ detailData, activeTab, setActiveTab, onVerify, onStatusUpdate, readOnly = false }) {
    const router = useRouter()

    const activeParent = useMemo(() =>
        NAVIGATION.find(p =>
            p.id === activeTab || p.children?.some(c => c.id === activeTab)
        ),
    [activeTab])

    const handleMainTabClick = (parent) => {
        setActiveTab(parent.children?.[0]?.id ?? parent.id)
    }

    const handleClose = () => {
        router.push(
            readOnly
                ? '/admin/dashboard/verifikasi-daftar-ulang'
                : '/admin/dashboard/verifikasi-pendaftaran'
        )
    }

    if (!detailData) return null

    return (
        <div className="flex-shrink-0 bg-white z-10 border-b border-slate-100 shadow-sm">

            {/* ── Top Row: Profile + Actions ── */}
            <div className="flex items-center justify-between gap-2 px-3 sm:px-6 py-2.5 sm:py-0 sm:h-14">

                {/* Left — Candidate Profile */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br ${getAvatarGradient(detailData.identitas_peserta_didik?.nama_lengkap)} flex items-center justify-center shadow-sm shadow-blue-500/20 flex-shrink-0 text-white font-bold text-[10px] sm:text-xs`}>
                        {getInitials(detailData.identitas_peserta_didik?.nama_lengkap || 'Draft Pendaftaran')}
                    </div>
                    <div className="flex flex-col leading-none min-w-0">
                        <span className="text-[12px] sm:text-[13px] font-black text-slate-800 tracking-tight truncate">
                            {detailData.identitas_peserta_didik?.nama_lengkap || 'Draft Pendaftaran'}
                        </span>
                        <span className="mt-0.5 text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md w-fit">
                            {detailData.nomor_pendaftaran}
                        </span>
                    </div>
                </div>

                {/* Right — Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    {!readOnly && onVerify && (
                        <VerifikasiButton
                            status={detailData?.status_verifikasi}
                            onClick={onVerify}
                        />
                    )}

                    {/* Quick Status Dropdown */}
                    {readOnly && onStatusUpdate && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm"
                                    title="Ubah Status Cepat"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="p-2 min-w-[200px] rounded-xl shadow-xl shadow-slate-200 border-slate-100">
                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 px-2">
                                    Update Status Cepat
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="mb-2 opacity-10" />
                                {STATUS_OPTIONS.map(({ value, label, icon: Icon, className }) => {
                                    const currentStatus = detailData?.status_daftar_ulang || detailData?.status_verifikasi
                                    const isActive = currentStatus === value
                                    return (
                                        <DropdownMenuItem
                                            key={value}
                                            className={`flex items-center gap-2 p-2 rounded-lg text-[11px] font-bold transition-all ${className} ${isActive ? 'bg-slate-50 ring-1 ring-slate-100 cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                                            onSelect={() => !isActive && onStatusUpdate?.(value)}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            {label}
                                            {isActive && (
                                                <span className="ml-auto text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-black uppercase">
                                                    Aktif
                                                </span>
                                            )}
                                        </DropdownMenuItem>
                                    )
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <button
                        onClick={handleClose}
                        title="Tutup"
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-red-50 border border-red-100 text-red-400 hover:bg-red-100 hover:border-red-200 transition-all"
                    >
                        <X className="w-4 h-4 text-red-500" />
                    </button>
                </div>
            </div>

            {/* ── Main Tabs Row (scrollable horizontal) ── */}
            <div className="border-t border-slate-100 overflow-x-auto scrollbar-hide">
                <nav className="flex items-stretch h-10 sm:h-11 min-w-max px-3 sm:px-6 gap-0">
                    {NAVIGATION.map((parent) => {
                        const isActive  = activeParent?.id === parent.id
                        const ParentIcon = parent.icon
                        return (
                            <button
                                key={parent.id}
                                onClick={() => handleMainTabClick(parent)}
                                className={`
                                    relative flex items-center gap-1.5 px-3 sm:px-4 text-[11px] sm:text-[12px] font-bold
                                    transition-all duration-200 whitespace-nowrap rounded-none outline-none flex-shrink-0
                                    ${isActive
                                        ? 'text-blue-700'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                    }
                                `}
                            >
                                <ParentIcon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                {parent.label}

                                {/* Active underline */}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-blue-600 rounded-t-full" />
                                )}
                            </button>
                        )
                    })}
                </nav>
            </div>

            {/* ── Sub-tabs Row ── */}
            {activeParent?.children && activeParent.children.length > 1 && (
                <div className="px-3 sm:px-6 py-2 flex gap-1.5 overflow-x-auto scrollbar-hide border-t border-slate-50 bg-slate-50/50">
                    {activeParent.children.map((child) => {
                        const isActive  = activeTab === child.id
                        const ChildIcon = child.icon
                        return (
                            <button
                                key={child.id}
                                onClick={() => setActiveTab(child.id)}
                                className={`
                                    flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full flex-shrink-0
                                    text-[10px] sm:text-[11px] font-bold whitespace-nowrap transition-all duration-200
                                    ${isActive
                                        ? 'bg-white text-blue-700 shadow-sm border border-blue-100'
                                        : 'text-slate-500 hover:bg-white/80 hover:text-slate-700'
                                    }
                                `}
                            >
                                <ChildIcon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
                                {child.label}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}