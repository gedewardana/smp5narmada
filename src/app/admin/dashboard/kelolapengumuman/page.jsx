'use client'
import React, { useState } from 'react'
import ListPengumuman from '@/components/ui-admin/kelola-pengumuman/ListPengumuman'
import CardPengumuman from '@/components/ui-admin/kelola-pengumuman/CardPengumuman'
// import FilterPendaftaran from '@/components/ui-admin/FilterPendaftaran/FilterPendaftaran'
import { Megaphone, CheckSquare } from 'lucide-react'
import FormModalPengumuman from '@/components/ui-admin/kelola-pengumuman/FormModalPengumuman'
import { Button } from '@/components/ui/button'
import BulkPengumuman from '@/components/ui-admin/kelola-pengumuman/BulkPengumuman'
import { usePengumuman } from '@/hooks/usePengumuman'
import { useUpdateSeleksi } from '@/hooks/useUpdateSeleksi'
import { useJadwal } from '@/hooks/useJadwal'
import { useDashboardData } from '@/hooks/useDashboardData'
import FilterPendaftaran from '@/components/ui-admin/FilterPendaftaran/FilterPendaftaran'
import ModalDetail from '@/components/ui-admin/kelola-pengumuman/ModalDetail'


export default function Page() {
    const [isBulkPengumumanModalOpen, setIsBulkPengumumanModalOpen] = useState(false)
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: '',
        pengumuman_hasil_seleksi: '',
    })

    // Ambil data master Jadwal (Tahun Ajaran) untuk dropdown
    const { data: jadwalRaw } = useJadwal()
    const tahunOptions = jadwalRaw?.map(j => ({
        value: j.id_jadwal,
        label: j.tahun_ajaran,
        isActive: j.is_active
    })) || []

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState(null)

    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false)
    const [viewItem, setViewItem] = useState(null)

    // State for bulk selection in table
    const [rowSelection, setRowSelection] = useState({})

    // Konversi object { "id1": true, "id2": true } ke array [id1, id2]
    const selectedBulkIds = React.useMemo(() => {
        return Object.keys(rowSelection).map(Number)
    }, [rowSelection])

    // Execute SWR Data Fetching
    const { data: dataPengumuman, isLoading, pagination, mutate } = usePengumuman(filters)

    // Execute SWR Data Fetching for Dashboard Sync
    const { mutate: mutateDashboard } = useDashboardData()

    // Execute SWR Mutation (Update API)
    const { updateSeleksi, updateSeleksiMassal, isUpdating } = useUpdateSeleksi()

    const handleEdit = (item) => {
        setEditingItem(item)
        setIsModalOpen(true)
    }

    const handleViewDetail = (item) => {
        setViewItem(item)
        setIsModalDetailOpen(true)
    }

    const handleBulkModeClick = () => {
        setIsBulkPengumumanModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingItem(null)
    }

    const handleCloseBulkPengumumanModal = () => {
        setIsBulkPengumumanModalOpen(false)
    }

    const handleBulkSubmit = async ({ id_pengumuman_list, pengumuman_hasil_seleksi, catatan }) => {
        try {
            await updateSeleksiMassal({ id_pengumuman_list, pengumuman_hasil_seleksi, catatan })
            handleCloseBulkPengumumanModal()
            setRowSelection({}) // Reset selection after success
            mutate() // Refresh tabel
            mutateDashboard() // Refresh CardSummary
        } catch (err) {
            // Toast error sudah ditangani di dalam hook
        }
    }

    const handleSave = async (formData) => {
        try {
            await updateSeleksi(formData); // Tembak database via Api
            mutate(); // Revalidate tabel SWR secara real-time
            mutateDashboard(); // Refresh CardSummary
            handleCloseModal();
        } catch (err) {
            alert(err.message) // Handle alert error
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* ... Header, Card, Filter ... */}

            {/* Header */}


            {/* Statistics Cards */}
            <CardPengumuman />

            <div className='flex justify-end pb-4'>
                <Button
                    variant="default"
                    size="sm"
                    onClick={handleBulkModeClick}
                >
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Bulk Pengumuman
                </Button>
            </div>



            <BulkPengumuman
                isOpen={isBulkPengumumanModalOpen}
                mode="INPUT"
                students={dataPengumuman}
                onClose={handleCloseBulkPengumumanModal}
                onSubmit={handleBulkSubmit}
                isUpdating={isUpdating}
                initialSelectedIds={selectedBulkIds}
            />

            {/* Modal Form (Individual) */}
            {isModalOpen && (
                <FormModalPengumuman
                    initialData={editingItem}
                    onClose={handleCloseModal}
                    onSubmit={handleSave}
                />
            )}

            {isModalDetailOpen && (
                <ModalDetail
                    isOpen={isModalDetailOpen}
                    initialData={viewItem}
                    onClose={() => setIsModalDetailOpen(false)}
                    onSelectItem={(item) => {
                        setIsModalDetailOpen(false)
                        handleEdit(item)
                    }}
                />
            )}

            {/* Filter */}
            <div className=''>
                <FilterPendaftaran
                    onFilterChange={(newFilters) => {
                        setFilters(prev => ({
                            ...prev,
                            ...newFilters,
                            pengumuman_hasil_seleksi: newFilters.status_verifikasi, // Map status_verifikasi ke pengumuman_hasil_seleksi
                            page: 1
                        }))
                    }}
                    statusOptions={[
                        { value: '', label: 'Semua Status', color: 'bg-gray-100 text-gray-700' },
                        { value: 'MENUNGGU_PENGUMUMAN', label: 'Menunggu', color: 'bg-amber-100 text-amber-700' },
                        { value: 'DITERIMA', label: 'Diterima', color: 'bg-emerald-100 text-emerald-700' },
                        { value: 'TIDAK_DITERIMA', label: 'Tidak Diterima', color: 'bg-rose-100 text-rose-700' }
                    ]}
                    tahunOptions={tahunOptions}
                    onExport={() => alert('Export clicked')}
                />
            </div>
            {/* List */}
            <ListPengumuman
                pengumumanList={dataPengumuman}
                onSelectItem={handleEdit}
                onViewDetail={handleViewDetail}
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
            />


        </div>
    )
}
