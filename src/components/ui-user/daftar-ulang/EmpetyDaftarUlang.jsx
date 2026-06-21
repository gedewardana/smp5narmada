import React from 'react'
import ButtonReasuble from '@/components/buttonreasuble/ButtonReasuble'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

function EmpetyDaftarUlang() {
    return (
        <div>
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-lg border border-dashed border-gray-300">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">📝</span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                    Daftar Ulang Belum Tersedia
                </h3>

                <p className="text-gray-500 text-center max-w-md mb-8">
                    Halaman hanya untuk pendaftar status pengumumuman diterima.
                </p>
                <Link href="/user/dashboard">
                    <ButtonReasuble
                        variant="primary"
                        size="sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Kembali Ke Dashboard
                    </ButtonReasuble>
                </Link>


            </div>
        </div>
    )



}

export default EmpetyDaftarUlang