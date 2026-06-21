'use client'
import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import FilterHarianPMB from '@/components/ui-admin/filterreport/FilterHarianPMB'
import ListReport from '@/components/ui-admin/reports/ListReport'
import { BarChart3, FileText } from 'lucide-react'
import '@/components/ui-admin/reports/Print.css'
import Header from '@/components/ui-admin/reports/Header'
import { usePendaftaran } from '@/hooks/usePendaftaran'
import { useJadwal } from '@/hooks/useJadwal'
import { useState, useEffect } from 'react'



export default function Page() {
    const [selectedYear, setSelectedYear] = useState("")

    // 1. Fetch data master jadwal untuk filter
    const { data: jadwalRaw } = useJadwal()

    // 2. Format opsi tahun
    const tahunOptions = [
        { value: "", label: "Pilih Tahun" },
        ...(jadwalRaw?.map(j => ({
            value: j.id_jadwal,
            label: j.tahun_ajaran,
        })) || [])
    ]

    // 3. Set default year
    useEffect(() => {
        if (jadwalRaw?.length > 0 && selectedYear === "") {
            const activeTahun = jadwalRaw.find(j => j.is_active)?.id_jadwal || jadwalRaw[0].id_jadwal
            setSelectedYear(activeTahun)
        }
    }, [jadwalRaw, selectedYear])

    // 4. Fetch data pendaftaran
    const { data: rawData, isLoading } = usePendaftaran({
        tahun_ajaran: selectedYear,
        status_pendaftaran: "SUBMITTED",
        limit: 2000 // Ambil banyak untuk laporan cetak
    })

    // Transformasi data agar sesuai dengan komponen ListReport
    const dataSiswa = rawData.map(item => ({
        no_pendaftaran: item.nomor_pendaftaran || '-',
        nama: item.identitas_peserta_didik?.nama_lengkap || item.nama_lengkap,
        alamat: item.identitas_peserta_didik?.alamat_tempat_tinggal || '-',
        prestasi: item.identitas_peserta_didik?.prestasi?.length > 0 
            ? {
                nama: item.identitas_peserta_didik.prestasi[0].nama_prestasi,
                file: item.identitas_peserta_didik.prestasi[0].bukti_prestasi
              }
            : '-'
    }))


    const componentRef = useRef()

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Laporan-PMB-SMPN5-Narmada-${new Date().toISOString().split('T')[0]}`,
    })

    const handleReset = () => {
        const activeTahun = jadwalRaw?.find(j => j.is_active)?.id_jadwal || jadwalRaw?.[0]?.id_jadwal || ""
        setSelectedYear(activeTahun)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}


            {/* Summary Report */}
            <div className="print:hidden">
                <FilterHarianPMB 
                    onPrint={handlePrint} 
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                    tahunOptions={tahunOptions}
                    onReset={handleReset}
                    showExcel={false}
                    showPDF={false}
                />
            </div>

            {/* Component to Print */}
            {/* <Wrapper className="print:hidden"> */}

            <div className='mt-6'>
                {/* <Bungkus> */}
                <div ref={componentRef} className="print-container">
                    {/* Header hanya muncul saat print */}
                    <div className="hidden print:block">
                        <Header
                            tahunAjaran={jadwalRaw?.find(j => j.id_jadwal == selectedYear)?.tahun_ajaran}
                        />
                    </div>
                    <div className=''>

                        <ListReport
                            dataSiswa={dataSiswa}
                        />
                    </div>
                </div>
                {/* </Bungkus> */}
            </div>
            {/* </Wrapper> */}
        </div>
    )
}
