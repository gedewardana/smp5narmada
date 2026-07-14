'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import StatusVerifikasi from '@/components/ui-user/pendaftaran/StatusVerifikasi'
import DetailPendaftaran from '@/components/ui-user/pendaftaran/DetailPendaftaran'
import { FileText, CheckCircle, AlertCircle, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUserDashboard } from '@/hooks/useUserDashboard'
import { usePendaftaranID } from '@/hooks/usePendaftaranID'
import RegistrationStatus from '@/components/ui-user/pendaftaran/RegistrationStatus'


const INFO_ITEMS = [
    {
        icon: <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />,
        text: 'Pastikan data yang diisi sesuai dengan dokumen resmi (Akta Lahir, KK, dll)',
    },

    {
        icon: <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />,
        text: 'Submit pendaftaran',
    },
    {
        icon: <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />,
        text: 'Data yang sudah dikirim tidak dapat diubah tanpa konfirmasi panitia',
    },
    {
        icon: <Clock className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />,
        text: 'Proses pengisian dapat dilakukan bertahap — data tersimpan otomatis per langkah',
    },
]

export default function PendaftaranPage() {
    const { data: dashboardData, isLoading: isLoadingDashboard } = useUserDashboard()
    const id_pendaftaran = dashboardData?.raw?.id_pendaftaran
    const { data: pendaftaranData } = usePendaftaranID(id_pendaftaran)

    const [nextStepLink, setNextStepLink] = useState('/user/dashboard/pendaftaran/identitas')

    useEffect(() => {
        if (!pendaftaranData) return;

        const skippedSteps = pendaftaranData.skipped_steps || [];

        const isCompleted = (key) => {
            if (key === 'identitas') return !!pendaftaranData.identitas;
            if (key === 'data-ayah') return !!pendaftaranData.ayah || skippedSteps.includes('data-ayah');
            if (key === 'data-ibu') return !!pendaftaranData.ibu || skippedSteps.includes('data-ibu');
            if (key === 'data-wali') return !!pendaftaranData.wali || skippedSteps.includes('data-wali');
            if (key === 'data-periodik') return !!pendaftaranData.periodik;
            if (key === 'data-prestasi') return (pendaftaranData.prestasi && pendaftaranData.prestasi.length > 0) || skippedSteps.includes('data-prestasi');
            if (key === 'persyaratan') return pendaftaranData.berkas_persyaratan?.some(b => b.status_upload === 'UPLOADED');
            return false;
        };

        const steps = [
            { key: 'identitas', path: '/user/dashboard/pendaftaran/identitas' },
            { key: 'data-ayah', path: '/user/dashboard/pendaftaran/data-ayah' },
            { key: 'data-ibu', path: '/user/dashboard/pendaftaran/data-ibu' },
            { key: 'data-wali', path: '/user/dashboard/pendaftaran/data-wali' },
            { key: 'data-periodik', path: '/user/dashboard/pendaftaran/data-periodik' },
            { key: 'data-prestasi', path: '/user/dashboard/pendaftaran/data-prestasi' },
            { key: 'persyaratan', path: '/user/dashboard/pendaftaran/persyaratan' },
            { key: 'review-data', path: '/user/dashboard/pendaftaran/review-data' }
        ];

        let targetPath = steps[0].path;
        for (const step of steps) {
            if (step.key === 'review-data') {
                targetPath = step.path;
                break;
            }
            if (!isCompleted(step.key)) {
                targetPath = step.path;
                break;
            }
        }

        setNextStepLink(targetPath);
    }, [pendaftaranData]);

    const activeJadwal = dashboardData?.jadwal_aktif

    // Ambil nilai dari data API
    const rawStatusPendaftaran = dashboardData?.raw?.status_pendaftaran;
    const rawStatusVerifikasi = dashboardData?.raw?.status_verifikasi;

    // Clean Code: Logika penyesuaian untuk menampilkan komponen StatusVerifikasi.
    // Tampilkan StatusVerifikasi JIKA:
    // 1. User sudah melakukan SUBMIT (menunggu verifikasi atau sudah diverifikasi)
    // 2. ATAU user dikembalikan ke status DRAFT oleh panitia karena PERLU_PERBAIKAN / TOLAK
    const showVerifikasiStatus =
        rawStatusPendaftaran === 'SUBMITTED' ||
        (rawStatusPendaftaran === 'DRAFT' && ['PERLU_PERBAIKAN', 'TOLAK'].includes(rawStatusVerifikasi));

    const statusVerifikasi = rawStatusVerifikasi ?? 'MENUNGGU_VERIFIKASI'
    const catatanPanitia = dashboardData?.raw?.catatan ?? null
    const tanggalVerifikasi = dashboardData?.raw?.tanggal_verifikasi ?? null

    // border warna detail card per status
    const detailBorderMap = {
        MENUNGGU_VERIFIKASI: 'border-blue-100',
        VERIFIKASI: 'border-green-100',
        PERLU_PERBAIKAN: 'border-yellow-100',
        TOLAK: 'border-red-100',
    }
    const detailCard = (
        <DetailPendaftaran
            borderColor={detailBorderMap[statusVerifikasi] ?? 'border-gray-100'}
        />
    )

    if (isLoadingDashboard) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-pulse w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            </div>
        )
    }

    return (
        <div className="">


            {showVerifikasiStatus ? (
                /* ── Setelah Submit atau Dikembalikan Panitia: tampilkan status verifikasi ── */
                <div className="mt-4">
                    <StatusVerifikasi
                        status={statusVerifikasi}
                        catatan={catatanPanitia}
                        tanggalVerifikasi={tanggalVerifikasi}
                        detailCard={detailCard}
                    />
                </div>
            ) : (

                <RegistrationStatus
                    jadwal={activeJadwal}
                    isLoading={isLoadingDashboard}
                >
                    {/* Info Card + CTA */}
                    <div className="mt-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        {/* Top accent bar */}
                        <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

                        <div className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row md:items-start gap-8">

                                {/* Info list */}
                                <div className="flex-1">
                                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                                        📋 Sebelum Mulai, Perhatikan:
                                    </h2>
                                    <ul className="space-y-3">
                                        {INFO_ITEMS.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                                                {item.icon}
                                                <span>{item.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* CTA Box */}
                                <div className="md:w-72 bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col items-center text-center gap-4">
                                    <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
                                        <FileText className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 mb-1">
                                            {nextStepLink === '/user/dashboard/pendaftaran/identitas' ? 'Siap mendaftar?' : 'Lanjutkan Pengisian?'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {nextStepLink === '/user/dashboard/pendaftaran/identitas'
                                                ? 'Mulai dengan mengisi data identitas peserta didik terlebih dahulu.'
                                                : 'Lanjutkan pengisian form Anda dari langkah terakhir yang tersimpan.'}
                                        </p>
                                    </div>
                                    <Link href={nextStepLink}>
                                        <Button
                                            variant="default"
                                            size="lg"
                                            className="flex items-center gap-2"
                                        >
                                            {nextStepLink === '/user/dashboard/pendaftaran/identitas' ? 'Mulai Mengisi' : 'Lanjutkan'}
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </RegistrationStatus>
            )}
        </div>
    )
}
