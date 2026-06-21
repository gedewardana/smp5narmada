'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { usePendaftaranID } from '@/hooks/usePendaftaranID'

export default function StepGuard({ children }) {
    const pathname = usePathname()
    const router = useRouter()
    const { user } = useAuth()
    const idPendaftaran = user?.id_pendaftaran
    
    const { data: pendaftaranData, isLoading } = usePendaftaranID(idPendaftaran)
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        // Jangan lakukan apapun jika sedang memuat data
        if (isLoading) return;
        
        if (!pendaftaranData) {
            // Jika tidak ada data pendaftaran sama sekali (pendaftar baru),
            // hanya boleh akses halaman root dashboard atau langkah pertama (identitas)
            if (pathname.includes('/identitas') || pathname === '/user/dashboard/pendaftaran') {
                setIsAuthorized(true);
            } else {
                router.replace('/user/dashboard/pendaftaran');
            }
            return;
        }
        
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

        const skippedSteps = pendaftaranData.skipped_steps || [];

        const isCompleted = (key) => {
            if (key === 'identitas') return !!pendaftaranData.identitas;
            if (key === 'data-ayah') return !!pendaftaranData.ayah || skippedSteps.includes('data-ayah');
            if (key === 'data-ibu') return !!pendaftaranData.ibu || skippedSteps.includes('data-ibu');
            if (key === 'data-wali') return !!pendaftaranData.wali || skippedSteps.includes('data-wali');
            if (key === 'data-periodik') return !!pendaftaranData.periodik;
            if (key === 'data-prestasi') return (pendaftaranData.prestasi && pendaftaranData.prestasi.length > 0) || skippedSteps.includes('data-prestasi');
            if (key === 'persyaratan') {
                const mandatoryFiles = ['AKTA', 'KK', 'SKL', 'KTP_AYAH', 'KTP_IBU'];
                const uploadedFiles = pendaftaranData.berkas_persyaratan || [];
                return mandatoryFiles.every(type => 
                    uploadedFiles.some(file => file.jenis_berkas === type && file.status_upload === 'UPLOADED')
                );
            }
            if (key === 'review-data') return pendaftaranData.status_pendaftaran === 'SUBMITTED';
            return false;
        };

        // Hitung batas maksimal index langkah yang boleh diakses
        let highestAllowedIndex = 0;
        for (let i = 0; i < steps.length; i++) {
            if (isCompleted(steps[i].key)) {
                highestAllowedIndex = i + 1; // Boleh akses 1 langkah setelah langkah terakhir yang selesai
            } else {
                break; // Berhenti mengecek jika ada rantai yang terputus
            }
        }
        
        // Batasi nilai tertinggi (jangan melebihi jumlah total array)
        if (highestAllowedIndex >= steps.length) {
            highestAllowedIndex = steps.length - 1;
        }

        // Temukan index langkah yang sedang dibuka saat ini
        const currentStepIndex = steps.findIndex(step => pathname.includes(step.path));

        // Jika user berada di luar form (misal: halaman root dashboard), izinkan.
        if (currentStepIndex === -1) {
            setIsAuthorized(true);
            return;
        }

        // PERIKSA OTORISASI: Jika mencoba melompat melebihi langkah yang diizinkan
        if (currentStepIndex > highestAllowedIndex) {
            setIsAuthorized(false);
            console.warn('Akses ditolak: Anda belum menyelesaikan form sebelumnya.');
            
            // Arahkan ke rute terakhir yang belum selesai, bukan root
            const targetPath = steps[highestAllowedIndex]?.path || '/user/dashboard/pendaftaran';
            router.replace(targetPath);
        } else {
            setIsAuthorized(true); // Sah! Izinkan rendering
        }

    }, [pathname, isLoading, pendaftaranData, router]);

    // Tampilkan indikator memuat jika SWR sedang memanggil API atau sedang proses validasi
    if (isLoading || !isAuthorized) {
        return (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-slate-400 animate-pulse">Memverifikasi akses rute...</p>
            </div>
        )
    }

    // Lolos inspeksi, render halaman sesungguhnya
    return <>{children}</>;
}
