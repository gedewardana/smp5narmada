"use client"
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'
import SectionLabel from './SectionLabel'
import SectionHeading from './SectionHeading'
import StatPill from './StatPill'


export default function TabsProfile({ facilities, teachers, staffStats, extracurriculars, identitasData, tujuan, misiList }) {
    const [activeTab, setActiveTab] = useState('identitas')
    const TABS = [

        { value: 'identitas', label: 'Identitas' },
        { value: 'visimisi', label: 'Visi & Misi' },
        { value: 'kepala', label: 'Kepala Sekolah' },
        { value: 'fasilitas', label: 'Fasilitas' },
        { value: 'guru', label: 'Tenaga Pendidik' },
        { value: 'ekskul', label: 'Ekstrakurikuler' },
    ]

    return (
        <div>
            <section className="py-12">
                <div className="container mx-auto px-4 lg:px-10">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

                        {/* Tab Nav */}
                        {/* Tab Nav - Version 1: Centered dengan glassmorphism effect */}
                        <div className="sticky top-4 z-30 mb-10">
                            <div className="max-w-3xl mx-auto">
                                <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-full p-1.5 shadow-lg shadow-slate-200/50">
                                    <div className="overflow-x-auto scrollbar-none">
                                        <TabsList className="inline-flex w-full justify-between bg-transparent p-0 gap-1">
                                            {TABS.map((t) => (
                                                <TabsTrigger
                                                    key={t.value}
                                                    value={t.value}
                                                    className="flex-1 px-5 py-2.5 text-[13px] font-semibold whitespace-nowrap rounded-full text-slate-500
                                data-[state=active]:bg-emerald-600 data-[state=active]:text-white
                                data-[state=active]:shadow-md transition-all duration-300 ease-out
                                hover:text-emerald-600 hover:bg-emerald-50/50"
                                                >
                                                    {t.label}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* ── TAB: IDENTITAS ── */}
                        <TabsContent value="identitas" className="mt-0 animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <div className="grid lg:grid-cols-5 gap-10">

                                {/* Identitas list — 3 cols */}
                                <div className="lg:col-span-3">
                                    <SectionLabel>📋 Informasi Resmi</SectionLabel>
                                    <SectionHeading pre="Identitas" highlight="Sekolah" />

                                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                        {identitasData.map((row, i) => (
                                            <div
                                                key={i}
                                                className={`flex items-start gap-4 px-6 py-4 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} ${i < identitasData.length - 1 ? 'border-b border-slate-100' : ''}`}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[13px] font-bold text-slate-800 tracking-wider mb-0.5">{row.label} : <span className="text-slate-600 font-normal">{row.value}</span> </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Peta — 2 cols */}
                                <div className="lg:col-span-2">
                                    <SectionLabel>📍 Lokasi</SectionLabel>
                                    <SectionHeading pre="Peta" highlight="Lokasi" />

                                    <div className="rounded-3xl overflow-hidden shadow-md border border-slate-200 h-72 bg-slate-100">
                                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.2078387713864!2d116.23440637561352!3d-8.576004787022624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dcdc8021845312f%3A0x799a17d3ed05fefc!2sSmp%20Negeri%205%20Narmada!5e0!3m2!1sen!2sus!4v1774795506231!5m2!1sen!2sus"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade">
                                        </iframe>
                                    </div>

                                    <div className="mt-4 bg-white border border-slate-200 rounded-2xl px-4 py-4 flex items-center justify-between gap-4 shadow-sm">

                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
                                                Jl. Suranadi 2, Narmada, Lombok Barat, NTB
                                            </p>
                                        </div>

                                        <a
                                            href="https://www.google.com/maps?q=-8.576004787022624,116.23440637561352"
                                            target="_blank"
                                            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition whitespace-nowrap"
                                        >
                                            Maps →
                                        </a>

                                    </div>

                                </div>
                            </div>
                        </TabsContent>

                        {/* ── TAB: VISI & MISI ── */}
                        <TabsContent value="visimisi" className="mt-0 animate-in slide-in-from-bottom-4 fade-in duration-500">

                            {/* Visi + Misi side by side */}
                            <div className="mb-12">
                                <div className="bg-emerald-800 rounded-3xl p-8 md:p-12 text-white">

                                    {/* Visi */}
                                    <div className="text-center mb-10">
                                        <h2 className="text-2xl font-bold mb-4">Visi</h2>
                                        <p className="text-lg italic">"Beriman, berbudi luhur berprestasi dan berjiwa mandiri"</p>
                                    </div>

                                    <hr className="border-white/20 mb-10" />

                                    {/* Misi */}
                                    <div>
                                        <h2 className="text-2xl font-bold text-center mb-4">Misi</h2>
                                        <p className="text-center text-white/80 mb-6">
                                            Sekolah menyiapkan peserta didik menjadi generasi yang beriman, bertakwa,
                                            unggul dan berprestasi dalam bidang akademik dan non akademik serta
                                            berbudi pekerti luhur dan berjiwa mandiri.
                                        </p>

                                        <ol className="space-y-3 max-w-2xl mx-auto">
                                            {misiList.map((item, i) => (
                                                <li key={i} className="flex gap-3">
                                                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                        {i + 1}
                                                    </span>
                                                    <span className="text-white/90">{item}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>

                                </div>
                            </div>

                            {/* Tujuan */}
                            <div>
                                <div className="text-center mb-8">
                                    <SectionLabel>🎯 Tujuan</SectionLabel>
                                    <h3 className="text-2xl font-black text-slate-900">
                                        Tujuan <span className="text-emerald-600">Sekolah</span>
                                    </h3>
                                </div>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {tujuan.map((item, i) => (
                                        <div key={i} className="group bg-white border border-slate-200 rounded-3xl p-6 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                                            <div className="text-4xl mb-4">{item.emoji}</div>
                                            <h4 className="font-black text-slate-900 text-[0.9rem] mb-2">{item.title}</h4>
                                            <p className="text-[0.82rem] text-slate-500 leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        {/* ── TAB: KEPALA SEKOLAH ── */}
                        <TabsContent value="kepala" className="mt-0 animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <div className="grid lg:grid-cols-5 gap-12 items-start">

                                {/* Photo — 2 cols */}
                                <div className="lg:col-span-2 relative">
                                    <div className="absolute -top-3 -left-3 w-full h-full rounded-3xl border-2 border-emerald-200 z-0 pointer-events-none" />
                                    <img
                                        src="/Kepala.png"
                                        alt="Kepala Sekolah"
                                        className="relative z-10 rounded-3xl shadow-2xl w-full object-cover aspect-[3/4]"
                                    />
                                    <div className="absolute z-20 bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-slate-100">
                                        <p className="font-black text-slate-900">Kadar Kencana, S.Pd</p>
                                        <p className="text-[12px] text-slate-500 mt-0.5">Kepala SMP Negeri 5 Narmada</p>
                                    </div>
                                </div>

                                {/* Sambutan — 3 cols */}
                                <div className="lg:col-span-3">
                                    <SectionLabel>👤 Sambutan</SectionLabel>
                                    <SectionHeading pre="Sambutan" highlight="Kepala Sekolah" />

                                    <div className="space-y-4 text-slate-600 text-[0.925rem] leading-[1.8]">
                                        <p className="font-semibold text-slate-700">Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
                                        <p>
                                            Puji syukur kita panjatkan kehadirat Allah SWT atas segala limpahan rahmat dan karunia-Nya. Selamat datang di website resmi SMP Negeri 5 Narmada.
                                        </p>
                                        <p>
                                            SMP Negeri 5 Narmada berkomitmen memberikan pendidikan berkualitas yang tidak hanya fokus pada aspek akademik, tetapi juga pembentukan karakter dan pengembangan bakat siswa. Kami percaya setiap anak memiliki potensi unik yang perlu dikembangkan secara optimal.
                                        </p>
                                        <p>
                                            Dengan dukungan tenaga pendidik yang profesional dan fasilitas yang memadai, kami siap membimbing generasi muda menuju masa depan yang gemilang. Mari bersama-sama kita wujudkan pendidikan berkualitas untuk bangsa.
                                        </p>
                                        <p className="font-semibold text-slate-700">Wassalamu'alaikum Warahmatullahi Wabarakatuh.</p>
                                    </div>

                                    <div className="mt-8 flex items-center gap-4 pt-6 border-t border-slate-100">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black"
                                            style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
                                            A
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900">Aendi</p>
                                            <p className="text-[13px] text-emerald-600 font-semibold">Kepala SMP Negeri 5 Narmada</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* ── TAB: FASILITAS ── */}
                        <TabsContent value="fasilitas" className="mt-0 animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                                <div>
                                    <SectionLabel>🏫 Fasilitas</SectionLabel>
                                    <SectionHeading pre="Fasilitas" highlight="Pendukung" sub="Kami menyediakan fasilitas lengkap untuk mendukung proses pembelajaran yang optimal." />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                                {facilities.map((f, i) => (
                                    <div key={i} className="group bg-white border border-slate-200 rounded-3xl p-6 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                                            style={{ background: `${f.accent}18`, color: f.accent }}>
                                            <f.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-[0.95rem] font-black text-slate-900 mb-1.5">{f.title}</h3>
                                        <p className="text-[0.85rem] text-slate-500 leading-relaxed">{f.desc}</p>

                                        {/* accent line */}
                                        <div className="mt-4 h-0.5 w-8 rounded-full transition-all duration-300 group-hover:w-full"
                                            style={{ background: f.accent }} />
                                    </div>
                                ))}
                            </div>

                            {/* Gallery */}
                            <div className="grid md:grid-cols-3 gap-4">
                                {[
                                    { src: '/f1.jpg', alt: 'Lab Komputer' },
                                    { src: '/Perpus.jpg', alt: 'Perpustakaan' },
                                    { src: '/science-lab.jpg', alt: 'Lab Sains' },
                                ].map((img) => (
                                    <div key={img.alt} className="relative group overflow-hidden rounded-2xl shadow-sm border border-slate-100">
                                        <img
                                            src={img.src}
                                            alt={img.alt}
                                            className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <span className="text-white text-[0.85rem] font-bold">{img.alt}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        {/* ── TAB: TENAGA PENDIDIK ── */}
                        <TabsContent value="guru" className="mt-0 animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                                <div>
                                    <SectionLabel>👩‍🏫 Tenaga Pendidik</SectionLabel>
                                    <SectionHeading pre="Guru &" highlight="Staff" sub="Tenaga pendidik profesional yang berdedikasi untuk memberikan pendidikan terbaik bagi siswa." />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                                {teachers.map((t, i) => (
                                    <div key={i} className="group bg-white border border-slate-200 rounded-3xl p-5 hover:border-emerald-200 hover:shadow-md transition-all duration-200 flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-black text-lg"
                                            style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
                                            {t.initials}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-slate-900 text-[0.875rem] leading-snug truncate">{t.name}</h4>
                                            <p className="text-[12px] text-emerald-600 font-semibold mt-0.5">{t.position}</p>
                                            {t.subject && (
                                                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{t.subject}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Staff stats */}
                            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {staffStats.map((s) => <StatPill key={s.label} {...s} />)}
                            </div> */}
                        </TabsContent>

                        {/* ── TAB: EKSTRAKURIKULER ── */}
                        <TabsContent value="ekskul" className="mt-0 animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                                <div>
                                    <SectionLabel>⭐ Ekstrakurikuler</SectionLabel>
                                    <SectionHeading pre="Kegiatan" highlight="Ekstrakurikuler" sub="Berbagai kegiatan untuk mengembangkan bakat dan minat siswa di luar akademik." />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
                                {extracurriculars.map((e, i) => (
                                    <div key={i} className="group bg-white border border-slate-200 rounded-3xl p-4 text-center hover:border-emerald-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-default">
                                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">{e.emoji}</div>
                                        <h4 className="font-bold text-slate-900 text-[0.8rem] leading-snug">{e.name}</h4>
                                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide">{e.category}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Jadwal banner */}
                            <div className="relative overflow-hidden rounded-3xl p-8 md:p-10"
                                style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)' }}>
                                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

                                <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
                                    <div>
                                        <p className="text-[11px] text-emerald-300 font-bold tracking-widest uppercase mb-3">Jadwal</p>
                                        <h3 className="text-2xl font-black text-white mb-4">Jadwal Ekstrakurikuler</h3>
                                        <p className="text-white/80 text-[0.875rem] leading-relaxed mb-6">
                                            Kegiatan ekstrakurikuler dilaksanakan setiap hari <strong className="text-white">Sabtu</strong>, pukul{' '}
                                            <strong className="text-white">08.00 – 10.00 WITA</strong>. Siswa dapat memilih kegiatan sesuai minat dan bakat masing-masing.
                                        </p>
                                        {/* <button className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold text-[0.875rem] px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm">
                                            Lihat Jadwal Lengkap
                                            <ChevronRight className="w-4 h-4" />
                                        </button> */}
                                    </div>

                                    <img
                                        src="/Extra1.jpg"
                                        alt="Kegiatan Ekstrakurikuler"
                                        className="rounded-2xl shadow-xl w-full object-cover aspect-video"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                    </Tabs>
                </div>
            </section>
            //
        </div>
    )
}
