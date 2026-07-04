import React from 'react'
import Link from 'next/link'
import ButtonReasuble from '@/components/buttonreasuble/ButtonReasuble'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

function EmptyPengumuman() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-6 bg-gradient-to-b from-white to-slate-50/50 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

          
            <div className="relative mb-8 transform transition-transform hover:scale-110 duration-500 ease-out z-10">
                <Image 
                    src="/images/EmptyPengumuman.png" 
                    alt="Tidak ada pengumuman" 
                    width={280} 
                    height={280} 
                    className="object-contain drop-shadow-2xl"
                    priority
                />
            </div>

            {/* Text Content */}
            <div className="text-center mb-10 relative z-10">
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                    Belum Ada Pengumuman
                </h3>
                <p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed font-medium">
                    Pengumuman hasil seleksi akan diinformasikan pada jadwal yang telah ditentukan. Silakan pantau halaman ini secara berkala.
                </p>
            </div>

            {/* Action Button */}
            <Link href="/user/dashboard" className="relative z-10">
                <ButtonReasuble
                    variant="primary"
                    className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-200/50 active:scale-95"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Kembali Ke Dashboard</span>
                </ButtonReasuble>
            </Link>
        </div>
    )
}

export default EmptyPengumuman