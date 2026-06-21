import React from 'react'

function Header({ tahunAjaran }) {
    return (
        <div className="text-center p-6 bg-white">
            <h1 className="text-lg font-bold uppercase tracking-wide text-gray-900">
                Laporan Penerimaan Murid Baru
            </h1>
            <h2 className="text-base font-semibold text-gray-700 uppercase mt-1">
                SMP Negeri 5 Narmada
            </h2>
            <h3 className="text-base font-semibold text-gray-700 uppercase mt-1">
                Tahun Pelajaran {tahunAjaran || '-'}
            </h3>

            {/* Garis horizontal */}
            <div className="border-b-2 border-gray-900 w-full mx-auto mt-4"></div>
        </div>
    )
}

export default Header