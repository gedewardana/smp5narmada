'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ListDaftarUlang from '@/components/ui-admin/verifikasi-daftar-ulang/ListDaftarUlang'
import ModalVerifikasi from '@/components/ui-admin/verifikasi-daftar-ulang/ModalVerifikasi'
// import FilterPendaftaran from '@/components/ui-admin/FilterPendaftaran/FilterPendaftaran'
import CardSumaryDaftarUlang from '@/components/ui-admin/verifikasi-daftar-ulang/CardSumaryDaftarUlang'

// Import SWR Hooks berarsitektur Clean Code
import { useDaftarUlang } from '@/hooks/useDaftarUlang'
import { useUpdateDaftarUlang } from '@/hooks/useUpdateDaftarUlang'
import { useJadwal } from '@/hooks/useJadwal'
import { useDashboardData } from '@/hooks/useDashboardData'
import FilterPendaftaran from '@/components/ui-admin/FilterPendaftaran/FilterPendaftaran'

export default function VerifikasiDaftarUlangPage() {
    const router = useRouter()
    
    // UI States: Mengendalikan komponen filter pencarian dan paginasi
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: '',
        status_daftar_ulang: '',
    })
    
    // Ambil data master Jadwal (Tahun Ajaran) untuk dropdown
    const { data: jadwalRaw } = useJadwal()
    const tahunOptions = jadwalRaw?.map(j => ({
        value: j.id_jadwal,
        label: j.tahun_ajaran,
        isActive: j.is_active
    })) || []

    // Modal States: Mengendalikan Pop-Up Data Berkas
    const [selectedItem, setSelectedItem] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // GET Request: Ambil data secara Real-Time dengan SWR
    const { data: dataDaftarUlang, isLoading, pagination, mutate } = useDaftarUlang(filters)

    // GET Request: Untuk sinkronisasi data statistik Dashboard
    const { mutate: mutateDashboard } = useDashboardData()

    // PUT Request: Fungsi injeksi perbaruan ke Database
    const { updateStatus, isUpdating } = useUpdateDaftarUlang()

    // ─────────────────────────────────────────────
    // Handlers
    // ─────────────────────────────────────────────
    
    const handleSelectDaftarUlang = (item) => {
        setSelectedItem(item)
        setIsModalOpen(true) // Ganti metode kuno navigasi URL param dengan State UI Murni
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedItem(null)
    }

    // Aksi tombol simpan ketika merubah verifikasi melalui Modal
    const handleVerifikasiSubmit = async (formData) => {
        try {
            await updateStatus({
                id_daftar_ulang: selectedItem.id_daftar_ulang,
                status_daftar_ulang: formData.status_daftar_ulang
                // payload lainnya bisa ditambah di sini
            })
            mutate() // Refresh data UI secara otomatis tanpa F5
            mutateDashboard() // Refresh CardSummary
            handleCloseModal()
        } catch (error) {
            // Error ditangani oleh toast di hook
        }
    }

    // Aksi instan ketika merubah status via tombol tabel "Quick Action"
    const handleUpdateStatusQuick = async (id, status) => {
        try {
            await updateStatus({
                id_daftar_ulang: id,
                status_daftar_ulang: status
            })
            mutate()
            mutateDashboard() // Refresh CardSummary
        } catch (error) {
            // Error ditangani oleh toast di hook
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            
            {/* Komponen Modal Verifikasi Terdalam */}
            {isModalOpen && selectedItem && (
                <ModalVerifikasi
                    daftarUlang={selectedItem}
                    onClose={handleCloseModal}
                    onSubmit={handleVerifikasiSubmit}
                />
            )}

            {/* Komponen Dasbor Kuota Pendaftaran Ulang */}
            <CardSumaryDaftarUlang />
            
            {/* Komponen Filter Tabel */}
            <div className=''>
                <FilterPendaftaran 
                    onFilterChange={(newFilters) => {
                        // Mapping keys dari FilterPendaftaran ke parameter yang dipahami API Daftar Ulang
                        setFilters(prev => ({
                            ...prev,
                            ...newFilters,
                            status_daftar_ulang: newFilters.status_verifikasi, // Map status_verifikasi ke status_daftar_ulang
                            page: 1 // Reset ke halaman 1 saat filter berubah
                        }))
                    }}
                    statusOptions={[
                        { value: '', label: 'Semua Status', color: 'bg-gray-100 text-gray-700' },
                        { value: 'BELUM', label: 'Belum', color: 'bg-amber-100 text-amber-700' },
                        { value: 'SUDAH', label: 'Sudah', color: 'bg-emerald-100 text-emerald-700' },
                        { value: 'MENGUNDURKAN_DIRI', label: 'Mengundurkan Diri', color: 'bg-rose-100 text-rose-700' }
                    ]}
                    tahunOptions={tahunOptions}
                />
            </div>

            {/* Data Tabel Terpusat */}
            <ListDaftarUlang
                pendaftaranUlangData={dataDaftarUlang}
                isLoading={isLoading}
                onSelectDaftarUlang={handleSelectDaftarUlang}
                onUpdateStatus={handleUpdateStatusQuick}
            />
        </div>
    )
}
