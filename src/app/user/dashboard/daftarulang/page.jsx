'use client'

import { useState } from 'react'

import BerkasList from '@/components/ui-user/daftar-ulang/BerkasList'
import Header from '@/components/ui-user/daftar-ulang/Header'
import InfoBox from '@/components/ui-user/daftar-ulang/InfoBox'
import EmpetyDaftarUlang from '@/components/ui-user/daftar-ulang/EmpetyDaftarUlang'
import RejectedView from '@/components/ui-user/daftar-ulang/RejectedView'
import ButtonReasuble from '@/components/buttonreasuble/ButtonReasuble'
import { FileText, Send, } from 'lucide-react'
import Swal from 'sweetalert2'

export default function DaftarulangPage() {

    // Status Daftar Ulang - nanti fetch dari API
    const [statusDaftarUlang] = useState('BELUM_DAFTAR_ULANG')


    // Status Akses Halaman: 'BELUM_SELESAI' | 'TIDAK_DITERIMA' | 'DITERIMA'
    // Ganti value ini untuk testing kondisi halaman
    const [statusAkses] = useState('DITERIMA')

    // 1. Jika Belum Selesai Pendaftaran
    if (statusAkses === 'BELUM_SELESAI') {
        return (
            <div className="space-y-6 px-8 pb-8">
                <div className="">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Pendaftaran Ulang PMB</h1>
                    </div>
                    <p className="text-gray-600">Pendaftaran Ulang Penerimaan Murid Baru SMP Negeri 5 Narmada.</p>
                </div>
                <EmpetyDaftarUlang />
            </div>
        )
    }

    // 2. Jika Tidak Diterima
    if (statusAkses === 'TIDAK_DITERIMA') {
        return (
            <div className="space-y-6 px-8 pb-8">
                <div className="">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Pendaftaran Ulang PMB</h1>
                    </div>
                    <p className="text-gray-600">Pendaftaran Ulang Penerimaan Murid Baru SMP Negeri 5 Narmada.</p>
                </div>
                <RejectedView />
            </div>
        )
    }

    // 3. Jika Diterima (Lanjut ke konten di bawah)


    // Dummy data berkas - nanti fetch dari API
    const [berkasList, setBerkasList] = useState([
        {
            id_berkas_daftar_ulang: 1,
            id_daftar_ulang: 1,
            jenis_berkas_daftar_ulang: 'SURAT_TERIMA',
            nama_file: '',
            path_file: '',
            mandatory: true,
            status_verifikasi: 'BELUM_DIUNGGAH',
            // Status: BELUM_DIUNGGAH, DALAM_VERIFIKASI, DIVERIFIKASI, DITOLAK
            catatan_verifikasi: null,
            diverifikasi_oleh: null,
            diunggah_pada: null,
            diperbaharui_pada: null
        },
        {
            id_berkas_daftar_ulang: 2,
            id_daftar_ulang: 1,
            jenis_berkas_daftar_ulang: 'PERNYATAAN_ORTU',
            nama_file: '',
            path_file: '',
            mandatory: true,
            status_verifikasi: 'BELUM_DIUNGGAH',
            catatan_verifikasi: null,
            diverifikasi_oleh: null,
            diunggah_pada: null,
            diperbaharui_pada: null
        },
        {
            id_berkas_daftar_ulang: 3,
            id_daftar_ulang: 1,
            jenis_berkas_daftar_ulang: 'PERNYATAAN_SISWA',
            nama_file: '',
            path_file: '',
            mandatory: true,
            status_verifikasi: 'BELUM_DIUNGGAH',
            catatan_verifikasi: null,
            diverifikasi_oleh: null,
            diunggah_pada: null,
            diperbaharui_pada: null
        }
    ])

    const handleUpload = (jenis, file) => {
        if (!file) return

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file maksimal 2MB')
            return
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
        if (!allowedTypes.includes(file.type)) {
            alert('Format file harus PDF, JPG, atau PNG')
            return
        }

        // Simulate upload - nanti ganti dengan API call
        setBerkasList(prev => prev.map(berkas =>
            berkas.jenis_berkas_daftar_ulang === jenis
                ? {
                    ...berkas,
                    nama_file: file.name,
                    path_file: URL.createObjectURL(file), // Temporary, nanti dari API
                    diunggah_pada: new Date().toISOString(),
                    diperbaharui_pada: new Date().toISOString(),
                    status_verifikasi: 'DIUNGGAH' // Auto change to DALAM_VERIFIKASI
                }
                : berkas
        ))

        alert(`File ${file.name} berhasil diupload! Status: Diunggah`)
    }

    const handleDelete = (jenis) => {
        if (!confirm('Yakin ingin menghapus file ini?')) return

        setBerkasList(prev => prev.map(berkas =>
            berkas.jenis_berkas_daftar_ulang === jenis
                ? {
                    ...berkas,
                    nama_file: '',
                    path_file: '',
                    diunggah_pada: null,
                    diperbaharui_pada: null,
                    status_verifikasi: 'BELUM_DIUNGGAH',
                    catatan_verifikasi: null
                }
                : berkas
        ))

        alert('File berhasil dihapus!')
    }

    const handleSubmit = async () => {
        if (statusDaftarUlang === 'DITERIMA') {
            // Kalau sudah tersimpan, klik button berarti mau EDIT
            setIsSaved(false)
        } else {
            // Tahap 1 — Konfirmasi
            const result = await Swal.fire({
                title: 'Apakah berkas pendaftaran ulang sudah benar?',
                text: 'Pastikan semua berkas yang diupload sudah benar dan jelas tidak buram.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: '✅ Sudah Benar, Kirim',
                cancelButtonText: '🔍 Cek Kembali',
                confirmButtonColor: '#16a34a',
                cancelButtonColor: '#6b7280',
                reverseButtons: true,
            })
            // Tahap 2 — Eksekusi hanya jika dikonfirmasi
            if (result.isConfirmed) {
                // TODO: API Call here
                await Swal.fire({
                    icon: 'success',
                    title: 'Pendaftaran ulang Berhasil! 🎉',
                    text: 'Berkas daftar ulang Anda telah berhasil dikirim. Tunggu verifikasi panitia.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#16a34a',
                })

            }
            // Jika "Cek Kembali" → dialog tutup, user tetap di halaman
        }
    }







    return (
        <div className="space-y-6 px-8 pb-8">
            {/* Header */}
            <Header />




            {/* Status Summary */}
            {/* <StatusSummary statusDaftarUlang={statusDaftarUlang} berkasList={berkasList} /> */}


            {/* Info Box */}
            <InfoBox />

            {/* Berkas List */}
            <BerkasList
                berkasList={berkasList}
                onUpload={handleUpload}
                onDelete={handleDelete}
            />

            <div className='flex justify-end'>
                <ButtonReasuble
                    // title="Submit Daftar Ulang"
                    onClick={handleSubmit}
                    variant="primary"
                    size="sm"
                >
                    <Send className='w-4 h-4 mr-2' />
                    Submit
                </ButtonReasuble>
            </div>
        </div>


    )

}