'use client'

import { MapPin, Phone, Mail, Clock, ExternalLink, Navigation } from 'lucide-react'

const contactInfo = [
  {
    icon: MapPin,
    color: 'blue',
    label: 'Alamat Sekolah',
    lines: ['Jl. Pendidikan No. 25,', 'Narmada, Lombok Barat, NTB 83370'],
  },
  {
    icon: Phone,
    color: 'green',
    label: 'Telepon / WhatsApp',
    lines: ['(0370) 123456', '0812-3456-7890 (WhatsApp)'],
  },
  {
    icon: Mail,
    color: 'purple',
    label: 'Email',
    lines: ['pmb@smpn5narmada.sch.id', 'info@smpn5narmada.sch.id'],
  },
  {
    icon: Clock,
    color: 'orange',
    label: 'Jam Operasional',
    lines: ['Senin – Jumat: 07.00 – 15.00 WIB', 'Sabtu: 07.00 – 12.00 WIB'],
  },
]

const colorMap = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   ring: 'ring-blue-100',   dot: 'bg-blue-500' },
  green:  { bg: 'bg-green-50',  icon: 'text-green-600',  ring: 'ring-green-100',  dot: 'bg-green-500' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', ring: 'ring-purple-100', dot: 'bg-purple-500' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', ring: 'ring-orange-100', dot: 'bg-orange-500' },
}

export default function Contact() {
  const mapsUrl =
    'https://www.google.com/maps/search/?api=1&query=SMPN+5+Narmada+Lombok+Barat'

  return (
    <section id="kontak" className="py-16 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Header ─── */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4 tracking-wide">
            📍 Lokasi & Kontak
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
            Hubungi Kami
          </h2>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
            Tim PMB siap membantu Anda selama proses pendaftaran berlangsung.
          </p>
        </div>

        {/* ─── Main Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">

          {/* ─── Contact Cards ─── */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {contactInfo.map(({ icon: Icon, color, label, lines }) => {
              const c = colorMap[color]
              return (
                <div
                  key={label}
                  className="group flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-4 sm:p-5
                             shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div
                    className={`shrink-0 w-11 h-11 ${c.bg} ring-1 ${c.ring} rounded-xl
                                flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <Icon className={`w-5 h-5 ${c.icon}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      {label}
                    </p>
                    {lines.map((line, i) => (
                      <p key={i} className="text-sm text-gray-700 leading-snug">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ─── Map Area ─── */}
          <div className="lg:col-span-3 flex flex-col gap-3">

            {/* Map container */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-md border border-gray-100"
                 style={{ minHeight: '300px', height: 'clamp(280px, 45vw, 440px)' }}>

              <iframe
                title="Lokasi SMPN 5 Narmada"
                src="https://www.google.com/maps?q=SMPN+5+Narmada&output=embed"
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Gradient overlay – bottom only */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20
                              bg-gradient-to-t from-black/30 to-transparent" />

              {/* Location badge – mobile-safe positioning */}
              <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto sm:bottom-4
                              bg-white/95 backdrop-blur-sm rounded-xl shadow-lg
                              px-3 py-2.5 sm:px-4 sm:py-3 flex items-start gap-3 sm:max-w-xs">
                <div className="shrink-0 mt-0.5 w-8 h-8 bg-blue-600 rounded-lg
                                flex items-center justify-center shadow-sm">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 leading-tight">SMPN 5 Narmada</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                    Jl. Pendidikan No. 25, Narmada,<br className="hidden sm:block" />
                    Lombok Barat, NTB 83370
                  </p>
                </div>
              </div>
            </div>

            {/* Open in Maps button */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-5
                         bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                         text-white text-sm font-semibold rounded-xl
                         shadow-sm hover:shadow-md transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              <Navigation className="w-4 h-4" />
              Buka di Google Maps
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}