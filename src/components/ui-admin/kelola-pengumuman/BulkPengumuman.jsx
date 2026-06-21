'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Search, CheckSquare, Save, Users } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SELECTION_OPTIONS, getBadgeClass } from './pengumumanConfig'

function BulkPengumuman({ isOpen, onClose, onSubmit, students = [], isUpdating = false, initialSelectedIds = [] }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedIds, setSelectedIds] = useState([])
    const [bulkResult, setBulkResult] = useState('')
    const [catatan, setCatatan] = useState('')
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [showOnlySelected, setShowOnlySelected] = useState(false)
    
    // State untuk rentang no pendaftaran
    const [startNo, setStartNo] = useState('')
    const [endNo, setEndNo] = useState('')
    const [appliedRange, setAppliedRange] = useState({ start: '', end: '' })

    // Reset semua state lokal setiap kali modal ditutup, atau inisialisasi jika dibuka
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('')
            setSelectedIds([])
            setBulkResult('')
            setCatatan('')
            setIsSearchOpen(false)
            setShowOnlySelected(false)
            setStartNo('')
            setEndNo('')
            setAppliedRange({ start: '', end: '' })
        } else {
            // Inisialisasi dengan ID yang sudah dipilih dari halaman sebelumnya
            if (initialSelectedIds && initialSelectedIds.length > 0) {
                setSelectedIds(initialSelectedIds)
                setShowOnlySelected(true) // Otomatis tampilkan yang dipilih agar user tidak bingung
            }
        }
    }, [isOpen, initialSelectedIds])

    if (!isOpen) return null

    // Filter students based on Search — only show unprocessed students
    const filteredStudents = students.filter(student => {
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch =
            student.nama_lengkap.toLowerCase().includes(searchLower) ||
            (student.nomor_pendaftaran && student.nomor_pendaftaran.toLowerCase().includes(searchLower))

        const isUnprocessed = ['MENUNGGU', 'MENUNGGU_PENGUMUMAN'].includes(student.pengumuman_hasil_seleksi)

        // Range Filter Logic (ekstrak angka dari belakang nomor_pendaftaran)
        let matchesRange = true
        if (appliedRange.start !== '' || appliedRange.end !== '') {
            const noPend = student.nomor_pendaftaran || ''
            const match = noPend.match(/\d+$/)
            if (match) {
                const num = parseInt(match[0], 10)
                const start = appliedRange.start !== '' ? parseInt(appliedRange.start, 10) : 0
                const end = appliedRange.end !== '' ? parseInt(appliedRange.end, 10) : Infinity
                matchesRange = num >= start && num <= end
            } else {
                matchesRange = false // Jika tidak ada angka, kecualikan dari pencarian rentang
            }
        }

        // Jika showOnlySelected aktif, hanya tampilkan yang ID-nya ada di selectedIds
        const matchesSelected = showOnlySelected ? selectedIds.includes(student.id_pengumuman) : true

        return matchesSearch && isUnprocessed && matchesRange && matchesSelected
    })

    // UI-Only Handlers
    const handleApplyRange = () => {
        setAppliedRange({ start: startNo, end: endNo })
    }

    const handleClearRange = () => {
        setStartNo('')
        setEndNo('')
        setAppliedRange({ start: '', end: '' })
    }

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const toggleSelectAll = () => {
        const allIds = filteredStudents.map(s => s.id_pengumuman)
        const allSelected = allIds.length > 0 && allIds.every(id => selectedIds.includes(id))

        if (allSelected) {
            setSelectedIds([])
        } else {
            setSelectedIds(allIds)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 lg:overflow-hidden overflow-y-auto">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl lg:h-[90vh] h-auto flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in duration-200">

                {/* 1. Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white z-10 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            Input Massal Hasil Seleksi
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Pilih siswa dari daftar, lalu tentukan hasil seleksi untuk semua yang dipilih.
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 2. Main Content (Split View) */}
                <div className="flex-1 lg:overflow-hidden grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 min-h-0">

                    {/* LEFT: Selection List */}
                    <div className="lg:col-span-2 flex flex-col h-[500px] lg:h-full overflow-hidden bg-gray-50/50 min-h-0 ">
                        {/* Toolbar Search */}
                        <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-3 sticky top-0 z-10 shrink-0">

                            {isSearchOpen ? (
                                /* ── Search Mode: input takes over full width ── */
                                <div className="relative flex-1 flex items-center gap-2 animate-in slide-in-from-right-4 duration-200">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Cari nama atau no pendaftaran..."
                                            className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery("")}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    {/* Close Search */}
                                    <button
                                        onClick={() => { setIsSearchOpen(false); setSearchQuery("") }}
                                        title="Tutup Pencarian"
                                        className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                /* ── Default Mode: Search icon + Filter Rentang ── */
                                <>
                                    {/* Search Icon Button */}
                                    <button
                                        onClick={() => setIsSearchOpen(true)}
                                        title="Cari Siswa"
                                        className="flex-shrink-0 p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 border border-gray-200 transition-all"
                                    >
                                        <Search className="w-4 h-4" />
                                    </button>

                                    {/* Filter Rentang No Pendaftaran */}
                                    <div className="flex items-center gap-2 flex-1">
                                        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Rentang No</span>

                                        {/* From */}
                                        <input
                                            type="number"
                                            placeholder="0001"
                                            value={startNo}
                                            onChange={(e) => setStartNo(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleApplyRange()}
                                            className="w-24  px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />

                                        <span className="text-sm text-gray-400">–</span>

                                        {/* To */}
                                        <input
                                            type="number"
                                            placeholder="0010"
                                            value={endNo}
                                            onChange={(e) => setEndNo(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleApplyRange()}
                                            className="w-24 px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />

                                        <Button variant="outline" size="sm" onClick={handleClearRange}>Clear</Button>
                                        
                                        {/* Toggle Tampilkan Yang Dipilih */}
                                        <div className="ml-auto flex items-center gap-2 px-2 border-l border-gray-200">
                                            <input 
                                                type="checkbox" 
                                                id="showOnlySelected"
                                                checked={showOnlySelected}
                                                onChange={(e) => setShowOnlySelected(e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <label htmlFor="showOnlySelected" className="text-xs font-semibold text-gray-600 cursor-pointer select-none">
                                                Tampilkan Pilihan ({selectedIds.length})
                                            </label>
                                        </div>
                                    </div>
                                </>
                            )}

                        </div>


                        {/* Scrollable Table */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            <Table>
                                <TableHeader className="sticky top-0 bg-green-600 z-10">
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                                checked={filteredStudents.length > 0 && filteredStudents.every(s => selectedIds.includes(s.id_pengumuman))}
                                                onChange={toggleSelectAll}
                                                disabled={filteredStudents.length === 0}
                                            />
                                        </TableHead>
                                        <TableHead className="text-white">Nama Siswa</TableHead>
                                        <TableHead className="text-white">No Pendaftaran</TableHead>
                                        <TableHead className="text-center w-32 text-white">Status</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredStudents.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-64">
                                                <div className="flex flex-col items-center justify-center text-gray-500">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                        <Search className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                    <p className="font-medium">Tidak ada siswa ditemukan</p>
                                                    <p className="text-xs mt-1">Coba cari dengan kata kunci yang berbeda.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredStudents.map(student => {
                                            const studentId = student.id_pengumuman
                                            const disabled = false
                                            const isSelected = selectedIds.includes(studentId)

                                            return (
                                                <TableRow
                                                    key={studentId}
                                                    onClick={() => !disabled && toggleSelect(studentId)}
                                                    className={`transition-all select-none${disabled
                                                        ? 'opacity-50 cursor-not-allowed bg-gray-50'
                                                        : isSelected
                                                            ? 'bg-blue-50/50 hover:bg-blue-50 cursor-pointer'
                                                            : 'cursor-pointer hover:bg-gray-50'}`}
                                                >
                                                    {/* Checkbox */}
                                                    <TableCell className="w-12">
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${disabled
                                                            ? 'bg-gray-200 border-gray-300'
                                                            : isSelected
                                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                                : 'bg-white border-gray-300 hover:border-blue-400'}`}>
                                                            {!disabled && isSelected && <CheckSquare className="w-2.5 h-2.5" />}
                                                        </div>
                                                    </TableCell>

                                                    {/* Nama Siswa */}
                                                    <TableCell>
                                                        <div className={`text-sm font-semibold transition-colors ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
                                                            {student.nama_lengkap}
                                                        </div>
                                                    </TableCell>

                                                    {/* No Pendaftaran */}
                                                    <TableCell>
                                                        <div className="text-sm text-gray-700 font-medium">
                                                            {student.nomor_pendaftaran || '-'}
                                                        </div>
                                                    </TableCell>

                                                    {/* Status */}
                                                    <TableCell className="text-center w-32">
                                                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold capitalize tracking-wide ${getBadgeClass(student.pengumuman_hasil_seleksi)}`}>
                                                            {student.pengumuman_hasil_seleksi.replace(/_/g, ' ')}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* RIGHT: Input Form */}
                    <div className="flex flex-col h-full bg-white relative z-20 shadow-[-4px_0_15px_-4px_rgba(0,0,0,0.05)] min-h-0">
                        <div className="p-6 flex-1 overflow-y-auto">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                                Tentukan Hasil
                            </h3>

                            {/* Input Hasil Seleksi */}
                            <div className="space-y-3">
                                <label className="block text-xs font-semibold text-gray-500 uppercase">
                                    Status Kelulusan
                                </label>

                                {SELECTION_OPTIONS.map((opt) => {
                                    const isActive = bulkResult === opt.id
                                    const cfg = opt.colors
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => setBulkResult(opt.id)}
                                            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all group
                                                ${isActive ? cfg.selected : `border-gray-100 bg-white text-gray-600 ${cfg.hover}`}`}
                                        >
                                            <span className="font-bold text-sm">{opt.label.toUpperCase()}</span>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                                ${isActive ? cfg.radio : 'border-gray-300'}`}>
                                                {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>



                            {/* Keterangan */}
                            <div className="mt-6">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                    Catatan / Keterangan
                                </label>
                                <textarea
                                    rows="4"
                                    className="w-full p-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                    placeholder="Tambahkan keterangan opsional untuk semua siswa terpilih..."
                                    value={catatan}
                                    onChange={(e) => setCatatan(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-2">
                            <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                                <span>Total Dipilih:</span>
                                <span className="font-bold text-gray-900 text-base">{selectedIds.length} Siswa</span>
                            </div>
                            {/* Simpan — warna ikut SELECTION_OPTIONS yang dipilih */}
                            {(() => {
                                const canSubmit = selectedIds.length > 0 && !!bulkResult
                                const selectedOpt = SELECTION_OPTIONS.find(o => o.id === bulkResult)
                                const btnClass = canSubmit
                                    ? selectedOpt?.colors.btn
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                return (
                                    <Button
                                        size="sm"
                                        disabled={!canSubmit || isUpdating}
                                        onClick={() => onSubmit({
                                            id_pengumuman_list: selectedIds,
                                            pengumuman_hasil_seleksi: bulkResult,
                                            catatan: catatan || null
                                        })}
                                        className={canSubmit && !isUpdating ? btnClass : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                                    >
                                        <Save className="w-4 h-4" />
                                        {isUpdating ? 'Menyimpan...' : 'Simpan'}
                                    </Button>
                                )
                            })()}
                            <Button
                                onClick={onClose}
                                variant="outline"
                                size="sm"
                            >
                                Batal
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default BulkPengumuman