'use client'

import { CalendarDays, FileText, Bell } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function TimeLine({ jadwal }) {
    const formatDate = (date) => {
        if (!date) return '—'
        try {
            return format(new Date(date), 'dd MMMM yyyy', { locale: id })
        } catch (e) {
            return '—'
        }
    }

    const formatRange = (start, end) => {
        if (!start || !end) return '—'
        try {
            const startDate = new Date(start)
            const endDate = new Date(end)

            // Jika bulan sama, perpendek tampilan
            if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
                return `${format(startDate, 'dd', { locale: id })} - ${format(endDate, 'dd MMMM yyyy', { locale: id })}`
            }

            return `${format(startDate, 'dd MMM', { locale: id })} - ${format(endDate, 'dd MMM yyyy', { locale: id })}`
        } catch (e) {
            return '—'
        }
    }

    const steps = [
        {
            id: 'pendaftaran',
            icon: FileText,
            date: formatRange(jadwal?.pendaftaran_mulai, jadwal?.pendaftaran_selesai),
            title: 'Pendaftaran Online',
            description: 'Mengisi formulir pendaftaran dan mengunggah dokumen persyaratan melalui website resmi.',
            status: 'upcoming',
        },
        {
            id: 'pengumuman',
            icon: Bell,
            date: formatDate(jadwal?.pengumuman),
            title: 'Pengumuman Online',
            description: 'Hasil seleksi diumumkan melalui website dan papan pengumuman sekolah.',
            status: 'upcoming',
        },
        {
            id: 'daftar-ulang',
            icon: CalendarDays,
            date: formatRange(jadwal?.pendaftaran_ulang_mulai, jadwal?.pendaftaran_ulang_selesai),
            title: 'Daftar Ulang',
            description: 'Siswa diterima melakukan daftar ulang dengan melengkapi berkas administrasi.',
            status: 'upcoming',
        },
    ]

    return (
        <section id="jadwal" className="py-20 lg:py-32 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
                    <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4 tracking-wide">
                        Informasi Jadwal
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
                        Jadwal Pendaftaran PMB
                    </h2>
                    <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
                        Ikuti alur pendaftaran dengan memperhatikan timeline berikut untuk kelancaran proses seleksi.
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200" />

                    <div className="space-y-8 md:space-y-12">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Content */}
                                <div className="flex-1 md:text-right">
                                    <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${index % 2 === 0 ? 'md:ml-12' : 'md:mr-12'
                                        }`}>
                                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full mb-3">
                                            {step.date}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Center Icon */}
                                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white border-4 border-blue-100 rounded-full items-center justify-center z-10">
                                    <step.icon className="w-5 h-5 text-blue-600" />
                                </div>

                                {/* Spacer for opposite side */}
                                <div className="flex-1 hidden md:block" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}