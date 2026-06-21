'use client'

import React from 'react'
import HasilCard from '@/components/ui-user/pengumuman/HasilCard'
import LangkahSelanjutnya from '@/components/ui-user/pengumuman/LangkahSelanjutnya'
import EmpetyPengumuman from '@/components/ui-user/pengumuman/EmpetyPengumuman'
import { useUserDashboard } from '@/hooks/useUserDashboard'
import { Loader2 } from 'lucide-react'
import { usePengumumanID } from '@/hooks/usePengumumanID'

export default function PengumumanPage() {
    const { data: dashboard, isLoading: dashboardLoading } = useUserDashboard()

    // Ambil ID Pendaftaran dari dashboard data
    const idPendaftaran = dashboard?.raw?.id_pendaftaran
    const isSubmitted = dashboard?.raw?.status_pendaftaran !== 'DRAFT' && dashboard?.raw?.status_pendaftaran !== 'BELUM_DAFTAR'

    // Fetch data pengumuman menggunakan hook khusus (Clean Code)
    const { pengumuman, isLoading: pengumumanLoading } = usePengumumanID(
        isSubmitted && idPendaftaran ? idPendaftaran : null, 
        'pendaftaran'
    )
    const hasReleased = pengumuman && pengumuman.hasil_pengumuman !== 'MENUNGGU_PENGUMUMAN'

    if (dashboardLoading || (isSubmitted && pengumumanLoading)) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Memuat Hasil Seleksi...</p>
                </div>
            </div>
        )
    }

    // Jika belum mendaftar, data tidak ditemukan, atau pengumuman belum dirilis (MENUNGGU_PENGUMUMAN)
    if (!isSubmitted || !pengumuman || !hasReleased) {
        return (
            <div className="space-y-6 animate-in fade-in duration-700">
                <EmpetyPengumuman />
            </div>
        )
    }

    // Mapping data pendaftar untuk ditampilkan di kartu (Mengambil dari Dashboard Data agar sinkron)
    const dataPendaftar = {
        nomor_pendaftaran: dashboard?.nomor_pendaftaran || '-',
        nama_lengkap: dashboard?.nama_lengkap || '-',
        nama_sekolah: dashboard?.nama_sekolah || '-',
        tahun_ajaran: dashboard?.tahun_ajaran || '-',
        tanggal_pengumuman: pengumuman?.tanggal_pengumuman,
        pengumuman_hasil_seleksi: pengumuman?.hasil_pengumuman
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Hasil Seleksi Card */}
            <HasilCard

                pengumuman={pengumuman}
                data={dataPendaftar}
                tahunAjaran={dataPendaftar.tahun_ajaran}
            />

            {/* Langkah Selanjutnya — hanya jika DITERIMA */}
            {/* {pengumuman.hasil_pengumuman === 'DITERIMA' && (
                <LangkahSelanjutnya
                    data={dataPendaftar}
                    tanggalDaftarUlang={dashboard?.daftar_ulang_range || "-"}
                    lokasiDaftarUlang="SMP Negeri 5 Narmada"
                    jamOperasional="08.00–14.00 WITA"
                />
            )} */}
        </div>
    )
}
