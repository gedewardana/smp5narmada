'use client'

import { useState } from 'react'
import { 
  Music, 
  Palette, 
  Dumbbell, 
  Code, 
  BookOpen, 
  Camera, 
  Globe, 
  Users,
  ChevronRight,
  MapPin,
  Clock,
  Trophy,
  User
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function Ekstrakurikuler() {
  const [activeTab, setActiveTab] = useState('semua')

  const kategori = [
    { id: 'semua', label: 'Semua' },
    { id: 'olahraga', label: 'Olahraga' },
    { id: 'seni', label: 'Seni & Budaya' },
    { id: 'akademik', label: 'Akademik' },
    { id: 'teknologi', label: 'Teknologi' },
  ]

  const ekstrakurikuler = [
    {
      nama: 'Paskibra',
      kategori: 'olahraga',
      icon: Users,
      deskripsi: 'Pasukan Pengibar Bendera dengan disiplin tinggi dan kepemimpinan. Rutin juara di tingkat kabupaten.',
      jadwal: 'Senin & Rabu, 15.30 - 17.30',
      lokasi: 'Lapangan Sekolah',
      pembina: 'Pak Ahmad, S.Pd',
      prestasi: 'Juara 1 LKBB 2024',
      warna: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200',
    },
    {
      nama: 'Tari Tradisional',
      kategori: 'seni',
      icon: Music,
      deskripsi: 'Melestarikan tarian tradisional Sasak dan Nusantara. Tampil di berbagai event budaya.',
      jadwal: 'Selasa & Kamis, 15.30 - 17.30',
      lokasi: 'Rangkaian',
      pembina: 'Ibu Siti, S.Pd',
      prestasi: 'Juara 2 FLS2N 2025',
      warna: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      nama: 'Basket',
      kategori: 'olahraga',
      icon: Dumbbell,
      deskripsi: 'Tim basket putra dan putri dengan pelatihan intensif dan fasilitas lapangan standar.',
      jadwal: 'Senin, Rabu, Jumat, 15.30 - 17.30',
      lokasi: 'Lapangan Basket',
      pembina: 'Pak Budi, S.Pd',
      prestasi: 'Juara 1 FASI 2025',
      warna: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200',
    },
    {
      nama: 'Robotik & Coding',
      kategori: 'teknologi',
      icon: Code,
      deskripsi: 'Belajar pemrograman, Arduino, dan robotika. Persiapan kompetisi teknologi nasional.',
      jadwal: 'Sabtu, 08.00 - 11.00',
      lokasi: 'Lab Komputer',
      pembina: 'Pak Rudi, S.Kom',
      prestasi: 'Juara 3 KRCI 2024',
      warna: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      nama: 'Paduan Suara',
      kategori: 'seni',
      icon: Music,
      deskripsi: 'Vokal grup dengan repertoar lagu daerah, nasional, dan internasional.',
      jadwal: 'Selasa & Kamis, 15.30 - 17.30',
      lokasi: 'Ruang Musik',
      pembina: 'Ibu Maya, S.Pd',
      prestasi: 'Juara 1 FLS2N 2024',
      warna: 'bg-pink-50',
      iconColor: 'text-pink-600',
      borderColor: 'border-pink-200',
    },
    {
      nama: 'English Club',
      kategori: 'akademik',
      icon: Globe,
      deskripsi: 'Meningkatkan kemampuan bahasa Inggris melalui debat, speech, dan drama.',
      jadwal: 'Jumat, 15.30 - 17.00',
      lokasi: 'Ruang Bahasa',
      pembina: 'Ibu Sarah, S.Pd',
      prestasi: 'Best Speaker EDC 2025',
      warna: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-200',
    },
    {
      nama: 'Jurnalistik',
      kategori: 'akademik',
      icon: Camera,
      deskripsi: 'Mengelola media sekolah, fotografi, videografi, dan penulisan berita.',
      jadwal: 'Sabtu, 08.00 - 11.00',
      lokasi: 'Studio Multimedia',
      pembina: 'Pak Dedi, S.Pd',
      prestasi: 'Juara 1 LJKS 2024',
      warna: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      borderColor: 'border-cyan-200',
    },
    {
      nama: 'Pramuka',
      kategori: 'olahraga',
      icon: Users,
      deskripsi: 'Kegiatan kepramukaan dengan program penegak bantara dan laksana.',
      jadwal: 'Sabtu, 07.00 - 12.00',
      lokasi: 'Lapangan Sekolah',
      pembina: 'Pak Agus, S.Pd',
      prestasi: 'Pesta Siaga Emas 2024',
      warna: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      nama: 'Lukis & Kaligrafi',
      kategori: 'seni',
      icon: Palette,
      deskripsi: 'Mengembangkan bakat seni rupa melalui lukis, kaligrafi, dan kriya.',
      jadwal: 'Rabu, 15.30 - 17.30',
      lokasi: 'Ruang Seni',
      pembina: 'Ibu Lina, S.Pd',
      prestasi: 'Juara 1 FLS2N 2025',
      warna: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200',
    },
    {
      nama: 'Science Club',
      kategori: 'akademik',
      icon: BookOpen,
      deskripsi: 'Eksplorasi sains melalui eksperimen dan persiapan olimpiade sains.',
      jadwal: 'Kamis, 15.30 - 17.30',
      lokasi: 'Lab IPA',
      pembina: 'Pak Heri, S.Pd',
      prestasi: 'OSN Juara 1 2025',
      warna: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
    },
  ]

  const filteredEkstra = activeTab === 'semua' 
    ? ekstrakurikuler 
    : ekstrakurikuler.filter(item => item.kategori === activeTab)

  return (
    <section id="ekstrakurikuler" className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full mb-4 border border-green-100">
            <Dumbbell className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Kegiatan Siswa</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Ekstrakurikuler
          </h2>
          <p className="text-lg text-gray-600">
            Berbagai kegiatan pengembangan bakat dan minat untuk membentuk siswa yang berprestasi dan berkarakter.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {kategori.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid Ekstrakurikuler */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEkstra.map((item, index) => (
            <motion.div
              key={item.nama}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`group bg-white rounded-2xl border ${item.borderColor} overflow-hidden hover:shadow-xl transition-all duration-300`}
            >
              {/* Header Card */}
              <div className={`${item.warna} p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm`}>
                    <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 bg-white/80 rounded-full text-xs font-semibold ${item.iconColor}`}>
                    <Trophy className="w-3 h-3" />
                    {item.prestasi}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.nama}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>

              {/* Info Details */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{item.jadwal}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{item.lokasi}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Pembina: {item.pembina}</span>
                </div>
              </div>

              {/* Action */}
              <div className="px-6 pb-6">
                <button className={`w-full py-3 rounded-xl border ${item.borderColor} ${item.iconColor} font-semibold text-sm hover:${item.warna} transition-colors flex items-center justify-center gap-2 group-hover:gap-3`}>
                  Lihat Detail
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Tambahan */}
        <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-100">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">20+</p>
              <p className="text-gray-600">Jenis Ekstrakurikuler</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600 mb-2">100%</p>
              <p className="text-gray-600">Siswa Mengikuti Minimal 1 Kegiatan</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-purple-600 mb-2">50+</p>
              <p className="text-gray-600">Prestasi Ekstrakurikuler/Tahun</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}