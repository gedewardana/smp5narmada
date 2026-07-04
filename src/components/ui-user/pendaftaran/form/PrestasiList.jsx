import { Eye, Pencil, Trash2, Trophy, Medal, Award, Globe, Building2, Calendar } from "lucide-react"

function PrestasiList({ data = [], onDelete, onEdit, readOnly = false, isEditing = false }) {
    // Handler untuk membuka berkas/bukti prestasi
    const handleViewProof = (bukti) => {
        if (!bukti) return
        if (typeof bukti === 'string') {
            window.open(bukti, '_blank')
        } else {
            const url = URL.createObjectURL(bukti)
            window.open(url, '_blank')
        }
    }

    // State Kosong (Empty State)
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 animate-in fade-in duration-500 mt-6">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-gray-300 shadow-sm mb-4">
                    <Trophy className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-gray-700">Belum Ada Prestasi</h4>
                <p className="text-xs text-gray-400 mt-1 text-center">Daftar prestasi Anda akan muncul di sini.</p>
            </div>
        )
    }

    const getTingkatIcon = (tingkat) => {
        if (tingkat?.toLowerCase().includes('internas')) return <Globe className="w-4 h-4" />
        if (tingkat?.toLowerCase().includes('nasional')) return <Award className="w-4 h-4" />
        if (tingkat?.toLowerCase().includes('provinsi')) return <Medal className="w-4 h-4" />
        return <Trophy className="w-4 h-4" />
    }

    return (
        <div className="mt-6 animate-in slide-in-from-bottom-2 duration-500">
            {/* 1. TAMPILAN MOBILE (Card Layout) - Aktif pada screen < md */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {data.map((item, index) => (
                    <div 
                        key={index} 
                        className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3.5 hover:border-blue-100 transition-colors group"
                    >
                        {/* Header Kartu: Ikon & Nama Prestasi */}
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                {getTingkatIcon(item.tingkat_prestasi)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-md uppercase tracking-wider mb-1">
                                    {item.tingkat_prestasi}
                                </span>
                                <h5 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors">
                                    {item.nama_prestasi}
                                </h5>
                                <p className="text-xs text-gray-500 mt-0.5 font-medium">{item.jenis_prestasi}</p>
                            </div>
                        </div>

                        {/* Detail Tambahan (Penyelenggara & Tahun) */}
                        <div className="pt-2 border-t border-gray-50 grid grid-cols-2 gap-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span className="truncate">{item.penyelenggara || '—'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span>{item.tahun_prestasi}</span>
                            </div>
                        </div>

                        {/* Footer Kartu: Berkas & Opsi Aksi */}
                        <div className="pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
                            <div>
                                {item.bukti_prestasi ? (
                                    <button
                                        type="button"
                                        onClick={() => handleViewProof(item.bukti_prestasi)}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-3 py-1.5 rounded-xl transition-all active:scale-95"
                                    >
                                        <Eye className="w-3.5 h-3.5" /> Lihat Berkas
                                    </button>
                                ) : (
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tanpa Berkas</span>
                                )}
                            </div>

                            {!readOnly && (
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(index)}
                                        disabled={isEditing}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 transition-colors ${isEditing ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-gray-500 hover:bg-amber-50 hover:text-amber-600 active:scale-95'}`}
                                        title="Edit"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDelete(index)}
                                        disabled={isEditing}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 transition-colors ${isEditing ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-gray-500 hover:bg-red-50 hover:text-red-600 active:scale-95'}`}
                                        title="Hapus"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* 2. TAMPILAN DESKTOP (Table Layout) - Aktif pada screen >= md */}
            <div className="hidden md:block overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm ring-1 ring-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Prestasi</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Kategori</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Detail</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Berkas</th>
                                {!readOnly && (
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Opsi</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {data.map((item, index) => (
                                <tr key={index} className="hover:bg-blue-50/20 transition-colors group">
                                    {/* Kolom Nama Prestasi */}
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                {getTingkatIcon(item.tingkat_prestasi)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                                                    {item.nama_prestasi}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    {/* Kolom Kategori */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-700">{item.jenis_prestasi}</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{item.tingkat_prestasi}</span>
                                        </div>
                                    </td>

                                    {/* Kolom Detail (Penyelenggara & Tahun) */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 max-w-xs">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium truncate">
                                                <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {item.penyelenggara || '—'}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {item.tahun_prestasi}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Kolom Berkas */}
                                    <td className="px-6 py-4 text-center">
                                        {item.bukti_prestasi ? (
                                            <button
                                                type="button"
                                                onClick={() => handleViewProof(item.bukti_prestasi)}
                                                className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                                                title="Lihat Bukti"
                                            >
                                                <Eye className="w-4.5 h-4.5" />
                                            </button>
                                        ) : (
                                            <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Kosong</span>
                                        )}
                                    </td>

                                    {/* Kolom Opsi Akses */}
                                    {!readOnly && (
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(index)}
                                                    disabled={isEditing}
                                                    className={`w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 transition-all ${isEditing ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-gray-400 hover:bg-amber-50 hover:text-amber-600 active:scale-90'}`}
                                                    title="Edit Data"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(index)}
                                                    disabled={isEditing}
                                                    className={`w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 transition-all ${isEditing ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-gray-400 hover:bg-red-50 hover:text-red-600 active:scale-90'}`}
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default PrestasiList