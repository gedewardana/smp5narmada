'use client'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Printer, FileText, Download, ChevronDown, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useJadwal } from '@/hooks/useJadwal'
import { Card, CardContent } from '@/components/ui/card'

function FilterJadwal({ onOpenModal, filters, setFilters }) {
    // Dropdown Export

    const dropdownRef = useRef(null)

    // Dropdown Tahun
    const [showTahun, setShowTahun] = useState(false);
    const dropdownTahunRef = useRef(null)
    const [selectedYear, setSelectedYear] = useState(null);

    // Ambil data dari API
    const { data: jadwalRaw } = useJadwal()
    
    // Ekstrak tahun_ajaran yang unik dari database
    const tahunOptions = useMemo(() => {
        if (!jadwalRaw) return []
        const uniqueYears = [...new Set(jadwalRaw.map(item => item.tahun_ajaran))]
        return uniqueYears.sort((a, b) => b.localeCompare(a)) // Urutkan terbaru ke terlama
    }, [jadwalRaw])

    // Auto close kalau klik di luar
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                // setShowExport(false) // Uncomment jika fitur export digunakan
            }
            if (dropdownTahunRef.current && !dropdownTahunRef.current.contains(event.target)) {
                setShowTahun(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <Card className="border-0 bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-100 mb-4">
            <CardContent className="p-4 lg:p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* FILTER AREA */}
                    <div className="flex items-center gap-3 w-full md:w-auto">

                        {/* FILTER TAHUN */}
                        <div className="relative flex-1 lg:flex-none">
                            <select 
                                name="tahun" 
                                value={filters?.tahun_ajaran || ""}
                                onChange={(e) => setFilters(prev => ({ ...prev, tahun_ajaran: e.target.value }))}
                                className="appearance-none w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer outline-none transition-all"
                            >
                                <option value="">Semua Tahun</option>
                                {tahunOptions.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>

                        {/*button reset*/}
                        <Button
                            onClick={() => setFilters({ tahun_ajaran: "" })}
                            variant="outline"
                            className="h-10"
                        >
                            Reset
                        </Button>
                    </div>

                    {/* print dan export */}
                    <div className="flex w-full md:w-auto items-center gap-3" >
                        <Button
                            variant="default"
                            size="lg"
                            onClick={onOpenModal}>
                            <Plus className="w-4 h-4" />
                            <span className="font-bold text-sm">Tambah Jadwal</span>
                        </Button>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}

export default FilterJadwal