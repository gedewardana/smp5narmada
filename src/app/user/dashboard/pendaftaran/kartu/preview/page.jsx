'use client'

import { useRouter } from 'next/navigation'
import React, { useState, useRef } from 'react'
import '@/components/ui-user/kartu/Print.css'
import { useReactToPrint } from 'react-to-print'
import KartuPreview from '@/components/ui-user/kartu/KartuPreview'
import DownloadPdf from '@/components/ui-user/kartu/DownloadPdf'
import { IdCard, X, Printer } from 'lucide-react'
import ButtonReusable from '@/components/buttonreasuble/ButtonReasuble'
import Wrapper from '@/components/ui-user/layout/Wrapper'
import { useUserDashboard } from '@/hooks/useUserDashboard'

export default function KartuPreviewPage() {
    const { data: dashboardData, isLoading } = useUserDashboard()

    // Mapping data pendaftaran ke format kartu secara dinamis
    const kartuData = {
        nomor_pendaftaran: dashboardData?.nomor_pendaftaran || '-',
        nama_lengkap: dashboardData?.nama_lengkap || '-',
        asal_sekolah: dashboardData?.nama_sekolah || '-',
        nilai_skhu: dashboardData?.nilai_skhu || '-',
        tanggal_verifikasi: dashboardData?.raw?.tanggal_verifikasi 
            ? new Date(dashboardData.raw.tanggal_verifikasi).toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            })
            : '-'
    }

    const isPendaftaranSubmitted = dashboardData?.raw?.status_pendaftaran === 'SUBMITTED'
    const componentRef = useRef()

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Kartu-Pendaftaran-${new Date().toISOString().split('T')[0]}`,
    })

    // Dummy Progress Status untuk Checklist di Empty State
    const [progressStatus] = useState({
        formulir: true,      // Step 1: Completed
        berkas: false,        // Step 2: Completed
        submitted: false,    // Step 3: Pending
        verifikasi: false    // Step 4: Pending
    })

    const router = useRouter()
    const handleClose = () => {
        router.push('/user/dashboard/pendaftaran')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">Menyiapkan kartu pendaftaran...</p>
                </div>
            </div>
        )
    }

    // Jika belum submit, beri peringatan atau redirect
    if (!isPendaftaranSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto">
                        <IdCard className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">Pendaftaran Belum Dikirim</h2>
                        <p className="text-gray-500 text-sm">
                            Anda belum menyelesaikan proses pendaftaran. Silakan selesaikan dan kirim pendaftaran Anda untuk mencetak kartu.
                        </p>
                    </div>
                    <ButtonReusable onClick={() => router.push('/user/dashboard/pendaftaran')} variant="primary" className="w-full">
                        Ke Halaman Pendaftaran
                    </ButtonReusable>
                </div>
            </div>
        )
    }

    // Jika sudah submit, tampilkan kartu
    return (
        <div >
            {/* close */}

            <button
                onClick={handleClose}
                className="btn-close-global"
            >
                ✕
            </button>


            <div className="mb-6 ml-8 mr-8 mt-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <IdCard className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Kartu Pendaftaran</h1>
                </div>
                <p className="text-gray-600">Kartu tanda bukti pendaftaran.</p>
            </div>



            <div className="flex items-center justify-end mb-4">
                {/* Action Buttons */}
                <div className="flex items-center gap-4 ml-8 mr-8">
                    {/* <Print data={kartuData} /> */}
                    <DownloadPdf data={kartuData} />

                    <ButtonReusable
                        onClick={handlePrint}
                        variant="primary"
                        size="sm"

                    >
                        <Printer className="w-4 h-4 mr-2" />
                        Cetak
                    </ButtonReusable>
                </div>


            </div>

            {/* Info */}
            <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded ml-8 mr-8 mt-4 ">
                <p className="text-sm text-blue-800">
                    <strong>Informasi:</strong> Kartu pendaftaran ini harap disimpan sebagai bukti pendaftaran. Pengumuman akan diumumkan pada tanggal <strong>01 Juli 2025</strong>.
                </p>
            </div>

            {/* <Wrapper className="print:hidden"> */}
                <div ref={componentRef} className="print-container">
                    <KartuPreview data={kartuData} />
                </div>


         

        </div>
    )
}