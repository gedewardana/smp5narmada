import { useUserDashboard } from "@/hooks/useUserDashboard"
import { formatSingleDate } from "@/utils/dateUtils"


export default function DetailPendaftaran({ borderColor = 'border-gray-100' }) {
    const { data, isLoading } = useUserDashboard()

    // Mapping data dari dashboard service (Clean Code)
    const rows = [
        { label: 'Nama Lengkap', value: data?.nama_lengkap || '—' },
        { label: 'Nomor Pendaftaran', value: data?.nomor_pendaftaran || '—' },
        { label: 'Jenis Kelamin', value: data?.jenis_kelamin || '—' },
        { label: 'Asal Sekolah', value: data?.nama_sekolah || '—' },
        { label: 'Jalur Pendaftaran', value: data?.jalur_pendaftaran || '—' },
        { label: 'Tanggal Pendaftaran', value: formatSingleDate(data?.raw?.tanggal_submit) },
    ]

    if (isLoading) return <div className="h-40 animate-pulse bg-gray-50 rounded-xl border border-dashed border-gray-200" />

    return (
        // Prop borderColor untuk menyesuaikan warna per status
        <div className={`bg-white border ${borderColor} rounded-lg p-4 mb-4`}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                📋 Ringkasan Data Pendaftaran
            </p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {rows.map(({ label, value }) => (
                    <div key={label} className="flex flex-col py-1.5 border-b border-gray-100">
                        <dt className="text-gray-400 text-xs">{label}</dt>
                        <dd className="text-gray-800 font-semibold">{value ?? '—'}</dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}
