'use client'

import React, { useState, useCallback, memo, useMemo } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table'
import {
    Loader2,
    Fingerprint,
    SearchX,
    ArrowUp,
    Info
} from 'lucide-react'
import { cn } from "@/lib/utils"
import {
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table"
import { Empty, EmptyHeader, EmptyMedia, EmptyDescription, EmptyTitle } from '@/components/ui/empty'

/**
 * Loading State Component
 */
const TableLoader = memo(() => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 p-24 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
        <div className="relative w-20 h-20 mb-8">
            <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-20" />
            <Loader2 className="w-20 h-20 animate-spin text-indigo-600 opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
                <Fingerprint className="w-10 h-10 text-indigo-600 animate-pulse" />
            </div>
        </div>
        <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Menyiapkan Data...</h3>
            <p className="text-sm font-medium text-slate-400 max-w-xs mx-auto">
                Sedang mengoptimalkan antrean data administratif untuk Anda.
            </p>
        </div>
    </div>
))

/**
 * Empty State Component
 */
const TableEmptyState = memo(({ title, description, colSpan }) => (
    <TableRow className="hover:bg-transparent">
        <TableCell colSpan={colSpan} className="h-[450px] p-0">
            <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-700">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon" className="bg-amber-50 rounded-2xl p-4 shadow-inner">
                            <SearchX className="w-12 h-12 text-amber-500 animate-bounce" />
                        </EmptyMedia>
                        <EmptyTitle className="text-xl font-black text-slate-900 mt-4">{title}</EmptyTitle>
                        <EmptyDescription className="text-slate-400 font-medium max-w-sm mt-2">
                            {description}
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </div>
        </TableCell>
    </TableRow>
))

/**
 * Professional DataTable Component for Admin Dashboard
 * 
 * @param {Object} props
 * @param {Array} props.columns - TanStack Table column definitions
 * @param {Array} props.data - Source data array
 * @param {Boolean} props.isLoading - Loading state toggle
 * @param {String} props.emptyTitle - Custom empty title
 * @param {String} props.emptyDescription - Custom empty description
 * @param {String} props.footerText - Informative footer meta text
 * @param {Function} props.onRowClick - Callback for row clicks
 * @param {String|Number} props.selectedRowId - ID of row to highlight
 * @param {String} props.maxHeight - CSS max-height for the scroll area
 */
function DataTable({
    columns,
    data = [],
    isLoading = false,
    emptyTitle = "Data Tidak Ditemukan",
    emptyDescription = "Coba ubah filter atau cari dengan kata kunci lain.",
    footerText = "Sistem Manajemen PMB Terintegrasi",
    onRowClick,
    selectedRowId,
    className = "",
    maxHeight = "480px",
    enableRowSelection = false,
    rowSelection = {},
    onRowSelectionChange,
    getRowId
}) {
    const [showScrollTop, setShowScrollTop] = useState(false)
    const scrollContainerRef = React.useRef(null)

    const handleScroll = useCallback((e) => {
        const scrollTop = e.currentTarget.scrollTop
        setShowScrollTop(scrollTop > 200)
    }, [])

    const scrollToTop = useCallback(() => {
        scrollContainerRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [])

    const table = useReactTable({
        data,
        columns,
        state: {
            rowSelection,
        },
        enableRowSelection,
        onRowSelectionChange,
        getRowId,
        getCoreRowModel: getCoreRowModel(),
    })

    if (isLoading) {
        return (
            <div className={cn("p-1", className)}>
                <TableLoader />
            </div>
        )
    }

    return (
        <div className={cn("p-1 group/table-container relative", className)}>
            {/* Main Table Shell */}
            <div className="bg-white rounded-lg border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden transition-all duration-500">

                {/* Scrollable Area */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="overflow-auto scrollbar-thin scrollbar-thumb-slate-200 no-scrollbar"
                    style={{ maxHeight }}
                >
                    <table className="w-full text-sm relative border-collapse min-w-[900px]">
                        {/* Header: Sticky + Backdrop Blur */}
                        <TableHeader className="sticky top-0 z-30 bg-emerald-50/80 backdrop-blur-xl shadow-sm border-b border-emerald-100/50">
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id} className="border-none hover:bg-transparent">
                                    {headerGroup.headers.map(header => (
                                        <TableHead
                                            key={header.id}
                                            className="h-14 px-8 text-[10px] font-extrabold text-emerald-800 uppercase tracking-[0.25em] border-r border-emerald-100/30 last:border-r-0"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                {header.isPlaceholder ? null : (
                                                    <span className="flex items-center gap-1.5 transition-colors group-hover:text-indigo-600">
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                    </span>
                                                )}
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>

                        {/* Body */}
                        <TableBody>
                            {table.getRowModel().rows?.length > 0 ? (
                                table.getRowModel().rows.map((row, idx) => {
                                    const isSelected = !!selectedRowId && selectedRowId === (row.original.id_daftar_ulang || row.original.id_pendaftaran || row.original.id_jadwal || row.original.id)
                                    
                                    return (
                                        <TableRow
                                            key={row.id}
                                            onClick={() => onRowClick?.(row.original)}
                                            className={cn(
                                                "group/row cursor-pointer border-b border-slate-50 last:border-0 transition-all duration-300 border-l-[6px]",
                                                idx % 2 === 0 ? "bg-white" : "bg-slate-50/20",
                                                isSelected 
                                                    ? "bg-indigo-50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]" 
                                                    : "border-l-transparent hover:bg-slate-50/80 hover:border-l-indigo-100"
                                            )}
                                        >
                                            {row.getVisibleCells().map(cell => (
                                                <TableCell 
                                                    key={cell.id} 
                                                    className="h-16 px-8 py-0 transition-colors border-r border-slate-50 last:border-r-0"
                                                >
                                                    <div className={cn(
                                                        "transition-all duration-300",
                                                        isSelected ? "translate-x-1" : "group-hover/row:translate-x-0.5"
                                                    )}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </div>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableEmptyState 
                                    title={emptyTitle} 
                                    description={emptyDescription} 
                                    colSpan={columns.length} 
                                />
                            )}
                        </TableBody>
                    </table>
                </div>
            </div>

            {/* Footer: Metadata & Branding & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-6 gap-4 print:hidden">
                <div className="flex items-center gap-3 py-2 px-4 bg-slate-100/50 rounded-xl border border-slate-100">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {footerText}
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* Scroll to Top - Integrated into footer to avoid covering table row actions */}
                    {showScrollTop && (
                        <button
                            onClick={scrollToTop}
                            title="Kembali ke atas"
                            className="group flex items-center gap-2 px-4 py-2 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-all duration-300 animate-in fade-in slide-in-from-right-4 border border-indigo-100 shadow-sm active:scale-95"
                        >
                            <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1" />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">Ke Atas</span>
                        </button>
                    )}

                    <div className="flex items-center gap-2.5 text-slate-300 group-hover/table-container:text-indigo-400 transition-all duration-500 cursor-default">
                        <Fingerprint className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em]">Command Hub</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(DataTable)
