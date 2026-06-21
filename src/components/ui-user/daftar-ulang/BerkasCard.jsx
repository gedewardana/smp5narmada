'use client'
import { X, Check, Eye, Trash2 } from 'lucide-react'

/**
 * BerkasCard - Card untuk upload berkas daftar ulang
 */
function BerkasCard({ berkas, onUpload, onDelete }) {
    const getStatusBadge = (status) => {
        const badges = {
            'BELUM_DIUNGGAH': { bg: 'bg-red-100', text: 'text-red-800', label: 'Belum Diunggah', icon: <X /> },
            'DIUNGGAH': { bg: 'bg-green-100', text: 'text-green-800', label: 'Diunggah', icon: <Check /> },
        }
        return badges[status] || badges['BELUM_DIUNGGAH']
    }

    const getJenisLabel = (jenis) => {
        const labels = {
            'SURAT_TERIMA': 'Surat Penerimaan',
            'PERNYATAAN_ORTU': 'Surat Pernyataan Orang Tua',
            'PERNYATAAN_SISWA': 'Surat Pernyataan Siswa'
        }
        return labels[jenis] || jenis
    }

    const statusBadge = getStatusBadge(berkas.status_verifikasi)
    const isUploaded = berkas.nama_file && berkas.path_file

    return (
        <div className="group flex flex-col bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 hover:border-blue-300 transition-colors">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {getJenisLabel(berkas.jenis_berkas_daftar_ulang)}
                    </h3>
                    {berkas.mandatory && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-semibold">
                            Wajib
                        </span>
                    )}
                </div>
                <span className={`px-2 py-0 rounded-full text-sm font-semibold ${statusBadge.bg} ${statusBadge.text} flex items-center gap-2`}>
                    <span>{statusBadge.icon}</span>
                    <span>{statusBadge.label}</span>
                </span>
            </div>

            {/* File Info or Upload */}
            {isUploaded ? (
                <div className="space-y-3">
                    {/* File Name */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700 flex-1">{berkas.nama_file}</span>
                    </div>

                    {/* Upload Date */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Diunggah Pada: {new Date(berkas.diunggah_pada).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        {/* {berkas.diperbaharui_pada && (
                            <span>Diperbarui: {new Date(berkas.diperbaharui_pada).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        )} */}
                    </div>

                    {/* Catatan Verifikasi */}
                    {berkas.catatan_verifikasi && (
                        <div className={`p-4 border-l-4 rounded ${berkas.status_verifikasi === 'DITOLAK'
                            ? 'bg-red-50 border-red-500'
                            : 'bg-yellow-50 border-yellow-500'
                            }`}>
                            <p className={`text-sm font-semibold mb-1 ${berkas.status_verifikasi === 'DITOLAK' ? 'text-red-800' : 'text-yellow-800'
                                }`}>
                                {berkas.status_verifikasi === 'DITOLAK' ? '❌ Alasan Penolakan:' : '📝 Catatan Verifikasi:'}
                            </p>
                            <p className={`text-sm ${berkas.status_verifikasi === 'DITOLAK' ? 'text-red-700' : 'text-yellow-700'
                                }`}>
                                {berkas.catatan_verifikasi}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="hidden justify-end -mt-10 gap-2 pt-2 group-hover:flex transition-all duration-200 ">
                        <button
                            title="Lihat Berkas"
                            onClick={() => window.open(berkas.path_file, '_blank')}
                            className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        {berkas.status_verifikasi !== 'DIVERIFIKASI' && (
                            <>

                                <button
                                    title="Hapus Berkas"
                                    onClick={() => onDelete(berkas.jenis_berkas_daftar_ulang)}
                                    className="px-4 py-2 bg-white text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-3">
                        Upload file dalam format PDF, JPG, atau PNG (maksimal 2MB)
                    </p>
                    <label className="block">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-sm font-semibold text-gray-700 mb-1">Klik untuk upload file</p>
                            <p className="text-xs text-gray-500">atau drag & drop file di sini</p>
                        </div>
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => onUpload(berkas.jenis_berkas_daftar_ulang, e.target.files[0])}
                            className="hidden"
                        />
                    </label>
                </div>
            )}
        </div>
    )
}

export default BerkasCard
