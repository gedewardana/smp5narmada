"use client"
import React from 'react'
import Profile from '@/components/home/Profile'
import TabsProfile from '@/components/home/TabsProfile'
import Footer from '@/components/home/Footer'
import {
    GraduationCap, MapPin, Target, Eye, Award,
    Building2, Monitor, FlaskConical, Library, Music, Dumbbell,
    ArrowLeft, ChevronRight, Phone, Mail, Globe,
    Calendar, Hash,
} from 'lucide-react'

export default function page() {


    // ─── DATA ─────────────────────────────────────────────────────────────────────

    const facilities = [
        { icon: Monitor, title: 'Ruang Kelas', desc: '15 ruang kelas yang nyaman dan kondusif', accent: '#059669' },
        { icon: Monitor, title: 'Lab Komputer', desc: 'Laboratorium komputer', accent: '#2563eb' },
        { icon: FlaskConical, title: 'Lab Sains', desc: 'Laboratorium fisika', accent: '#7c3aed' },
        { icon: Library, title: 'Perpustakaan', desc: 'Koleksi 5.000+ buku dan area baca nyaman', accent: '#d97706' },
        { icon: Music, title: 'Ruang Seni', desc: 'Ruang untuk kegiatan musik dan tari', accent: '#db2777' },
        { icon: Dumbbell, title: 'Lapangan Olahraga', desc: 'Lapangan basket', accent: '#0891b2' },
    ]

    const teachers = [
        { name: 'Drs. H. Ahmad Sudirman, M.Pd', position: 'Kepala Sekolah', subject: null, initials: 'AS' },
        { name: 'Dra. Siti Aminah', position: 'Wakasek Kurikulum', subject: 'Bahasa Indonesia', initials: 'SA' },
        { name: 'H. Muhammad Rizal, S.Pd', position: 'Wakasek Kesiswaan', subject: 'Matematika', initials: 'MR' },
        { name: 'Nurul Hidayah, S.Pd', position: 'Wakasek Sarana', subject: 'IPA', initials: 'NH' },
        { name: 'Abdul Rahman, S.Pd', position: 'Guru', subject: 'Bahasa Inggris', initials: 'AR' },
        { name: 'Sri Wahyuni, S.Pd', position: 'Guru', subject: 'IPS', initials: 'SW' },
    ]

    const staffStats = [
        { value: '27', label: 'Guru', bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
        { value: '8', label: 'Staff Administrasi', bg: '#fffbeb', text: '#92400e', border: '#fcd34d' },
        { value: '5', label: 'Tenaga Perpustakaan', bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
        { value: '4', label: 'Penjaga & Kebersihan', bg: '#f5f3ff', text: '#4c1d95', border: '#ddd6fe' },
    ]

    const extracurriculars = [
        { name: 'Drumband', category: 'Kepemimpinan', emoji: '🎺' },
        { name: 'Pramuka', category: 'Keorganisasian', emoji: '⚜️' },
        { name: 'Paskibra', category: 'Kepemimpinan', emoji: '⚜️' },
        { name: 'Basket', category: 'Olahraga', emoji: '🏀' },
        { name: 'Tari', category: 'Seni', emoji: '💃' },

    ]

    const identitasData = [
        { label: 'NPSN', value: '60724648' },
        { label: 'Nama Sekolah', value: 'SMP NEGERI 5 NARMADA' },
        { label: 'Naungan', value: 'Kementerian Pendidikan dan Kebudayaan' },
        { label: 'Tanggal Berdiri', value: '13 September 2011' },
        { label: 'No. SK Pendirian', value: '1088A/206/DIKPORA/2011' },
        { label: 'Tanggal Operasional', value: '13 September 2011' },
        { label: 'No. SK Operasional', value: '1088A/206/DIKPORA/2011' },
        { label: 'Jenjang Pendidikan', value: 'SMP' },
        { label: 'Status Sekolah', value: 'Negeri' },
        { label: 'Akreditasi', value: 'B' },
        { label: 'Tanggal Akreditasi', value: '29 Oktober 2015' },
        { label: 'No. SK Akreditasi', value: '183a/BAP-SM/KP/X/2015' },
        { label: 'Sertifikasi', value: 'Belum Bersertifikat' },
        { label: 'Alamat', value: 'JL. SURANADI 2' },
        { label: 'Desa / Kelurahan', value: 'SURANADI' },
        { label: 'Kecamatan', value: 'Kec. Narmada' },
        { label: 'Kabupaten', value: 'Kab. Lombok Barat' },
        { label: 'Provinsi', value: 'Nusa Tenggara Barat' },
        { label: 'No. Telepon', value: '' },
        { label: 'Website', value: '' },
        { label: 'Email', value: 'smpnlimanarmada@rocketmail.com' },
        { label: 'Kepala Sekolah', value: 'Kadar Kencana' },

    ]

    const tujuan = [
        { title: 'Akademik', desc: 'Meningkatkan prestasi akademik dan hasil belajar siswa secara berkelanjutan.', emoji: '📚' },
        { title: 'Karakter', desc: 'Membentuk siswa yang berdisiplin, jujur, dan bertanggung jawab.', emoji: '🌟' },
        { title: 'Keterampilan', desc: 'Mengembangkan keterampilan sesuai bakat dan minat setiap siswa.', emoji: '🎯' },
        { title: 'Lingkungan', desc: 'Menciptakan sekolah yang bersih, hijau, dan berwawasan lingkungan.', emoji: '🌿' },
    ]

    const misiList = [
        "Meningkatkan penghayatan dan penglaman ajaran agama yang dianut dan etika, sehingga menjadi sumber keharifan dan bertindak.",
        "Membiasakan warga sekolah untuk berdisiplin dan berbudi pekerti luhur lewat ketedalanan sikap dan perilaku serta tindakan.",
        "Melaksanakan pembelajaran yang efektif dan berorientasi pada perkembangan peserta didik secara optimal sesuai dengan potensi yang dimilikinya.",
        "Menumbuhkan semangat untuk berprestasi bagi semua warga sekolah.",
        "Mengintergrasikan pendidikan dan keterampilan pada mata pelajaran muatan dan extrakurikuler."
    ]


    return (



        <div>
            <Profile />
            <TabsProfile
                facilities={facilities}
                teachers={teachers}
                staffStats={staffStats}
                extracurriculars={extracurriculars}
                identitasData={identitasData}
                tujuan={tujuan}
                misiList={misiList}
            />
            <Footer />
        </div>
    )
}
