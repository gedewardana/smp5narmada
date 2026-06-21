'use client'

import { CheckCircle, FileText, CreditCard, Image as ImageIcon, Award } from 'lucide-react'

export default function Requirements() {
  const documents = [
    { icon: FileText, text: 'Akta Kelahiran (scan asli)' },
    { icon: FileText, text: 'Kartu Keluarga (KK) (scan)' },
    { icon: CreditCard, text: 'Kartu Tanda Penduduk (KTP) Orang Tua/Wali (scan)' },
    { icon: Award, text: 'Surat Keterangan Lulus (SKL) SD/MI (scan)' },
    { icon: Award, text: 'Fotocopy Kartu Indonesia Pintar (KIP) (jika ada)' },
    { icon: Award, text: 'Piagam/Sertifikat Penghargaan (jika ada)' }
    
  ]

  const criteria = [
    'Lulusan SD/MI/sederajat tahun 2026 atau sebelumnya',
    'Usia maksimal 13 tahun per 1 Juli 2026',
    'Berstatus WNI atau berizin tinggal di Indonesia',
    'Sehat jasmani dan rohani',
    'Tinggal di wilayah zonasi SMP Negeri 5 Narmada',
  ]

  return (
    <section id="persyaratan" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium uppercase tracking-wider text-sm mb-4">
            Informasi
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Persyaratan Pendaftaran
          </h2>
          <p className="text-lg text-gray-600">
            Pastikan Anda memenuhi kriteria dan menyiapkan dokumen berikut sebelum mendaftar.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Criteria */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              Kriteria Peserta
            </h3>
            <ul className="space-y-4">
              {criteria.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              Dokumen yang Diperlukan
            </h3>
            <ul className="space-y-4">
              {documents.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all hover:shadow-xl hover:shadow-blue-600/20"
          >
            Siap Mendaftar?
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Klik Disini</span>
          </a>
        </div>
      </div>
    </section>
  )
}