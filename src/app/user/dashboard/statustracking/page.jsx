'use client'

import { useState } from 'react'
// import StatusSummaryCard from '@/components/ui-user/status-tracking/StatusSummaryCard'
import ProgressStepper from '@/components/ui-user/dashboard/ProgressStepper'
// import StatusDetailPanel from '@/components/ui-user/status-tracking/StatusDetailPanel'
// import LisKelengkapanFormulir from '@/components/ui-user/status-tracking/LisKelengkapanFormulir'



export default function StatusTrackingPage() {
    // Dummy data - nanti fetch dari API
    const [uploadedFiles] = useState([
        {
            id: 1,
            jenis_berkas: 'PASFOTO',
            nama_file: 'pasfoto.jpg',
            status_verifikasi: 'SUDAH_DIUNGGAH',
            diunggah_pada: '2024-01-08T14:30:00',
            catatan_verifikasi: null
        },
        {
            id: 2,
            jenis_berkas: 'AKTA',
            nama_file: 'akta.pdf',
            status_verifikasi: 'SUDAH_DIUNGGAH',
            diunggah_pada: '2024-01-08T14:30:00',
            catatan_verifikasi: null
        },
        {
            id: 3,
            jenis_berkas: 'KK',
            nama_file: 'kk.pdf',
            status_verifikasi: 'BELUM_DIUNGGAH',
            diunggah_pada: '2024-01-08T14:30:00',
            catatan_verifikasi: 'Harap mengunggah ulang dengan format PDF'
        }
    ])

    const [kelengkapanFormulir] = useState({
        identitas: 'COMPLETED',
        ayah: 'COMPLETED',
        ibu: 'EMPTY',
        wali: 'EMPTY',     // Opsional
        periodik: 'EMPTY',
        prestasi: 'EMPTY'  // Opsional
    })

    const [pendaftaran] = useState({
        id_pendaftaran: 1,
        nomor_pendaftaran: 'PMB-2024-001',
        status_pendaftaran: 'MENUNGGU_VERIFIKASI',
        tahap_pendaftaran: 'VERIFIKASI_PANITIA',
        tahun_pelajaran: '2024/2025',
        tanggal_mulai: '2024-01-05T10:00:00',
        tanggal_submit: '2024-01-08T14:30:00',
        tanggal_verifikasi: null,
        catatan_panitia: null
    })

    const [kelengkapanBerkas] = useState({
        identitas: true,
        ayah: true,
        ibu: true,
        wali: false,
        periodik: true,
        prestasi: false,
        berkas_mandatory: true,
        berkas_optional: false,
        berkas_detail: {
            mandatory_uploaded: 6,
            mandatory_total: 6,
            optional_uploaded: 1,
            optional_total: 4
        }
    })

    return (
        <div className="space-y-6 px-8 pb-8">
            <h1 className="text-3xl font-bold text-gray-800">Status & Tracking Pendaftaran</h1>


            {/* Summary Card */}
            {/* <StatusSummaryCard pendaftaran={pendaftaran} /> */}




            {/* Status Detail */}
            {/* <StatusDetailPanel pendaftaran={pendaftaran} /> */}



            {/* Left Column - Timeline (1/3 width) */}
            <div className=''>
                <ProgressStepper tahapSekarang={pendaftaran.tahap_pendaftaran} />

            </div>
            <div className=''>
                {/* <LisKelengkapanFormulir formsStatus={kelengkapanFormulir} /> */}
            </div>
        </div>
    )
}