'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ListPendaftaran from '@/components/ui-admin/verifikasi-pendaftaran/ListPendaftaran'
import ModalVerifikasi from '@/components/ui-admin/verifikasi-pendaftaran/ModalVerifikasi'
import FilterPendaftaran from '@/components/ui-admin/FilterPendaftaran/FilterPendaftaran'
import CardSummaryPendaftaran from '@/components/ui-admin/verifikasi-pendaftaran/CardSummaryPendaftaran'
import { usePendaftaran } from '@/hooks/usePendaftaran'
import { useJadwal } from '@/hooks/useJadwal'
import { useDashboardData } from '@/hooks/useDashboardData'


function KelolaPendaftaranContent() {
    // 1. Simpan state untuk filter & paginasi
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status_verifikasi: '', 
    })

    // 2. Ambil data master Jadwal (Tahun Ajaran) untuk dropdown
    const { data: jadwalRaw } = useJadwal()
    
    // Format data jadwal agar sesuai dengan format dropdown { value, label }
    const tahunOptions = jadwalRaw?.map(j => ({
        value: j.id_jadwal,
        label: j.tahun_ajaran,
        isActive: j.is_active // Gunakan field is_active dari DB
    })) || []

    // 3. Fetch data pendaftaran menggunakan UseSWR
    const { data: pendaftaranData, isLoading, pagination, mutate } = usePendaftaran(filters)

    // Mutate untuk CardSummaryPendaftaran (useDashboardData)
    const { mutate: mutateDashboard } = useDashboardData()

    // Ekstrak jalur unik dari data yang sudah difetch
    const uniqueJalur = Array.from(new Set(pendaftaranData?.map(p => p.jalur_pendaftaran).filter(Boolean)))
    // Pastikan ZONASI selalu ada jika data masih kosong
    if (!uniqueJalur.includes('ZONASI')) {
        uniqueJalur.unshift('ZONASI')
    }

    const dynamicJalurOptions = [
        { value: '', label: 'Semua Jalur' },
        ...uniqueJalur.map(jalur => ({
            value: jalur,
            label: jalur.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
        }))
    ]
    
    const searchParams = useSearchParams()
    const router = useRouter()

    // Check URL params
    const modalType = searchParams.get('modal')
    const selectedId = searchParams.get('id')

    // 4. Ambil data asli dari list berdasarkan ID yang dipilih
    const selectedPendaftaran = selectedId
        ? pendaftaranData?.find(item => String(item.id_pendaftaran) === String(selectedId))
        : null

    const handleCloseModal = () => {
        router.push('/admin/dashboard/verifikasi-pendaftaran')
    }

    const handleVerifikasiSubmit = () => {
        mutate()          // refresh list pendaftaran
        mutateDashboard() // refresh card summary
    }

    const handleSelectPendaftaran = (pendaftaran) => {
        // Optional: Route to detail page
    }

    return (
        <div className=" min-h-screen relative ">
            {/* Modal Routing Logic */}
            {modalType === 'verifikasi' && selectedPendaftaran && (
                <ModalVerifikasi
                    pendaftaran={selectedPendaftaran}
                    onClose={handleCloseModal}
                    onSubmit={handleVerifikasiSubmit}
                />
            )}

            <CardSummaryPendaftaran />

            <div className=''>
                <FilterPendaftaran
                    onFilterChange={setFilters}
                    tahunOptions={tahunOptions} // Kirim data asli ke sini
                    jalurOptions={dynamicJalurOptions} // Kirim data dinamis dari usePendaftaran
                    onExport={() => alert('Export clicked')}
                />
            </div>

            <ListPendaftaran
                pendaftaranData={pendaftaranData}
                isLoading={isLoading}
                onSelectPendaftaran={handleSelectPendaftaran}
            />
        </div>

    )
}

function KelolaPendaftaranPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <KelolaPendaftaranContent />
        </Suspense>
    )
}

export default KelolaPendaftaranPage
