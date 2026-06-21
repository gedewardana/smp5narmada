'use client'

import React, { useState, useCallback } from 'react'
import ListJadwal from '@/components/ui-admin/kelola-jadwal-pmb/ListJadwal'
import FilterJadwal from '@/components/ui-admin/kelola-jadwal-pmb/FilterJadwal'
import FormModalJadwal from '@/components/ui-admin/kelola-jadwal-pmb/FormModalJadwal'
import CardSummaryJadwal from '@/components/ui-admin/kelola-jadwal-pmb/CardSummaryJadwal'
import ModalDetailJadwal from '@/components/ui-admin/kelola-jadwal-pmb/ModalDetailJadwal'
import { useJadwal } from '@/hooks/useJadwal'
import Swal from 'sweetalert2'

export default function Page() {
    // null = modal tutup, {} = tambah, {...jadwal} = edit
    const [modalData, setModalData] = useState(null)
    const [detailId, setDetailId] = useState(null)
    const [filters, setFilters] = useState({ tahun_ajaran: "" })

    // Gunakan custom hooks useJadwal (SWR)
    const { data, summary, isLoading, error, mutate, createJadwal, updateJadwal, deleteJadwal } = useJadwal(filters)

    // mode tambah
    const handleOpenCreate = () => setModalData({})
    // mode edit, jadwal = objek lengkap
    const handleOpenEdit = (jadwal) => setModalData(jadwal)
    // tutup modal
    const handleClose = () => setModalData(null)
    // mode detail
    const handleOpenDetail = (id) => setDetailId(id)
    const handleCloseDetail = () => setDetailId(null)
    // handle submit (create & update) — semua API call ada di useJadwal
    const handleSubmit = useCallback(async (formData) => {
        const isEdit = !!modalData?.id_jadwal

        if (isEdit) {
            await updateJadwal(modalData.id_jadwal, formData)
        } else {
            await createJadwal(formData)
        }

        setModalData(null)
    }, [modalData, createJadwal, updateJadwal])

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Hapus Jadwal?',
            text: "Jadwal yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await deleteJadwal(id)
                import('react-hot-toast').then(({ toast }) => {
                    toast.success("Jadwal berhasil dihapus!")
                })
            } catch (err) {
                import('react-hot-toast').then(({ toast }) => {
                    toast.error(err.message || "Gagal menghapus jadwal")
                })
            }
        }
    }

    return (
        <div className="animate-in fade-in duration-700">
            {/* 🎯 Summary Cards Section — Sinkron dengan API */}
            <CardSummaryJadwal 
                summary={summary}
                isLoading={isLoading} 
            />

            {/* Filter + Tombol Tambah */}
            <div className="mb-6">
                <FilterJadwal 
                    onOpenModal={handleOpenCreate} 
                    filters={filters}
                    setFilters={setFilters}
                />
            </div>

            {/* Tabel — React SWR Cache otomatis akan handle pembaruan data */}
            <ListJadwal
                data={data}
                loading={isLoading}
                error={error}
                onEdit={handleOpenEdit} 
                onDelete={handleDelete}
                onDetail={handleOpenDetail}
            />

            {/* Modal Form */}
            {modalData !== null && (
                <FormModalJadwal
                    selectedJadwal={Object.keys(modalData).length > 0 ? modalData : null}
                    onClose={handleClose}
                    onSubmit={handleSubmit}
                />
            )}

            {/* Modal Detail */}
            {detailId !== null && (
                <ModalDetailJadwal
                    jadwalId={detailId}
                    onClose={handleCloseDetail}
                    onEdit={handleOpenEdit}
                />
            )}
        </div>
    )
}