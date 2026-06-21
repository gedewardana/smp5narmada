'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import SignatureCanvas from '@/components/ui-user/pendaftaran/form/SignatureCanvas'

function page() {
    const router = useRouter()

    const handleSaveSignature = (dataURL) => {
        // Simpan Gambar Ke Localstorage Dengan Key ttd_signature
        localStorage.setItem('ttd_signature', dataURL)
        // Arahkan pengguna kembali ke ringkasan-formulir
        router.push('/user/dashboard/pendaftaran/ringkasan-data')
    }

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tanda Tangan Digital</h2>
            <SignatureCanvas onSave={handleSaveSignature} />
            <button
                onClick={() => router.back()}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
                Kembali
            </button>
        </div>
    )
}

export default page