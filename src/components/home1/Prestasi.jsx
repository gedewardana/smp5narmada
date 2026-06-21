'use client'

import { Trophy, Medal, Award, Star, ChevronRight, Calendar, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Prestasi({ onShowDetail }) {
    const prestasiList = [
        {
            id: 1,
            badge: 'Basket Ball',
            badgeColor: 'bg-emerald-100 text-emerald-700',
            title: 'Juara Runner Up Basket Ball 2024',
            description: 'Salah satu kebanggaan sekolah kami adalah keberhasilan siswa dalam meraih Juara 1 Basket Ball tingkat kabupaten. Prestasi ini mencerminkan kualitas pembelajaran yang unggul serta dedikasi tinggi dari siswa dan guru dalam mengembangkan potensi akademik secara maksimal.',
            image: '/prestasi1.png',
            stats: [
                { label: 'Tingkat', value: 'Nasional' },
                { label: 'Bidang', value: 'Basket Ball' },
                { label: 'Tahun', value: '2024' },
            ],
            icon: Trophy,
            iconColor: 'text-yellow-600',
            pemenang: 'Ahmad Fauzi & Tim',
            tanggal: '12 Januari 2025',
            lokasi: 'Mataram, NTB'
        },
        {
            id: 2,
            badge: 'FLS2N',
            badgeColor: 'bg-purple-100 text-purple-700',
            title: 'Juara 1 Festival Lomba Seni Siswa Nasional 2025',
            description: 'Tim tari tradisional SMPN 5 Narmada berhasil meraih juara pertama dalam kompetisi seni tingkat provinsi. Penampilan yang memukau dengan kekayaan budaya Sasak berhasil menyisihkan puluhan peserta dari sekolah-sekolah unggulan.',
            image: '/prestasi2.png',
            stats: [
                { label: 'Tingkat', value: 'Provinsi' },
                { label: 'Bidang', value: 'Tari Tradisional' },
                { label: 'Penghargaan', value: 'Emas' },
            ],
            icon: Medal,
            iconColor: 'text-purple-600',
            pemenang: 'Tim Tari Sasak',
            tanggal: '24 Februari 2025',
            lokasi: 'Taman Budaya NTB'
        },
        {
            id: 3,
            badge: 'SAC',
            badgeColor: 'bg-green-100 text-green-700',
            title: 'Juara Bola Basket SAC Indonesia',
            description: 'Tim basket SMP Negeri 5 Narmada berhasil meraih juara pertama dalam kompetisi bola basket tingkat nasional. Prestasi ini mencerminkan kualitas pembinaan atlet dan semangat juang yang tinggi dari para siswa.',
            image: '/image.png',
            stats: [
                { label: 'Tingkat', value: 'Nasional' },
                { label: 'Kategori', value: 'Bola Basket' },
                { label: 'Tahun', value: '2024' },
            ],
            icon: Award,
            iconColor: 'text-green-600',
            pemenang: 'Tim Basket SMPN 5 Narmada',
            tanggal: '10 November 2024',
            lokasi: 'Jakarta (Kementerian LHK)'
        },
    ]

    return (
        <section id="prestasi" className="py-16 sm:py-20 lg:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-full mb-4 border border-yellow-200"
                    >
                        <Trophy className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-semibold text-yellow-700">Prestasi Gemilang</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                    >
                        Prestasi & Penghargaan
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-lg text-gray-600"
                    >
                        Berbagai pencapaian membanggakan yang diraih oleh siswa dan sekolah dalam bidang akademik maupun non-akademik.
                    </motion.p>
                </div>

                {/* Prestasi List */}
                <div className="space-y-16 sm:space-y-20 lg:space-y-24">
                    {prestasiList.map((prestasi, index) => (
                        <motion.div
                            key={prestasi.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                                }`}
                        >
                            {/* Content - Order changes on mobile vs desktop */}
                            <div className={`space-y-4 sm:space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                                {/* Badge */}
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${prestasi.badgeColor}`}>
                                    <Star className="w-3.5 h-3.5" />
                                    {prestasi.badge}
                                </span>

                                {/* Title */}
                                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                    {prestasi.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    {prestasi.description}
                                </p>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4">
                                    {prestasi.stats.map((stat, idx) => (
                                        <div key={idx} className="text-center sm:text-left p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                                            <p className="text-sm sm:text-base font-bold text-gray-900">{stat.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <button 
                                    onClick={() => onShowDetail?.(prestasi)}
                                    className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-blue-600 hover:text-blue-700 transition-colors group pt-2"
                                >
                                    Lihat Detail Prestasi
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            {/* Image */}
                            <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                                <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl bg-gray-200">
                                    {/* Placeholder jika gambar tidak ada */}
                                    <Image
                                        src={prestasi.image}
                                        alt={prestasi.title}
                                        fill
                                        className="object-cover"
                                    />


                                </div>

                                {/* Decorative Element */}
                                <div className={`absolute -z-10 w-full h-full rounded-2xl bg-gradient-to-br ${index % 2 === 0
                                        ? 'from-blue-100 to-purple-100 -bottom-3 -right-3 sm:-bottom-4 sm:-right-4'
                                        : 'from-green-100 to-emerald-100 -bottom-3 -left-3 sm:-bottom-4 sm:-left-4'
                                    }`} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-16 sm:mt-20"
                >
                    <button className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm hover:shadow-md">
                        Lihat Semua Prestasi
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </motion.div> */}
            </div>
        </section>
    )
}