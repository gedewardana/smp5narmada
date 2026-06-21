import Swal from "sweetalert2"
import { Eye, Pencil, Trash2, Trophy, Medal, Award, Globe, Building2, Calendar } from "lucide-react"

function PrestasiList({ data = [], onDelete, onEdit, readOnly = false }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 animate-in fade-in duration-500">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-gray-300 shadow-sm mb-4">
                    <Trophy className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-gray-700">Belum Ada Prestasi</h4>
                <p className="text-xs text-gray-400 mt-1">Daftar prestasi Anda akan muncul di sini.</p>
            </div>
        )
    }

    const handleDelete = (index) => {
        Swal.fire({
            title: 'Hapus Prestasi?',
            text: "Data prestasi akan dihapus permanen.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            customClass: {
                popup: 'rounded-3xl',
                confirmButton: 'rounded-xl px-6 py-2.5 font-bold',
                cancelButton: 'rounded-xl px-6 py-2.5 font-bold'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                onDelete(index)
                Swal.fire({ icon: 'success', title: 'Dihapus', text: 'Data prestasi berhasil dihapus', timer: 1500, showConfirmButton: false })
            }
        })
    }

    const getTingkatIcon = (tingkat) => {
        if (tingkat?.toLowerCase().includes('internas')) return <Globe className="w-3.5 h-3.5" />
        if (tingkat?.toLowerCase().includes('nasional')) return <Award className="w-3.5 h-3.5" />
        if (tingkat?.toLowerCase().includes('provinsi')) return <Medal className="w-3.5 h-3.5" />
        return <Trophy className="w-3.5 h-3.5" />
    }

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm ring-1 ring-gray-100 mt-6 animate-in slide-in-from-bottom-2 duration-500">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Prestasi</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest hidden sm:table-cell">Kategori</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest hidden md:table-cell">Detail</th>
                            <th className="px-6 py-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Berkas</th>
                            {!readOnly && (
                                <th className="px-6 py-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Opsi</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {data.map((item, index) => (
                            <tr key={index} className="hover:bg-blue-50/20 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                            {getTingkatIcon(item.tingkat_prestasi)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{item.nama_prestasi}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight sm:hidden">{item.jenis_prestasi} • {item.tingkat_prestasi}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 hidden sm:table-cell">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-700">{item.jenis_prestasi}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">{item.tingkat_prestasi}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium leading-none">
                                            <Building2 className="w-3 h-3" /> {item.penyelenggara || '—'}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase leading-none">
                                            <Calendar className="w-3 h-3" /> {item.tahun_prestasi}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {item.bukti_prestasi ? (
                                        <button
                                            onClick={() => {
                                                if (typeof item.bukti_prestasi === 'string') {
                                                    window.open(item.bukti_prestasi, '_blank')
                                                } else {
                                                    const url = URL.createObjectURL(item.bukti_prestasi)
                                                    window.open(url, '_blank')
                                                }
                                            }}
                                            className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                                            title="Lihat Bukti"
                                        >
                                            <Eye className="w-4.5 h-4.5" />
                                        </button>
                                    ) : (
                                        <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Kosong</span>
                                    )}
                                </td>
                                {!readOnly && (
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => onEdit(index)}
                                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-all active:scale-90"
                                                title="Edit Data"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(index)}
                                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all active:scale-90"
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
    )
}

export default PrestasiList