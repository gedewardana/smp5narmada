'use client'
import { useRouter } from 'next/navigation'
import { Printer, IdCard, FileText } from 'lucide-react'
import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import TemplateSuratTerima from '@/components/ui-user/pengumuman/TemplateSuratTerima'
import Wrapper from '@/components/ui-user/layout/Wrapper'
import DownloadCetakSuratTerima from '@/components/ui-user/pengumuman/DownloadCetakSuratTerima'
import { useUserDashboard } from '@/hooks/useUserDashboard'
import { usePengumumanID } from '@/hooks/usePengumumanID'
import { Loader2 } from 'lucide-react'


import '@/components/ui-user/pengumuman/Print.css'

export default function PreviewSuratTerimaPage() {

    const router = useRouter()
    const componentRef = useRef()
    const handleClose = () => {
        router.push('/user/dashboard/pengumuman')
    }

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Surat-Penerimaan-Siswa-${new Date().toISOString().split('T')[0]}`,
    })
    const { data: dashboard, isLoading: dashboardLoading } = useUserDashboard()
    const idPendaftaran = dashboard?.raw?.id_pendaftaran
    const isSubmitted = dashboard?.raw?.status_pendaftaran !== 'DRAFT' && dashboard?.raw?.status_pendaftaran !== 'BELUM_DAFTAR'

    const { pengumuman, isLoading: pengumumanLoading } = usePengumumanID(
        isSubmitted && idPendaftaran ? idPendaftaran : null, 
        'pendaftaran'
    )

    if (dashboardLoading || (isSubmitted && pengumumanLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Memuat Surat...</p>
                </div>
            </div>
        )
    }

    const suratData = {
        nomor_pendaftaran: dashboard?.nomor_pendaftaran || '-',
        nama_lengkap: dashboard?.nama_lengkap || '-',
        nama_sekolah: dashboard?.nama_sekolah || '-',
        pengumuman_hasil_seleksi: pengumuman?.pengumuman_hasil_seleksi || 'MENUNGGU_PENGUMUMAN',
        tahun_ajaran: dashboard?.tahun_ajaran || '-',
        tanggal_pengumuman: pengumuman?.diperbaharui_pada || new Date().toISOString()
    }

    return (
        <div className='min-h-screen bg-white p-0.5 md:p-1 relative shadow-lg'>
            <button
                title='Tutup'
                onClick={handleClose}
                className="btn-close-global"
            >
                ✕
            </button>


            <div className="mb-6 ml-8 mr-8 pt-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Surat Hasil Pengumuman PMB</h1>
                        <p className="text-gray-600 text-sm">Surat hasil pengumuman penerimaan murid baru.</p>
                    </div>
                </div>

            </div>


            <div className='justify-end flex pr-8 pt-8'>
                <DownloadCetakSuratTerima data={suratData} onPrint={handlePrint} />
            </div>

            {/* Info */}
            <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded ml-8 mr-8 mt-4 ">
                <p className="text-sm text-blue-800">
                    <strong>Informasi:</strong> Surat ini adalah bukti resmi hasil pengumuman PMB SMP Negeri 5 Narmada.
                </p>
            </div>

            <div className=''>
                <Wrapper>
                    <div ref={componentRef} className="print-container">
                        <TemplateSuratTerima data={suratData} />
                    </div>
                </Wrapper>
            </div>
        </div>
    )
}