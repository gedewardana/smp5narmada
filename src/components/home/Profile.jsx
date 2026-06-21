'use client'
import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Award } from 'lucide-react'
import Link from 'next/link'
import SectionLabel from './SectionLabel'
import SectionHeading from './SectionHeading'
import StatPill from './StatPill'


export default function ProfilePage() {


    return (
        <div className="min-h-screen bg-[#f8faf8] font-sans">

            {/* ── HERO ── */}
            <section
                className="relative pt-8 pb-16 overflow-hidden"

            >

                <div
                    className="absolute bottom-0 left-0 w-64 h-64 opacity-5 pointer-events-none rounded-full"
                    style={{
                        background: 'radial-gradient(circle, #fbbf24, transparent 70%)'
                    }}
                />
                <div className="container mx-auto px-4 lg:px-10 relative z-10">
                    {/* breadcrumb */}
                    <nav className="flex items-center gap-2 mb-8 text-[13px]">
                        <Link
                            href="/"
                            className="text-emerald-600 hover:text-emerald-800 flex items-center gap-1 transition-colors font-medium"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Beranda
                        </Link>
                        <span className="text-gray-300">·</span>
                        <span className="text-gray-500">Profil Sekolah</span>
                    </nav>

                    <div className="">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <SectionLabel>✦ Sejarah</SectionLabel>
                                <SectionHeading highlight="SMP Negeri 5 Narmada" />

                                <div className="space-y-4 text-slate-600 text-[0.925rem] leading-[1.8]">
                                    <p>
                                        SMP Negeri 5 Narmada didirikan pada <strong className="text-slate-800 font-bold">13 September 2011</strong> sebagai bagian dari upaya pemerintah daerah memperluas akses pendidikan berkualitas di Kecamatan Narmada, Kabupaten Lombok Barat.
                                    </p>
                                    <p>
                                        Berawal dari gedung sederhana dengan beberapa ruang kelas dan tenaga pengajar terbatas, sekolah ini berkembang pesat menjadi salah satu SMP unggulan di wilayah Lombok Barat dengan 443 siswa aktif dan 27 tenaga pengajar.
                                    </p>
                                    <p>
                                        Dalam perjalanannya, SMP Negeri 5 Narmada terus berkomitmen meningkatkan kualitas pendidikan dengan mengikuti perkembangan teknologi dan metode pembelajaran modern, sambil mempertahankan nilai-nilai luhur budaya lokal.
                                    </p>
                                </div>

                                <div className="mt-10 grid grid-cols-3 gap-4">
                                    {[
                                        { value: '2011', label: 'Tahun Berdiri', bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
                                        { value: '443', label: 'Siswa Aktif', bg: '#fffbeb', text: '#92400e', border: '#fcd34d' },
                                        { value: '27', label: 'Tenaga Pengajar', bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
                                    ].map((s) => (
                                        <StatPill key={s.label} {...s} />
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                {/* decorative frame */}
                                <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl border-2 border-emerald-200 pointer-events-none z-0" />

                                <img
                                    src="/gm1.png"
                                    alt="Gedung SMP Negeri 5 Narmada"
                                    className="relative z-10 rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]"
                                />

                                {/* floating badge */}
                                <div className="absolute z-20 -bottom-5 -right-5 bg-white rounded-2xl px-5 py-4 shadow-xl border border-slate-100 flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
                                        <Award className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 text-sm">Terakreditasi B</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">BAN-S/M · 2015</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg
                        viewBox="0 0 1440 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full"
                    >
                        <path
                            d="M0 32L60 26.7C120 21.3 240 10.7 360 10.7C480 10.7 600 21.3 720 24C840 26.7 960 21.3 1080 18.7C1200 16 1320 16 1380 16L1440 16V32H1380C1320 32 1200 32 1080 32C960 32 840 32 720 32C600 32 480 32 360 32C240 32 120 32 60 32H0Z"
                            fill="#f9fafb"
                        />
                    </svg>
                </div>
            </section>
        </div>
    )
}