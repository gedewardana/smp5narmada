'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useReactToPrint } from 'react-to-print'
import DaftarHarianTable from '@/components/ui-admin/rekapandata/DaftarHarianTable'
import FilterHarianPMB from '@/components/ui-admin/filterreport/FilterHarianPMB'
import Wrapper from '@/components/ui-admin/rekapandata/Wrapper'
import CardDaftarHarian from '@/components/ui-admin/rekapandata/CardDaftarHarian'
import PrintRekap from '@/components/ui-admin/rekapandata/PrinRekap'
import { downloadPDF } from '@/utils/downloadPDF'
import { downloadExcel } from '@/utils/downloadExcel'
import { useJadwal } from '@/hooks/useJadwal'

import "@/components/ui-admin/rekapandata/Print.css"

function page() {
    const componentRef = useRef()
    
    // 1. State filter
    const [selectedYear, setSelectedYear] = useState("")

    // 2. Fetch data master jadwal
    const { data: jadwalRaw } = useJadwal()

    // 3. Format opsi tahun
    const dynamicTahunOptions = jadwalRaw?.map(j => ({
        value: j.id_jadwal,
        label: j.tahun_ajaran,
        isActive: j.is_active
    })) || []

    const tahunOptions = [
        { value: "", label: "Pilih Tahun" },
        ...dynamicTahunOptions
    ]

    // 4. Set default value ke tahun ajaran yang aktif
    useEffect(() => {
        if (jadwalRaw?.length > 0 && selectedYear === "") {
            const activeTahun = jadwalRaw.find(j => j.is_active)?.id_jadwal || jadwalRaw[0].id_jadwal
            setSelectedYear(activeTahun)
        }
    }, [jadwalRaw, selectedYear])

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        // documentTitle: `Laporan-PMB-SMPN5-Narmada-${new Date().toISOString().split('T')[0]}`,
    })

    const handleDownloadPDF = () => {
        downloadPDF(componentRef, `Laporan-Harian-PMB-${new Date().toISOString().split('T')[0]}.pdf`)
    }

     const handleExportExcel = () => {
        downloadExcel(componentRef, `Laporan-Harian-PMB-${new Date().toISOString().split('T')[0]}.xlsx`)
    }

    const handleReset = () => {
        const activeTahun = jadwalRaw?.find(j => j.is_active)?.id_jadwal || jadwalRaw?.[0]?.id_jadwal || ""
        setSelectedYear(activeTahun)
    }

    return (
        <div className=''>


            <CardDaftarHarian selectedYear={selectedYear} />
            <FilterHarianPMB 
                tahunOptions={tahunOptions}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
                onReset={handleReset}
                onPrint={handlePrint} 
                onPDF={handleDownloadPDF}
                onExcel={handleExportExcel}
            />



            {/* PrintRekap */}
                <div ref={componentRef} className="print-container  print-only">
                   <PrintRekap selectedYear={selectedYear}/>
                </div>


            {/* <Wrapper> */}
                <div >
                    <DaftarHarianTable selectedYear={selectedYear} />
                </div>
            {/* </Wrapper> */}

        </div>
    )
}

export default page