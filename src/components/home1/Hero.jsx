'use client'

import { ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'

// Ganti array ini dengan path gambar asli Anda
const slides = [
  {
    src: '/Perpus.jpg',
    alt: 'Kegiatan Belajar Mengajar',
    caption: 'Lingkungan Belajar Modern',
  },
  {
    src: '/f1.jpg',
    alt: 'Fasilitas Sekolah',
    caption: 'Fasilitas Lengkap & Modern',
  },
  {
    src: '/Extra1.jpg',
    alt: 'Kegiatan Siswa',
    caption: 'Ekstrakurikuler',
  },
  {
    src: '/prestasi1.png',
    alt: 'Prestasi Siswa',
    caption: 'Raih Prestasi Terbaik',
  },
]

export default function Hero({ jadwal }) {
  const [current, setCurrent] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)

  useEffect(() => {
    if (!isAutoplay) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isAutoplay])

  const goTo = (index) => {
    setCurrent(index)
    setIsAutoplay(false)
    setTimeout(() => setIsAutoplay(true), 8000)
  }

  const prev = () => goTo((current - 1 + slides.length) % slides.length)
  const next = () => goTo((current + 1) % slides.length)

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* ─── BACKGROUND SLIDESHOW ─── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={slides[current].src}
              alt={slides[current].alt}
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay gradien */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* ─── KONTEN UTAMA ─── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
        <div className="max-w-2xl space-y-8">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/80 backdrop-blur-sm rounded-full border border-blue-400/40"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-white tracking-wide uppercase">
              PMB Tahun Ajaran {jadwal?.tahun_ajaran || '-'}
            </span>
          </motion.div>

          {/* Caption slide */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`caption-${current}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.4 }}
              className="text-blue-300 text-sm font-medium tracking-widest uppercase"
            >
              {slides[current].caption}
            </motion.p>
          </AnimatePresence>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
          >
            Penerimaan Murid Baru{' '}
            <span className="text-blue-400">SMP Negeri 5 Narmada</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-200 max-w-xl leading-relaxed"
          >
            Bergabunglah dengan sekolah unggulan di Narmada. Kami menyediakan
            pendidikan berkualitas dengan fasilitas modern dan tenaga pengajar
            profesional untuk masa depan cerah putra-putri Anda.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-500 transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
            >
              Daftar Sekarang
              <ArrowRight className="w-5 h-5" />
            </a>
            {/* <a
              href="#informasi"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all"
            >
              Pelajari Lebih Lanjut
            </a> */}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20"
          >
            {[
              { value: '1.200+', label: 'Siswa Aktif' },
              { value: '45+', label: 'Guru Profesional' },
              // { value: '98%', label: 'Kelulusan' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-300 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── SLIDE CONTROLS ─── */}
      <div className="absolute bottom-8 right-6 z-20 flex flex-col items-end gap-4">

        {/* Tombol prev / next */}
        <div className="flex gap-2">
          <button
            onClick={prev}
            aria-label="Sebelumnya"
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-white/25 transition-all text-lg"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Berikutnya"
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-white/25 transition-all text-lg"
          >
            ›
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex gap-2 items-center">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="relative h-2 rounded-full overflow-hidden transition-all duration-300 focus:outline-none"
              style={{ width: i === current ? 28 : 8, background: 'rgba(255,255,255,0.35)' }}
            >
              {i === current && (
                <motion.span
                  layoutId="dot-fill"
                  className="absolute inset-0 bg-white rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Counter */}
        <p className="text-white/60 text-xs font-mono">
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </p>
      </div>

      {/* ─── PROGRESS BAR ─── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-0.5 bg-white/10">
        <motion.div
          key={current}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: 'linear' }}
          className="h-full bg-blue-400"
        />
      </div>
    </section>
  )
}