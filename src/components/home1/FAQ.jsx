'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: 'Bagaimana cara mendaftar online?',
      answer: 'Pendaftaran dilakukan melalui website resmi PMB dengan mengklik tombol "Daftar Sekarang", mengisi formulir pendaftaran, dan mengunggah dokumen persyaratan yang telah discan dengan format PDF atau JPG.',
    },
    {
      question: 'Apakah ada biaya pendaftaran?',
      answer: 'Pendaftaran online GRATIS. Biaya hanya dikenakan saat daftar ulang setelah dinyatakan diterima, meliputi biaya seragam, buku, dan kegiatan pembukaan.',
    },
    {
      question: 'Bisakah mendaftar jika domisili di luar zonasi?',
      answer: 'Untuk jalur zonasi, calon siswa harus berdomisili di wilayah zonasi sekolah. Namun, tersedia jalur prestasi dan jalur afirmasi dengan ketentuan khusus yang dapat diakses oleh calon siswa luar zonasi.',
    },
    {
      question: 'Bagaimana jika dokumen belum lengkap saat pendaftaran?',
      answer: 'Dokumen wajib lengkap saat pengunggahan. Jika ada dokumen yang belum tersedia (misal: SKL), dapat menggunakan surat keterangan dari sekolah asal sementara waktu.',
    },
    {
      question: 'Kapan hasil seleksi diumumkan?',
      answer: 'Hasil seleksi akan diumumkan pada tanggal 20 Juli 2026 pukul 08.00 WIB melalui website resmi dan papan pengumuman di sekolah.',
    },
    {
      question: 'Apakah ada tes masuk?',
      answer: 'Tidak, tidak ada tes masuk. Seleksi dilakukan berdasarkan domisili, nilai rapor dan prestasi akademik.',
    },
  ]

  return (
    <section id="faq" className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Butuh Bantuan?</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-lg text-gray-600">
            Temukan jawaban atas pertanyaan umum seputar proses pendaftaran murid baru.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index 
                  ? 'border-blue-200 bg-blue-50/30 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className={`font-semibold pr-4 ${
                  openIndex === index ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-blue-600' : 'text-gray-400'
                  }`} 
                />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}