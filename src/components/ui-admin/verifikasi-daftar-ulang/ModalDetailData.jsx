
import React, { useState } from 'react'
import CatatanPanitia from './CatatanPanitia'
import BerkasViewer from './BerkasViewer'
import DocumentComparisonModal from './DocumentComparisonModal'
import {
    User,
    Users,
    Mail,
    Phone,
    MapPin,
    Calendar,
    FileText,
    Award,
    Eye,
    Download,
    CheckCircle2,
    Maximize2
} from 'lucide-react'

function DetailDaftarUlang({ detailData, activeTab, readOnly = false }) {
    const [viewerBerkas, setViewerBerkas] = useState(null)
    const [showComparison, setShowComparison] = useState(false)

    if (!detailData) return null

    // const InfoItem = ({ icon: Icon, label, value }) => (
    //     <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
    //         <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
    //         <div className="flex-1 min-w-0">
    //             <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
    //             <p className="text-sm text-gray-900">{value || '-'}</p>
    //         </div>
    //     </div>
    // )

    const getBerkasStatusBadge = (status) => {
        // const config = {
        //     'DIUNGGAH': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Diunggah' },
        //     'DALAM_VERIFIKASI': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Dalam Verifikasi' },
        //     'PERLU_PERBAIKAN': { bg: 'bg-red-100', text: 'text-red-700', label: 'Perlu Perbaikan' },
        //     'DIVERIFIKASI': { bg: 'bg-green-100', text: 'text-green-700', label: 'Diverifikasi' }
        // }
        // const c = config[status] || config['DIUNGGAH']
        // return (
        //     <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${c.bg} ${c.text}`}>
        //         {status === 'DIVERIFIKASI' && <CheckCircle2 className="w-3 h-3" />}
        //         {c.label}
        //     </span>
        // )
    }

    return (
        <div className="flex-1 overflow-y-auto p-6">
            {/* Tab: Berkas Persyaratan (under Dokumen Pendukung parent) */}
            {activeTab === 'berkas_persyaratan' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Maximize2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-blue-900">Perbandingan Dokumen</h4>
                                <p className="text-xs text-blue-700">Mode split-screen untuk verifikasi dokumen</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowComparison(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Maximize2 className="w-4 h-4" />
                            Bandingkan
                        </button>
                    </div>

                    <div className="space-y-3">
                        {(detailData.dokumen || detailData.berkas || []).map((dokumen, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between hover:border-blue-300 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gray-50 group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-500 rounded-lg transition-colors">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{dokumen.jenis_berkas}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-sm text-gray-500">{dokumen.nama_file}</p>
                                            {dokumen.mandatory && (
                                                <span className="text-[10px] px-1.5 py-0.5 bg-red-50 text-red-600 rounded border border-red-100">Wajib</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {getBerkasStatusBadge(dokumen.status_verifikasi)}
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setViewerBerkas([dokumen])}
                                            className="p-2 hover:bg-gray-100 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                                            title="Lihat"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-2 hover:bg-gray-100 text-gray-400 hover:text-green-600 rounded-lg transition-colors"
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab: Catatan */}
            {activeTab === 'catatan' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <CatatanPanitia
                        daftarUlangId={detailData.id_daftar_ulang}
                        initialCatatan={detailData.catatan_panitia}
                        editable={!readOnly}

                    />
                </div>
            )}

            {viewerBerkas && (
                <BerkasViewer
                    berkas={viewerBerkas}
                    onClose={() => setViewerBerkas(null)}
                />
            )}

            {showComparison && (
                <DocumentComparisonModal
                    documents={detailData.dokumen}
                    onClose={() => setShowComparison(false)}
                />
            )}
        </div>
    )
}

export default DetailDaftarUlang