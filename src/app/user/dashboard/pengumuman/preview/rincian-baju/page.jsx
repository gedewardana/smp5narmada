'use client'

import TemplateRincianBaju from '@/components/ui-user/pengumuman/TemplateRincianBaju'
import Wrapper from '@/components/ui-user/layout/Wrapper'
import { useRouter } from 'next/navigation'
import { useReactToPrint } from 'react-to-print'
import { useRef } from 'react'
import { Shirt } from 'lucide-react'
import DownloadCetakRincianBaju from '@/components/ui-user/pengumuman/DownloadCetakRincianBaju'

export default function RincianBajuPage() {
    const router = useRouter()
    const componentRef = useRef()
    const handleClose = () => {
        router.push('/user/dashboard/pengumuman')
    }
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Surat-Pernyataan-Siswa-${new Date().toISOString().split('T')[0]}`,
    })
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
                        <Shirt className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Rincian Baju Seragam</h1>
                        <p className="text-gray-600">Rincian baju seragam SMP Negeri 5 Narmada.</p>
                    </div>
                </div>

            </div>


            <div className='justify-end flex pr-8 pt-8'>
                <DownloadCetakRincianBaju onPrint={handlePrint} />
            </div>

            {/* Info */}
            <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded ml-8 mr-8 mt-4 ">
                <p className="text-sm text-blue-800">
                    <strong>Informasi:</strong> Rincian baju seragam ini dapat disesuikan saat pendaftaran ulang pada tanggal<strong>01 Juli 2025</strong> di SMP Negeri 5 Narmada.
                </p>
            </div>

            <div className=''>
                <Wrapper>
                    <div ref={componentRef} className="print-container">
                        <TemplateRincianBaju />
                    </div>
                </Wrapper>
            </div>
        </div>
    )
}
