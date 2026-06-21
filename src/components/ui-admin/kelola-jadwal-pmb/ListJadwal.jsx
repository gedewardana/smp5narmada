'use client'

import React, { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Calendar, Users, Clock, Trash2 } from 'lucide-react'
import DataTable from '@/components/ui-admin/common/DataTable'

const STATUS_CONFIG = {
    DIBUKA: { label: 'Dibuka', className: 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm shadow-emerald-100/20' },
    DITUTUP: { label: 'Ditutup', className: 'bg-slate-50 text-slate-500 border-slate-100' },
    BELUM_DIBUKA: { label: 'Belum Dibuka', className: 'bg-blue-50 text-blue-700 border-blue-100 shadow-sm shadow-blue-100/20' },
}

const formatDate = (dateStr) => {
    if (!dateStr) return <span className="text-slate-300 italic">—</span>
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric'
    })
}

const formatRange = (start, end) => {
    if (!start || !end) return <span className="text-slate-300 italic">— No Range —</span>
    const s = new Date(start).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
    const e = new Date(end).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' })
    return `${s} — ${e}`
}

function ListJadwal({ onEdit, onDelete, onDetail, data, loading, error }) {
    const columns = useMemo(() => [
        {
            accessorKey: 'id_jadwal',
            header: 'ID',
            cell: (info) => (
                <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                    #{info.getValue()}
                </span>
            )
        },
        {
            accessorKey: 'tahun_ajaran',
            header: 'Tahun Ajaran',
            cell: (info) => (
                <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-tight">
                        {info.getValue()}
                    </span>
                    {/* <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest">Active Academic Year</span> */}
                </div>
            )
        },
        {
            accessorKey: 'status_jadwal',
            header: 'Status',
            cell: (info) => {
                const status = STATUS_CONFIG[info.getValue()] || { label: info.getValue(), className: 'bg-gray-50 text-gray-400' }
                return (
                    <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border leading-none ${status.className}`}>
                        {status.label}
                    </Badge>
                )
            }
        },
        // {
        //     accessorKey: 'daya_tampung_murid',
        //     header: 'Kuota',
        //     cell: (info) => (
        //         <div className="flex items-center gap-2">
        //             {/* <Users className="w-3.5 h-3.5 text-slate-300" /> */}
        //             <span className="text-[11px] font-bold text-slate-700 font-mono tabular-nums">
        //                 {info.getValue().toLocaleString('id-ID')}
        //                 <span className="text-[10px] ml-1 font-black text-slate-300 uppercase">Murid</span>
        //             </span>
        //         </div>
        //     )
        // },
        {
            id: 'pendaftaran',
            header: 'Pendaftaran',
            cell: ({ row }) => (
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center text-[10px] font-bold text-slate-600 font-mono tabular-nums whitespace-nowrap">
                        {/* <Calendar className="w-3 h-3 mr-2 text-indigo-300" /> */}
                        {formatRange(row.original.pendaftaran_mulai, row.original.pendaftaran_selesai)}
                    </div>
                    {/* <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 ml-5 opacity-70">Registration Phase</span> */}
                </div>
            )
        },
        {
            id: 'pengumuman',
            header: 'Pengumuman',
            cell: ({ row }) => (
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center text-[10px] font-bold text-slate-600 font-mono tabular-nums whitespace-nowrap">
                        {/* <Clock className="w-3 h-3 mr-2 text-amber-300" /> */}
                        {formatDate(row.original.pengumuman)}
                    </div>
                    {/* <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 ml-5 opacity-70">Result Date</span> */}
                </div>
            )
        },
        // {
        //     id: 'daftar_ulang',
        //     header: 'Daftar Ulang',
        //     cell: ({ row }) => (
        //         <div className="flex flex-col gap-0.5">
        //             <div className="flex items-center text-[10px] font-bold text-slate-600 font-mono tabular-nums whitespace-nowrap">                       
        //                 {formatRange(row.original.pendaftaran_ulang_mulai, row.original.pendaftaran_ulang_selesai)}
        //             </div>
        //         </div>
        //     )
        // },
        // {
        //     id: 'masa_pengenalan',
        //     header: 'Masa Pengenalan',
        //     cell: ({ row }) => (
        //         <div className="flex flex-col gap-0.5">
        //             <div className="flex items-center text-[10px] font-bold text-slate-600 font-mono tabular-nums whitespace-nowrap">
        //                 {formatRange(row.original.masa_pengenalan_mulai, row.original.masa_pengenalan_selesai)}
        //             </div>
        //         </div>
        //     )
        // },
        {
            id: 'aksi',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex items-center justify-end pr-4 gap-2">

                     <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDetail?.(row.original.id_jadwal)}
                    >
                        Detail
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onEdit?.(row.original)}
                        // className="h-9 px-4 rounded border border-slate-200 bg-white shadow-sm hover:border-indigo-500 hover:text-indigo-600 active:scale-95 transition-all text-xs font-bold gap-2"
                    >
                        
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete?.(row.original.id_jadwal)}
                        // className="h-9 px-4 rounded shadow-sm hover:bg-red-600 active:scale-95 transition-all text-xs font-bold gap-2"
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
                
            )
        }
    ], [onEdit, onDelete, onDetail])

    return (
        <DataTable
            columns={columns}
            data={data}
            isLoading={loading}
            emptyTitle={error ? "Gagal Memuat Jadwal" : "Belum Ada Jadwal"}
            emptyDescription={error ? error : "Silakan tambahkan jadwal PMB baru untuk memulai operasional pendaftaran."}
            footerText="Kelola periode pendaftaran dan jadwal operasional PMB"
            className="mb-8"
        />
    )
}

export default ListJadwal