'use client'
import React, { useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import DetailPendaftaran from '@/components/ui-admin/verifikasi-pendaftaran/DetailPendaftaran'
import Header from '@/components/ui-admin/verifikasi-pendaftaran/Header'
import ModalVerifikasi from '@/components/ui-admin/verifikasi-pendaftaran/ModalVerifikasi'
import Wrapper from '@/components/ui-admin/verifikasi-pendaftaran/Wrapper'
import { usePendaftaranID } from '@/hooks/usePendaftaranID'
import { useUpdateDaftarUlang } from '@/hooks/useUpdateDaftarUlang'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DetailPendaftaranPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const pendaftaranId = parseInt(params.id)
    const daftarUlangId = searchParams.get('daftarUlangId') ? parseInt(searchParams.get('daftarUlangId')) : null
    const isReadOnly = searchParams.get('readOnly') === 'true'

    const [activeTab, setActiveTab] = useState('identitas')
    const [showModalVerifikasi, setShowModalVerifikasi] = useState(false)

    // Fetch live data via SWR hook
    const { data: detailData, isLoading, error, mutate } = usePendaftaranID(pendaftaranId)

    // Hook untuk update status daftar ulang
    const { updateStatus } = useUpdateDaftarUlang()

    const handleStatusUpdate = async (newStatus) => {
        try {
            if (daftarUlangId) {
                await updateStatus({
                    id_daftar_ulang: daftarUlangId,
                    status_daftar_ulang: newStatus
                })
            } else {
                const res = await fetch(`/api/admin/verification/${pendaftaranId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status_verifikasi: newStatus })
                })
                if (!res.ok) throw new Error('Gagal memperbarui status')
                toast.success('Status Pendaftaran diperbarui!')
            }
            mutate()
        } catch (error) {
            toast.error(error.message)
        }
    }
    const handleVerifikasiSubmit = (data) => {
        // Modal Hook sudah handle PUT API. Di sini kita hanya refresh data form.
        mutate()
        setShowModalVerifikasi(false)
    }

    if (isLoading) {
        return (
            <div className="flex bg-white min-h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    if (error || !detailData) {
        return (
            <div className="flex bg-white min-h-screen items-center justify-center text-rose-500">
                <p>{error || 'Data Pendaftaran tidak ditemukan.'}</p>
            </div>
        )
    }

    return (
        <div className="fixed min-h-screen inset-0 bg-white z-50 overflow-auto ">

            <div className="bg-white rounded-lg w-full h-full flex flex-col">

                <Header
                    detailData={detailData}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onVerify={() => setShowModalVerifikasi(true)}
                    onStatusUpdate={handleStatusUpdate}
                    readOnly={isReadOnly}
                />

                <div className='p-6'>
                    <Wrapper>
                        <DetailPendaftaran
                            detailData={detailData}
                            activeTab={activeTab}
                            // logs={logs}
                        />
                    </Wrapper>
                </div>
            </div>

            {showModalVerifikasi && (
                <ModalVerifikasi
                    pendaftaran={detailData}
                    onClose={() => setShowModalVerifikasi(false)}
                    onSubmit={handleVerifikasiSubmit}
                />
            )}
        </div>
    )
}
