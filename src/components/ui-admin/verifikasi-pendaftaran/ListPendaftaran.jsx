'use client'

import React, { useState, useCallback, memo } from 'react'
import Link from 'next/link'
import StatusBadge from './StatusBadge'
import VerifikasiButton from './VerifikasiButton'
import { Button } from '@/components/ui/button'
import DataTable from '../common/DataTable'
import { getInitials, getAvatarGradient } from '@/utils/avatar'



// ─── Professional UI Primitives ────────────────────────────────

const formatDate = (dateString) => {
    if (!dateString) return <span className="text-slate-300 font-medium italic text-[10px] uppercase tracking-tighter">— No Date —</span>
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return <span className="text-rose-300">Invalid —</span>
        const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
        return new Intl.DateTimeFormat('id-ID', options).format(date)
    } catch {
        return <span className="text-rose-300 italic">Error —</span>
    }
}

const formatCatatan = (catatan) => {
    if (!catatan) return <span className="text-slate-300 font-medium italic text-[10px] uppercase tracking-tighter">— No Notes —</span>
    return <span className="text-slate-600 font-medium text-[10px] uppercase tracking-tighter truncate max-w-[80px]">{catatan}</span>
}

// ─── List Pendaftaran Component ────────────────────────────────

function ListPendaftaran({
    onSelectPendaftaran,
    readOnly = false,
    pendaftaranData = [],
    isLoading = false,
    className = ""
}) {
    const [selectedId, setSelectedId] = useState(null)

    const handleActionClick = useCallback((e) => {
        e.stopPropagation()
    }, [])

    const handleRowClick = useCallback((item) => {
        const id = item.id_pendaftaran
        setSelectedId(id === selectedId ? null : id)
        onSelectPendaftaran?.(id)
    }, [selectedId, onSelectPendaftaran])

    const columns = React.useMemo(() => [
        {
            id: 'nama_lengkap',
            accessorFn: row => row.identitas_peserta_didik?.nama_lengkap,
            header: 'Pendaftar',
            cell: ({ row }) => {
                const name = row.original.identitas_peserta_didik?.nama_lengkap || 'Unknown'
                const initials = getInitials(name)
                const avatarGradient = getAvatarGradient(name)

                return (
                    <div className="flex items-center gap-3 py-1 translate-x-1 group-hover/row:translate-x-2 transition-transform duration-300">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 transition-opacity bg-gradient-to-br ${avatarGradient} ring-1 ring-white/50 group-hover/row:opacity-90`}>
                            <span className="text-[11px] font-black text-white mt-px">{initials}</span>
                        </div>
                        <div className="min-w-0 pr-4">
                            <h4 className="text-[13px] font-black text-slate-900 tracking-tight uppercase leading-tight truncate ">{name}</h4>
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
            accessorKey: 'status_verifikasi',
            header: 'Status Verifikasi',
            cell: (info) => (
                <div className="flex-shrink-0 min-w-[120px] scale-90 -translate-x-2">
                    <StatusBadge status={info.getValue()} />
                </div>
            ),
        },
        {
            accessorKey: 'tanggal_submit',
            header: 'Pengajuan',
            cell: (info) => (
                <div className="flex flex-col gap-0.5 pr-4">
                    <div className="flex items-center text-[10px] font-bold text-slate-600 whitespace-nowrap font-mono tabular-nums">

                        {formatDate(info.getValue())}
                    </div>
                    {/* <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 ml-5 opacity-70">Submitted At</span> */}
                </div>
            )
        },
        // {
        //     accessorKey: 'tanggal_verifikasi',
        //     header: 'Verifikasi',
        //     cell: (info) => (
        //         <div className="flex flex-col gap-0.5 pr-4">
        //             <div className="flex items-center text-[10px] font-bold text-slate-600 whitespace-nowrap font-mono tabular-nums">

        //                 {formatDate(info.getValue())}
        //             </div>
        //         </div>
        //     )
        // },

        {
            accessorKey: 'catatan',
            header: 'Catatan',
            cell: (info) => (
                <div
                    title={info.getValue()}
                    className="flex flex-col gap-0.5 pr-4">
                    <div className="flex items-center text-[10px] font-bold text-slate-600 whitespace-nowrap font-mono tabular-nums">

                        {formatCatatan(info.getValue())}
                    </div>
                    {/* <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 ml-5 opacity-70">Verified At</span> */}
                </div>
            )
        },
        {
            id: 'aksi',
            header: 'Aksi',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex items-center justify-end gap-2 pr-4 transition-all">
                        <Link
                            href={`/admin/dashboard/verifikasi-pendaftaran/detailpendaftaran/${item.id_pendaftaran}`}
                            onClick={handleActionClick}
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                // className="h-9 px-4 rounded border border-slate-200 bg-white shadow-sm hover:border-indigo-500 hover:text-indigo-600 active:scale-95 transition-all text-xs font-bold gap-2"
                            >
                                {/* <Eye className="w-3.5 h-3.5" /> */}
                                Detail
                            </Button>
                        </Link>

                        {!readOnly && (
                            <VerifikasiButton
                                status={item.status_verifikasi}
                                href={`?modal=verifikasi&id=${item.id_pendaftaran}`}
                                onClick={handleActionClick}
                                className="transition-all"
                            />
                        )}
                    </div>
                )
            }
        }
    ], [readOnly, handleActionClick])

    return (
        <DataTable
            columns={columns}
            data={pendaftaranData}
            isLoading={isLoading}
            emptyTitle="Antrean Pendaftaran Kosong"
            emptyDescription="Tidak ada pendaftar yang masuk dalam kriteria ini. Data baru akan muncul secara real-time."
            footerText="Halaman ini menampilkan antrean administratif calon siswa baru"
            onRowClick={handleRowClick}
            selectedRowId={selectedId}
            className={className}
        />
    )
}

export default memo(ListPendaftaran)