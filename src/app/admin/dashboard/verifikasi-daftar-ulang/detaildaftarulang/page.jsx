// 'use client'
// import React, { useState } from 'react'
// import { useSearchParams } from 'next/navigation'
// import ModalDetailData from '@/components/ui-admin/verifikasi-daftar-ulang/ModalDetailData'
// import Header from '@/components/ui-admin/verifikasi-daftar-ulang/Header'



// export default function DetailDaftarUlangPage() {
//     const searchParams = useSearchParams()
//     const daftarUlangId = searchParams.get('id') ? parseInt(searchParams.get('id')) : null

//     const [activeTab, setActiveTab] = useState('berkas_persyaratan') // default tab

    
//     const detailData = {
//         id_daftar_ulang: daftarUlangId || 1,
//         nomor_pendaftaran: '2024/PMB/001',
//         status_pendaftaran: 'MENUNGGU_VERIFIKASI',
//         tahap_pengisian: 'VERIFIKASI_PANITIA',
//         tanggal_submit: '2024-06-15T10:30:00',
//         tahun_pelajaran: '2024/2025',
//         catatan_panitia: 'Berkas KTP Ayah kurang jelas, mohon diunggah ulang dengan resolusi lebih baik.',


//         identitas: {
//             nisn: '0012345678',
//             nis: '12345',
//             nama_lengkap: 'Ahmad Fauzi Rahman',
//             jenis_kelamin: 'Laki-laki',
//             tempat_lahir: 'Jakarta',
//             tanggal_lahir: '2010-05-15',
//             agama: 'Islam',
//             nik: '3201051005100001',
//             no_hp: '081234567890',
//             email: 'ahmad.fauzi@email.com',
//             anak_ke: 2,
//             saudara_kandung: 3,
//             sekolah_asal: 'SMP Negeri 1 Jakarta'
//         },

        
//         ayah: {
//             nama: 'Rahman Abdullah',
//             tahun_lahir: 1980,
//             pendidikan: 'S1',
//             pekerjaan: 'PNS',
//             penghasilan: 'Rp 5.000.000 - Rp 10.000.000'
//         },

        
//         ibu: {
//             nama: 'Siti Aminah',
//             tahun_lahir: 1982,
//             pendidikan: 'SMA',
//             pekerjaan: 'Ibu Rumah Tangga',
//             penghasilan: 'Tidak Berpenghasilan'
//         },

        
//         wali: null,

//         periodik: {
//             tinggi_badan: 165,
//             berat_badan: 55,
//             jarak_tempat_tinggal: 5.2,
//             waktu_tempuh: 30
//         },

        
//         prestasi: [
//             {
//                 jenis: 'Akademik',
//                 tingkat: 'Provinsi',
//                 nama: 'Juara 1 Olimpiade Matematika',
//                 tahun: 2023,
//                 penyelenggara: 'Dinas Pendidikan Provinsi DKI Jakarta'
//             },
//             {
//                 jenis: 'Non-Akademik',
//                 tingkat: 'Nasional',
//                 nama: 'Juara 3 Lomba Karya Ilmiah',
//                 tahun: 2024,
//                 penyelenggara: 'Kementerian Pendidikan'
//             }
//         ],

            
//         dokumen_pendukung: [
//             {
//                 jenis_berkas: 'AKTA',
//                 nama_file: 'akta_kelahiran.pdf',
//                 path_file: '/uploads/akta_kelahiran.pdf',
                
//                 mandatory: true
//             },
//             {
//                 jenis_berkas: 'KK',
//                 nama_file: 'kartu_keluarga.pdf',
//                 path_file: '/uploads/kartu_keluarga.pdf',
                
//                 mandatory: true
//             },
//             {
//                 jenis_berkas: 'KTP_AYAH',
//                 nama_file: 'ktp_ayah.jpg',
//                 path_file: '/uploads/ktp_ayah.jpg',
                
//                 mandatory: true
//             },
//             {
//                 jenis_berkas: 'PIAGAM_1',
//                 nama_file: 'piagam_olimpiade.jpg',
//                 path_file: '/uploads/piagam_olimpiade.jpg',
                
//                 mandatory: false
//             }
//         ]
//     }


//     return (
//         <div className="fixed min-h-screen inset-0 bg-gray-50 z-50 overflow-auto ">
//             <div className="bg-white rounded-lg shadow-xl w-full h-full flex flex-col">
//                 <Header
//                     detailData={detailData}
//                     activeTab={activeTab}
//                     setActiveTab={setActiveTab}
//                 />
//                 <ModalDetailData
//                     detailData={detailData}
//                     activeTab={activeTab}
//                 />
//             </div>
            
//             {showModalVerifikasi && (
//                 <ModalVerifikasi
//                     href="/panitia/dashboard/verifikasi-daftar-ulang"
//                     daftarUlang={detailData}
//                     onClose={() => setShowModalVerifikasi(false)}
//                     onSubmit={handleVerifikasiSubmit}
//                 />
//             )}
//         </div>
//     )
// }
