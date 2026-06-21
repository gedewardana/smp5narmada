import React from 'react'
import Link from 'next/link'
import ButtonReasuble from '@/components/buttonreasuble/ButtonReasuble'
import { ArrowLeft, BellOff } from 'lucide-react'

function EmptyPengumuman() {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            {/* Visual Element */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50" />
                <div className="relative bg-blue-50 p-6 rounded-full">
                    <BellOff className="w-12 h-12 text-blue-500" strokeWidth={1.5} />
                </div>
            </div>

            {/* Text Content */}
            <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    Belum Ada Pengumuman
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                    Pengumuman hasil seleksi akan di umumkan pada tanggal yang telah ditentukan.
                </p>
            </div>

            {/* Action Button */}
            <Link href="/user/dashboard">
                <ButtonReasuble
                    variant="primary"
                    className="flex items-center gap-2 px-6 py-2.5 transition-transform hover:scale-105"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali Ke Dashboard</span>
                </ButtonReasuble>
            </Link>
        </div>
    )
}

export default EmptyPengumuman