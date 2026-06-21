import React from 'react'
import Link from 'next/link'
import { FileText, } from 'lucide-react'
import ButtonReasuble from '@/components/buttonreasuble/ButtonReasuble'

function RejectedView() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-red-50 rounded-lg border border-red-200">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">🚫</span>
            </div>

            <h3 className="text-2xl font-bold text-red-800 mb-3 text-center">
                Mohon Maaf
            </h3>

            <p className="text-gray-700 text-center max-w-lg mb-8 leading-relaxed">
                Berdasarkan hasil pengumuman, Anda dinyatakan <strong className="text-red-700">TIDAK DITERIMA</strong>.
                <br />
                Oleh karena itu, Anda tidak dapat mengakses halaman Daftar Ulang saat ini.
            </p>

            <Link href="/user/dashboard/pengumuman">
                <ButtonReasuble
                    variant="outline"
                    size="sm"

                >
                    <FileText className='w-4 h-4 mr-2' />
                    Lihat Detail Pengumuman
                </ButtonReasuble>
            </Link>
        </div>
    )
}

export default RejectedView
