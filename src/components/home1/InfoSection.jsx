'use client'

import { BookOpen, Shield, Lightbulb, Heart, Target, Rocket, CheckCircle2 } from 'lucide-react'

export default function InfoSection() {
    const features = [
        {
            icon: BookOpen,
            title: 'Kurikulum Merdeka',
            description: 'Implementasi kurikulum terbaru dengan pendekatan pembelajaran yang fleksibel dan berorientasi pada pengembangan karakter siswa.',
            color: 'bg-blue-50 text-blue-600',
        },
        {
            icon: Shield,
            title: 'Lingkungan Aman',
            description: 'Kampus yang aman, nyaman, dan mendukung dengan sistem keamanan 24 jam untuk kenyamanan belajar.',
            color: 'bg-green-50 text-green-600',
        },
        {
            icon: Lightbulb,
            title: 'Fasilitas Modern',
            description: 'Laboratorium lengkap, perpustakaan digital, dan ruang kelas ber-AC dengan teknologi pembelajaran terkini.',
            color: 'bg-purple-50 text-purple-600',
        },
        {
            icon: Heart,
            title: 'Bimbingan Karakter',
            description: 'Program pembinaan karakter dan ekstrakurikuler beragam untuk mengembangkan potensi siswa secara holistik.',
            color: 'bg-rose-50 text-rose-600',
        },
    ]

    const misi = [
        "1.	Meningkatkan penghayatan dan penglaman ajaran agama yang dianut dan etika, sehingga menjadi sumber keharifan dan bertindak.",
        "2.	Membiasakan warga sekolah untuk berdisiplin dan berbudi pekerti luhur lewat ketedalanan sikap dan perilaku serta tindakan.",
        "3.	Melaksanakan pembelajaran yang efektif dan berorientasi pada perkembangan peserta didik secara optimal sesuai dengan potensi yang dimilikinya.",
        "4.	Menumbuhkan semangat untuk berprestasi bagi semua warga sekolah.",
        "5.	Mengintergrasikan pendidikan dan keterampilan pada mata pelajaran muatan dan extrakurikuler."
    ]

    return (
        <section id="visimisi" className="py-20 lg:py-32 bg-gray-50 animate-fade-in space-y-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
                    <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4 tracking-wide">
                        Visi & Misi
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
                        Visi & Misi
                    </h2>
                    <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
                        SMP Negeri 5 Narmada senantiasa berusaha memberikan yang terbaik bagi para siswa dan masyarakat. Berikut adalah Visi & Misi SMP Negeri 5 Narmada:
                    </p>
                </div>

                {/* <div className="grid lg:grid-cols-2 gap-12 items-center mb-32 bg-white p-8 lg:p-12 rounded-3xl shadow-sm border border-gray-100">
                    <div className="relative">
                        <div className="aspect-[4/5] rounded-2xl bg-gray-200 overflow-hidden relative z-10">
                            <img 
                                src="/kepala.png" 
                                alt="Kepala Sekolah SMPN 5 Narmada" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600 rounded-2xl -z-0 hidden md:block"></div>
                    </div>
                    <div className="space-y-6">
                        <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold tracking-wide uppercase">
                            Sambutan Kepala Sekolah
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                            Membangun Generasi Cerdas dan Berkarakter
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            "Selamat datang di SMP Negeri 5 Narmada. Kami percaya bahwa setiap anak memiliki potensi unik yang harus diasah dengan kasih sayang dan disiplin. Bersama seluruh staf pengajar, kami berkomitmen untuk menciptakan lingkungan belajar yang inspiratif dan inovatif."
                        </p>
                        <div>
                            <p className="font-bold text-xl text-gray-900">Nama Kepala Sekolah, S.Pd., M.Pd.</p>
                            <p className="text-gray-500">Kepala Sekolah SMPN 5 Narmada</p>
                        </div>
                    </div>
                </div> */}

                {/* --- BAGIAN VISI & MISI --- */}
                <div className="grid lg:grid-cols-2 gap-8 mb-32">

                    <div className="bg-blue-600 rounded-3xl p-8 lg:p-12 text-white flex flex-col justify-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Visi Kami</h2>
                        <p className="text-xl text-blue-50 leading-relaxed italic">
                            "Beriman, berbudi luhur berprestasi dan berjiwa mandiri."
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                            <Rocket className="w-8 h-8 text-orange-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Misi Kami</h2>
                        <ul className="space-y-4">
                            {misi.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                                    <p className="text-gray-600 text-lg">{item}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* --- BAGIAN FITUR/KEUNGGULAN (Kode Asal) --- */}
                {/* <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Mengapa Memilih SMP Negeri 5 Narmada?
                    </h2>
                    <p className="text-lg text-gray-600">
                        Kami berkomitmen memberikan pendidikan berkualitas yang membentuk generasi unggul, berkarakter, dan siap menghadapi tantangan masa depan.
                    </p>
                </div> */}

                {/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
                        >
                            <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div> */}
            </div>
        </section>
    )
}