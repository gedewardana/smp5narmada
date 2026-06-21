'use client'

import React, { memo } from 'react'
import HasilSeleksiBadge from './HasilSeleksiBadge'
import { Pencil, Plus, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DataTable from '../common/DataTable'
import { getInitials, getAvatarGradient } from '@/utils/avatar'

const formatDate = (dateString) => {
    if (!dateString) return <span className="text-slate-300 italic text-[10px]">— No Date —</span>
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return <span className="text-rose-300">Invalid</span>
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric'
        }).format(date)
    } catch {
        return <span className="text-rose-300 italic">Error</span>
    }
}

function ListPengumuman({ pengumumanList = [], onSelectItem, onViewDetail, readOnly = false, rowSelection, onRowSelectionChange }) {

    const columns = React.useMemo(() => {
        const baseColumns = [
            {
                accessorKey: 'nama_lengkap',
                header: 'Pendaftar',
                cell: ({ row }) => {
                    const name = row.original.nama_lengkap || 'Unknown'
                    return (
                        <div className="flex items-center gap-3 py-1 translate-x-1 group-hover/row:translate-x-2 transition-transform duration-300">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarGradient(name)} flex items-center justify-center border border-white/20 shadow-sm flex-shrink-0 transition-colors`}>
                                <span className="text-[10px] font-bold text-white uppercase">
                                    {getInitials(name)}
                                </span>
                            </div>
                            <div className="min-w-0 pr-4">
                                <h4 className="text-[13px] font-black text-slate-900 truncate tracking-tight uppercase leading-tight">{name}</h4>
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
                accessorKey: 'pengumuman_hasil_seleksi',
                header: 'Status Hasil Seleksi',
                cell: (info) => (
                    <div className="flex-shrink-0 min-w-[120px] scale-90 -translate-x-2">
                        <HasilSeleksiBadge hasil={info.getValue()} />
                    </div>
                ),
            },
            {
                accessorKey: 'diperbaharui_pada',
                header: 'Diumumkan Pada',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-0.5 pr-4">
                        <div className="flex items-center text-[10px] font-bold text-slate-600 whitespace-nowrap font-mono tabular-nums">
                            {row.original.pengumuman_hasil_seleksi === "MENUNGGU_PENGUMUMAN" ? formatDate(null) : formatDate(row.original.diperbaharui_pada)}
                        </div>
                    </div>
                )
            },
            {
                id: 'aksi',
                header: 'Aksi',
                cell: ({ row }) => {
                    const item = row.original;
                    const isFinal = ['DITERIMA', 'TIDAK_DITERIMA'].includes(item.pengumuman_hasil_seleksi)

                    return (
                        <div className="flex items-center justify-end gap-2 pr-4">
                            {/* Tombol View Detail */}
                            <Button
                                variant="outline"
                                size="sm"
                                title="Lihat Detail Pendaftaran"
                                onClick={() => onViewDetail && onViewDetail(item)}
                                // className="h-9 px-4 rounded border border-slate-200 bg-white shadow-sm hover:border-indigo-500 hover:text-indigo-600 active:scale-95 transition-all text-xs font-bold gap-2"
                            >
                                Detail
                            </Button>

                            {!readOnly && (
                                <Button
                                    size="sm"
                                    title={isFinal ? "Edit Hasil" : "Input Hasil"}
                                    onClick={() => onSelectItem && onSelectItem(item)}
                                    variant={isFinal ? "verifikasi2" : "verifikasi"}
                                    // className={`h-9 px-4 rounded text-xs font-bold gap-2 transition-all active:scale-95 shadow-sm hover:shadow-md `}
                                >
                                    {isFinal ? (
                                        <>
                                            Edit
                                        </>
                                    ) : (
                                        <>
                                            Input
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    )
                }
            }
        ];

        // Tambahkan kolom checkbox di paling kiri jika tidak readOnly
        if (!readOnly) {
            baseColumns.unshift({
                id: 'select',
                header: ({ table }) => {
                    const SELECTABLE = ['MENUNGGU', 'MENUNGGU_PENGUMUMAN']
                    const allRows = table.getRowModel().rows
                    const selectableRows = allRows.filter(r =>
                        SELECTABLE.includes(r.original.pengumuman_hasil_seleksi)
                    )
                    const selectedCount = selectableRows.filter(r => r.getIsSelected()).length
                    const allSelected = selectableRows.length > 0 && selectedCount === selectableRows.length
                    const someSelected = selectedCount > 0 && !allSelected

                    const handleToggleAll = () => {
                        if (allSelected) {
                            // Deselect semua yang eligible
                            selectableRows.forEach(r => r.toggleSelected(false))
                        } else {
                            // Select semua yang eligible
                            selectableRows.forEach(r => r.toggleSelected(true))
                        }
                    }

                    return (
                        <input
                            type="checkbox"
                            checked={allSelected}
                            ref={el => { if (el) el.indeterminate = someSelected }}
                            onChange={handleToggleAll}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                    )
                },
                cell: ({ row }) => {
                    const status = row.original.pengumuman_hasil_seleksi;
                    const canSelect = ['MENUNGGU', 'MENUNGGU_PENGUMUMAN'].includes(status);

                    return (
                        <input
                            type="checkbox"
                            checked={row.getIsSelected()}
                            onChange={row.getToggleSelectedHandler()}
                            disabled={!canSelect}
                            className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${!canSelect ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'cursor-pointer'}`}
                        />
                    )
                },
            });
        }

        return baseColumns;
    }, [readOnly, onSelectItem])

    return (
        <DataTable
            columns={columns}
            data={pengumumanList}
            emptyTitle="Antrean Pengumuman Kosong"
            emptyDescription="Tidak ada data pendaftaran yang tersedia untuk pengumuman saat ini."
            footerText="Halaman ini menampilkan daftar status pengumuman calon siswa baru"
            enableRowSelection={!readOnly}
            rowSelection={rowSelection}
            onRowSelectionChange={onRowSelectionChange}
            getRowId={(row) => row.id_pengumuman}
        />
    )
}

export default memo(ListPengumuman)
