'use client'

import React, { useState, useEffect } from 'react'
import {
    Search,
    Filter,
    X,
    Calendar,
    ChevronDown,
    Download,
    RefreshCw,
    SlidersHorizontal
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function FilterPendaftaran({ 
    onFilterChange, 
    onExport,
    statusOptions: statusOptionsProp, // Opsi status kustom
    tahunOptions: tahunOptionsProp, // Terima dari props
    jalurOptions: jalurOptionsProp  // Terima dari props
}) {
    // Mencari tahun default untuk baseline perbandingan (bukan untuk initial state)
    const defaultTahun = tahunOptionsProp?.find(t => t.isActive)?.value || tahunOptionsProp?.[0]?.value || ''

    const [filters, setFilters] = useState({
        search: '',
        status_verifikasi: '',
        tahun_ajaran: '', // Kosongkan agar bisa diisi oleh useEffect secara cerdas
        jalur_pendaftaran: 'ZONASI',
        dateFrom: '',
        dateTo: '',
        urutan: 'terbaru'
    })

    // Sinkronisasi tahun ajaran jika data tahunOptionsProp berubah (misal baru selesai loading)
    // Sinkronisasi tahun ajaran jika data tahunOptionsProp berubah (misal baru selesai loading)
    useEffect(() => {
        if (tahunOptionsProp?.length > 0 && filters.tahun_ajaran === '') {
            // Cari tahun yang isActive=true, jika tidak ada baru ambil yang pertama
            const activeTahun = tahunOptionsProp.find(t => t.isActive)?.value || tahunOptionsProp[0].value
            const newFilters = { ...filters, tahun_ajaran: activeTahun }
            setFilters(newFilters)
            
            // Beritahu parent tentang perubahan filter awal ini
            onFilterChange?.(newFilters)
        }
    }, [tahunOptionsProp])

    const [showAdvanced, setShowAdvanced] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    // Opsi Status: Gunakan dari props atau default pendaftaran
    const statusOptions = statusOptionsProp || [
        { value: '', label: 'Semua Status', color: 'bg-gray-100 text-gray-700' },
        { value: 'MENUNGGU_VERIFIKASI', label: 'Menunggu', color: 'bg-amber-100 text-amber-700' },
        { value: 'VERIFIKASI', label: 'Diverifikasi', color: 'bg-emerald-100 text-emerald-700' },
        { value: 'PERLU_PERBAIKAN', label: 'Perlu Perbaikan', color: 'bg-orange-100 text-orange-700' },
        { value: 'TOLAK', label: 'Ditolak', color: 'bg-rose-100 text-rose-700' }
    ]

    // Gunakan jalur dari props atau default
    const jalurOptions = jalurOptionsProp || [
        // { value: 'SEMUA JALUR', label: 'Semua Jalur' },
        { value: 'ZONASI', label: 'Zonasi' },
    ]

    // Gunakan tahun dari props atau default
    const tahunOptions = tahunOptionsProp || [
        { value: '2025/2026', label: '2025/2026' },
        { value: '2024/2025', label: '2024/2025' }
    ]

    const handleChange = (key, value) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        onFilterChange?.(newFilters)
    }

    const handleClear = () => {
        const defaultFilters = {
            search: '',
            status_verifikasi: '',
            tahun_ajaran: defaultTahun,
            jalur_pendaftaran: 'ZONASI',
            dateFrom: '',
            dateTo: '',
            urutan: 'terbaru'
        }
        setFilters(defaultFilters)
        onFilterChange?.(defaultFilters)
    }

    const handleClearDates = () => {
        const newFilters = { ...filters, dateFrom: '', dateTo: '' }
        setFilters(newFilters)
        onFilterChange?.(newFilters)
    }

    const activeCount = Object.entries(filters).filter(([key, val]) => {
        if (key === 'tahun_ajaran' && String(val) === String(defaultTahun)) return false
        if (key === 'urutan' && val === 'terbaru') return false
        if (key === 'jalur_pendaftaran' && val === 'ZONASI') return false
        return val !== ''
    }).length

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
            {/* Main Filter Bar */}
            <div className="p-4 lg:p-5">
                <div className="flex flex-col lg:flex-row gap-4">

                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nama atau No. Pendaftaran"
                            value={filters.search}
                            onChange={(e) => handleChange('search', e.target.value)}
                            className="w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        {filters.search && (
                            <button
                                onClick={() => handleChange('search', '')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        )}
                    </div>

                    {/* Quick Filters */}
                    <div className="flex flex-wrap gap-2">
                        {/* Status Dropdown */}
                        <div className="relative">
                            <select
                                value={filters.status_verifikasi}
                                onChange={(e) => handleChange('status_verifikasi', e.target.value)}
                                className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer min-w-[140px]"
                            >
                                <option value="" disabled>Pilih Status</option>
                                {statusOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Tahun Dropdown */}
                        <div className="relative">
                            <select
                                value={filters.tahun_ajaran}
                                onChange={(e) => handleChange('tahun_ajaran', e.target.value)}
                                className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                            >
                                <option value="" disabled>Pilih Tahun</option>
                                {tahunOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        

                        {/* Advanced Toggle */}
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${showAdvanced
                                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                                }`}
                        >
                            <SlidersHorizontal className="w-4 h-4" />

                            {activeCount > 0 && (
                                <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                                    {activeCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
                {showAdvanced && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-100 bg-gray-50/50"
                    >
                        <div className="p-4 lg:p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                                {/* Jalur Pendaftaran */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Jalur Pendaftaran
                                    </label>
                                    <select
                                        value={filters.jalur_pendaftaran}
                                        onChange={(e) => handleChange('jalur_pendaftaran', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="" disabled>Pilih Jalur</option>
                                        {jalurOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Dari Tanggal */}
                                {/* <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Dari Tanggal
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="date"
                                            value={filters.dateFrom}
                                            onChange={(e) => handleChange('dateFrom', e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div> */}

                                {/* Sampai Tanggal */}
                                {/* <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Sampai Tanggal
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="date"
                                            value={filters.dateTo}
                                            onChange={(e) => handleChange('dateTo', e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div> */}

                                {/* <Button
                                    className='mt-6'
                                    variant='outline'
                                    onClick={handleClearDates}
                                >
                                    Clear Tanggal
                                </Button> */}
                            </div>

                            {/* Reset Button */}
                            <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                                <button
                                    onClick={handleClear}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Reset Semua Filter
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}