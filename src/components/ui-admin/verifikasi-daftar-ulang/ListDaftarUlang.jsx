'use client'

import React, { useState, useCallback, memo } from 'react'
import StatusBadge from './StatusBadge'
import { useRouter } from 'next/navigation'
import {
    Clock,
    CheckCircle2,
    LogOut,
    MoreHorizontal,
    Calendar,
    Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import DataTable from '../common/DataTable'
import { getInitials, getAvatarGradient } from '@/utils/avatar' 


const STATUS_OPTIONS = [
    {
        value: 'BELUM',
        label: 'Belum',
        icon: Clock,
        className: 'text-amber-600 focus:text-amber-600 focus:bg-amber-50',
    },
    {
        value: 'SUDAH',
        label: 'Sudah',
        icon: CheckCircle2,
        className: 'text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50',
    },
    {
        value: 'MENGUNDURKAN_DIRI',
        label: 'Mengundurkan Diri',
        icon: LogOut,
        className: 'text-red-500 focus:text-red-500 focus:bg-red-50',
    },
]

const formatDate = (dateString) => {
    if (!dateString) return <span className="text-slate-300 italic text-[10px]">— No Date —</span>
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return <span className="text-rose-300">Invalid —</span>
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(date)
    } catch {
        return <span className="text-rose-300 italic">Error —</span>
    }
}

function ListDaftarUlang({ pendaftaranUlangData = [], isLoading = false, onSelectDaftarUlang, onUpdateStatus, readOnly = false }) {
    const router = useRouter()
    const [selectedId, setSelectedId] = useState(null)
    // untuk menyimpan ID pendaftaran yang dropdown-nya sedang dibuka.
    const [openMenuId, setOpenMenuId] = useState(null)
    
    const [loadingId, setLoadingId] = useState(null)

    const handleStatusChange = async (e, id, newStatus) => {
        e.stopPropagation()
        setLoadingId(id)
        await onUpdateStatus?.(id, newStatus)
        setLoadingId(null)
    }

    // const handleRowClick = useCallback((item) => {
    //     const id = item.id_daftar_ulang
    //     setSelectedId(id === selectedId ? null : id)
    //     onSelectDaftarUlang?.(id)
    // }, [selectedId, onSelectDaftarUlang])

    const columns = React.useMemo(() => [
        {
            accessorKey: 'nama_lengkap',
            header: 'Siswa & Identitas',
            cell: ({ row }) => {
                const name = row.original.nama_lengkap || 'Unknown';
                return (
                    <div className="flex items-center gap-3 py-1 translate-x-1 group-hover/row:translate-x-2 transition-transform duration-300">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarGradient(name)} flex items-center justify-center border border-white/20 shadow-sm flex-shrink-0 text-[10px] font-bold text-white uppercase`}>
                            {getInitials(name)}
                        </div>
                        <div className="min-w-0 pr-4">
                            <h4 className="text-[13px] font-black text-slate-900 truncate tracking-tight uppercase leading-tight">
                                {name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[9px] font-bold text-indigo-500 font-mono tracking-tighter bg-indigo-50/50 px-1 rounded">
                                    {row.original.nomor_pendaftaran}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: 'status_daftar_ulang',
            header: 'Status Daftar Ulang',
            cell: (info) => (
                <div className="flex-shrink-0 min-w-[120px] scale-90 -translate-x-2">
                    <StatusBadge status={info.getValue()} />
                </div>
            ),
        },
        {
            accessorKey: 'diperbaharui_pada',
            header: 'Update Terakhir',
            cell: (info) => (
                <div className="flex flex-col gap-0.5 pr-4">
                    <div className="flex items-center text-[10px] font-bold text-slate-600 whitespace-nowrap font-mono tabular-nums">
                        {formatDate(info.getValue())}
                    </div>
                </div>
            )
        },
        {
            id: 'aksi',
            header: 'Aksi',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex items-center justify-end gap-2 pr-4">
                        {!readOnly && (
                            <DropdownMenu onOpenChange={(open) => setOpenMenuId(open ? item.id_daftar_ulang : null)}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        disabled={loadingId === item.id_daftar_ulang}
                                        onClick={(e) => e.stopPropagation()}
                                        
                                    >
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="p-2 min-w-[180px] rounded-xl shadow-xl shadow-slate-200" onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 px-2">
                                        Update Status
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="mb-2 opacity-10" />
                                    {STATUS_OPTIONS.map(({ value, label, icon: Icon, className }) => (
                                        <DropdownMenuItem
                                            key={value}
                                            className={`flex items-center gap-2 p-2 rounded-lg text-xs font-bold transition-all ${className} ${item.status_daftar_ulang === value ? 'bg-slate-50 ring-1 ring-slate-100 cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                                            onSelect={(e) => item.status_daftar_ulang !== value && handleStatusChange(e, item.id_daftar_ulang, value)}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {label}
                                            {item.status_daftar_ulang === value && (
                                                <span className="ml-auto text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black uppercase tracking-tight">
                                                    Aktif
                                                </span>
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* Button Detail */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (item.id_pendaftaran) {
                                    router.push(`/admin/dashboard/verifikasi-pendaftaran/detailpendaftaran/${item.id_pendaftaran}?readOnly=true&daftarUlangId=${item.id_daftar_ulang}`);
                                } else {
                                    onSelectDaftarUlang?.(item.id_daftar_ulang);
                                }
                            }}
                            
                        >
                            
                            <span>Detail</span>
                        </Button>
                    </div>
                )
            }
        }
    ], [readOnly, loadingId])

    return (
        <DataTable
            columns={columns}
            data={pendaftaranUlangData}
            isLoading={isLoading}
            emptyTitle="Antrean Daftar Ulang Kosong"
            emptyDescription="Tidak ada pendaftar yang dijadwalkan daftar ulang saat ini."
            footerText="Halaman ini menampilkan antrean administratif daftar ulang siswa baru"
            selectedRowId={openMenuId || selectedId}
        />
    )
}

export default memo(ListDaftarUlang)