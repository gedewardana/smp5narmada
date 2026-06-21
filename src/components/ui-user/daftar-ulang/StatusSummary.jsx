'use client'
import { XCircle, FileText, Clock } from 'lucide-react'

function StatusSummary({ statusDaftarUlang, berkasList }) {
    const getStatusDaftarUlangBadge = (status) => {

    }

    const totalBerkas = berkasList.length
    const uploadedBerkas = berkasList.filter(b => b.nama_file && b.path_file).length


    const progress = (uploadedBerkas / totalBerkas) * 100


    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
            {/* Header with Status */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Status Daftar Ulang</h2>

            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">

                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-sm opacity-90 mb-1">Status Daftar Ulang</p>
                    <p className="text-xl font-bold text-white">{statusDaftarUlang}</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-sm opacity-90 mb-1">Total Berkas</p>
                    <p className="text-3xl font-bold">{totalBerkas}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-sm opacity-90 mb-1">Sudah Upload</p>
                    <p className="text-3xl font-bold">{uploadedBerkas}</p>
                </div>

            </div>

            {/* Progress Bar */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Progress Upload</span>
                    <span className="text-sm font-semibold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-white h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    )
}

export default StatusSummary
