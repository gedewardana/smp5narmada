'use client'

import { useState } from 'react'
import {
    Eye,
    Download,
    FileText,
    Award,
    Maximize2,
    User,
    Hash,
    Fingerprint,
    Users,
    MapPin,
    Calendar,
    ShieldCheck,
    Stethoscope,
    Phone,
    Smartphone,
    Mail,
    School,
    CreditCard,
    CheckCircle2
} from 'lucide-react'
import BerkasViewer from './BerkasViewer'
import DocumentComparisonModal from './DocumentComparisonModal'
import { handleDownload } from '@/utils/downloadUtils'

// ─── Primitives ────────────────────────────────────────────────

function InfoItem({ label, value }) {
    return (
        <div className="p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all duration-300">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-[13px] font-medium text-slate-800">{value || '-'}</p>
        </div>
    )
}

function InfoGrid({ children }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {children}
        </div>
    )
}

function SectionTitle({ children }) {
    return (
        <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4 mt-2 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-blue-500 rounded-full inline-block" />
            {children}
        </h3>
    )
}

function EmptyState({ message = 'Tidak ada data' }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-[13px] font-medium text-slate-500">{message}</p>
        </div>
    )
}

// ─── Tab: Identitas ────────────────────────────────────────────

function TabIdentitas({ data }) {
    return (
        <div className="space-y-8 sm:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Data Pribadi */}
            <div className="space-y-4">
                <SectionTitle>
                    <User className="w-4 h-4 text-blue-500" />
                    Data Pribadi
                </SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <InfoItem label="Nama Lengkap" value={data.nama_lengkap} icon={User} />
                    <InfoItem label="NISN" value={data.nisn} icon={Hash} />
                    <InfoItem label="NIS" value={data.nis} icon={Hash} />
                    <InfoItem label="NIK" value={data.nik} icon={Fingerprint} />
                    <InfoItem label="Jenis Kelamin" value={data.jenis_kelamin} icon={Users} />
                    <InfoItem label="Tempat Lahir" value={data.tempat_lahir} icon={MapPin} />
                    <InfoItem label="Tanggal Lahir" value={data.tanggal_lahir} icon={Calendar} />
                    <InfoItem label="Agama" value={data.agama} icon={ShieldCheck} />
                    <InfoItem label="No. Reg Akta Lahir" value={data.no_reg_akta_lahir} icon={FileText} />
                    <InfoItem label="Kebutuhan Khusus" value={data.kebutuhan_khusus} icon={Stethoscope} />
                </div>
            </div>

            {/* 2. Data Keluarga */}
            <div className="space-y-4">
                <SectionTitle>
                    <Users className="w-4 h-4 text-blue-500" />
                    Data Keluarga
                </SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <InfoItem label="Anak Ke" value={data.anak_ke} icon={Hash} />
                    <InfoItem label="Saudara Kandung" value={data.saudara_kandung} icon={Users} />
                    <InfoItem label="Saudara Tiri" value={data.saudara_tiri} icon={Users} />
                    <InfoItem label="Saudara Angkat" value={data.saudara_angkat} icon={Users} />
                </div>
            </div>

            {/* 3. Kontak */}
            <div className="space-y-4">
                <SectionTitle>
                    <Phone className="w-4 h-4 text-blue-500" />
                    Kontak
                </SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <InfoItem label="No. Handphone" value={data.no_hp} icon={Smartphone} />
                    <InfoItem label="Email Terdaftar" value={data.email} icon={Mail} />
                    <InfoItem label="Telp. Rumah" value={data.telp_rumah} icon={Phone} />
                </div>
            </div>

            {/* 4. Alamat & Domisili */}
            <div className="space-y-4">
                <SectionTitle>
                    <MapPin className="w-4 h-4 text-blue-500" />
                    Alamat & Domisili
                </SectionTitle>
                <div className="space-y-3">
                    <div className="p-3.5 sm:p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Alamat Lengkap (Jl/Dusun/RT/RW)</p>
                        <p className="text-sm font-bold text-slate-800 leading-relaxed uppercase">
                            {data.alamat} {data.rt && `RT ${data.rt}`} {data.rw && `RW ${data.rw}`}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <InfoItem label="Kelurahan" value={data.wilayah?.kelurahan} icon={MapPin} />
                        <InfoItem label="Kecamatan" value={data.wilayah?.kecamatan} icon={MapPin} />
                        <InfoItem label="Kabupaten" value={data.wilayah?.kabupaten} icon={MapPin} />
                        <InfoItem label="Provinsi" value={data.wilayah?.provinsi} icon={MapPin} />
                        <InfoItem label="Kode Pos" value={data.kode_pos} icon={Hash} />
                    </div>
                </div>
            </div>

            {/* 5. Sekolah Asal */}
            <div className="space-y-4">
                <SectionTitle>
                    <School className="w-4 h-4 text-blue-500" />
                    Rekam Jejak Sekolah Asal
                </SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <InfoItem label="Nama Sekolah Asal" value={data.asal_sekolah} icon={School} />
                    <InfoItem label="NPSN Sekolah" value={data.npsn_asal} icon={Hash} />
                    <InfoItem label="No. Ijazah" value={data.no_ijazah} icon={GradedIcon} />
                    <InfoItem label="No. SKHUN" value={data.no_skhun} icon={GradedIcon} />
                    <InfoItem label="No. UN" value={data.no_un} icon={GradedIcon} />
                    <InfoItem label="Nilai SKHU" value={data.nilai_skhu} icon={GradedIcon} />
                </div>
            </div>

            {/* 6. Program Bantuan */}
            <div className="space-y-4">
                <SectionTitle>
                    <CreditCard className="w-4 h-4 text-blue-500" />
                    Program Bantuan (KIP / KPS / PKH)
                </SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <InfoItem label="Penerima KIP" value={data.penerima_kip} icon={CheckCircle2} />
                    <InfoItem label="No. KIP" value={data.no_kip} icon={Hash} />
                    <InfoItem label="Nama di KIP" value={data.nama_di_kip} icon={User} />
                    <InfoItem label="Penerima KPS/PKH" value={data.penerima_kps_pkh} icon={CheckCircle2} />
                    <InfoItem label="No. KKS" value={data.no_kks} icon={Hash} />
                </div>
            </div>
        </div>
    )
}

function GradedIcon(props) {
    return <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
}

// ─── Tab: Orang Tua ────────────────────────────────────────────

function TabOrangTua({ data, tipe }) {
    if (!data) return <EmptyState message="Tidak ada data orang tua" />
    const orang = data[tipe]
    const labelTipe = tipe === 'ayah' ? 'Ayah' : 'Ibu'
    const fields = [
        { label: `Nama ${labelTipe}`, value: orang?.nama },
        { label: 'Tahun Lahir', value: orang?.tahun_lahir },
        { label: 'Pendidikan', value: orang?.pendidikan },
        { label: 'Pekerjaan', value: orang?.pekerjaan },
        { label: 'Penghasilan', value: orang?.penghasilan },
    ]
    return (
        <InfoGrid>
            {fields.map(({ label, value }) => (
                <InfoItem key={label} label={label} value={value} />
            ))}
        </InfoGrid>
    )
}

function TabWali({ data }) {
    if (!data) return <EmptyState message="Tidak ada data wali" />
    const fields = [
        { label: 'Nama Wali', value: data.nama_wali },
        { label: 'Tahun Lahir', value: data.tahun_lahir },
        { label: 'Pendidikan', value: data.pendidikan },
        { label: 'Pekerjaan', value: data.pekerjaan },
        { label: 'Penghasilan', value: data.penghasilan },
    ]
    return (
        <InfoGrid>
            {fields.map(({ label, value }) => (
                <InfoItem key={label} label={label} value={value} />
            ))}
        </InfoGrid>
    )
}

// ─── Tab: Periodik ─────────────────────────────────────────────

function TabPeriodik({ data }) {
    if (!data) return <EmptyState message="Tidak ada data periodik" />
    const fields = [
        { label: 'Tinggi Badan', value: `${data.tinggi_badan} cm` },
        { label: 'Berat Badan', value: `${data.berat_badan} kg` },
        { label: 'Jarak ke Sekolah', value: `${data.jarak_tempat_tinggal_kesekolah} km` },
        { label: 'Waktu Tempuh', value: `${data.waktu_tempuh} menit` },
    ]
    return (
        <InfoGrid>
            {fields.map(({ label, value }) => (
                <InfoItem key={label} label={label} value={value} />
            ))}
        </InfoGrid>
    )
}

// ─── Tab: Prestasi ─────────────────────────────────────────────

function TabPrestasi({ prestasi, onViewBerkas }) {
    if (!prestasi?.length) return <EmptyState message="Belum ada data prestasi" />

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {prestasi.map((item, i) => (
                <div key={i} className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-300">
                    <div className="p-4 flex-1">
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2.5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl shadow-inner flex-shrink-0">
                                    <Award className="w-5 h-5 text-amber-600 drop-shadow-sm" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[13px] font-bold text-slate-800 truncate">{item.nama}</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{item.penyelenggara}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md shadow-sm border border-slate-200 flex-shrink-0">
                                {item.tahun}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100/50">
                                {item.jenis}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded border border-emerald-100/50">
                                {item.tingkat}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-3 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 min-w-0">
                            <FileText className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                            {item.bukti_prestasi
                                ? <span className="font-medium text-slate-700 truncate">{item.nama_file}</span>
                                : <span className="font-medium text-slate-400 italic">Tidak ada bukti</span>
                            }
                        </div>
                        {item.bukti_prestasi && (
                            <div className="flex gap-1.5 flex-shrink-0 ml-2">
                                <button
                                    onClick={() => onViewBerkas([{
                                        jenis_berkas: 'BUKTI_PRESTASI',
                                        nama_file: item.nama_file,
                                        path_file: item.bukti_prestasi,
                                    }])}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-100 transition-colors bg-white shadow-sm border border-slate-200"
                                    title="Lihat Dokumen"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDownload(item.bukti_prestasi, item.nama_file)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-100 transition-colors bg-white shadow-sm border border-slate-200"
                                    title="Unduh Dokumen"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── Tab: Berkas ───────────────────────────────────────────────

function TabBerkas({ berkas, onViewBerkas, onShowComparison }) {
    if (!berkas?.length) return <EmptyState message="Tidak ada berkas persyaratan" />

    return (
        <div className="space-y-4">
            <div className="hidden sm:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl px-4 sm:px-5 py-4 border border-blue-100/50 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white shadow-sm border border-blue-100 rounded-xl flex-shrink-0">
                        <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-[13px] font-bold text-slate-800">Perbandingan Dokumen</p>
                        <p className="text-[11px] text-slate-500 font-medium">Mode split-screen untuk mempermudah verifikasi</p>
                    </div>
                </div>
                <button
                    onClick={onShowComparison}
                    className="flex items-center justify-center gap-2 text-[12px] font-bold px-4 py-2 bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 text-white rounded-xl transition-all w-full sm:w-auto"
                >
                    <Maximize2 className="w-3.5 h-3.5" />
                    Bandingkan
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pb-8">
                {berkas.map((dok, i) => (
                    <div key={i} className="flex items-center justify-between bg-white rounded-2xl px-4 py-3.5 border border-slate-200 group hover:border-blue-400 hover:shadow-[0_4px_12px_-4px_rgba(37,99,235,0.15)] hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-center gap-3.5 min-w-0">
                            <div className="p-2.5 bg-slate-50 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 rounded-xl transition-colors flex-shrink-0">
                                <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className="text-[12px] font-bold text-slate-800 truncate">{dok.jenis_berkas}</p>
                                    {dok.mandatory && (
                                        <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 bg-red-50 text-red-600 rounded-md border border-red-100/50 flex-shrink-0">
                                            Wajib
                                        </span>
                                    )}
                                </div>
                                {dok.nama_file && (
                                    <p className="text-[11px] text-slate-400 truncate font-medium">{dok.nama_file}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0 ml-3">
                            <button
                                onClick={() => onViewBerkas([dok])}
                                className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors bg-slate-50/50 border border-transparent hover:border-blue-100"
                                title="Lihat Dokumen"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDownload(dok.path_file, dok.nama_file)}
                                className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors bg-slate-50/50 border border-transparent hover:border-emerald-100"
                                title="Unduh Dokumen"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
}

// ─── Tab Map ───────────────────────────────────────────────────

const TAB_MAP = {
    identitas: (p) => <TabIdentitas data={p.detailData.identitas} />,
    dataayah: (p) => <TabOrangTua data={p.detailData} tipe="ayah" />,
    dataibu: (p) => <TabOrangTua data={p.detailData} tipe="ibu" />,
    datawali: (p) => <TabWali data={p.detailData.wali} />,
    periodik: (p) => <TabPeriodik data={p.detailData.periodik} />,
    prestasi: (p) => <TabPrestasi prestasi={p.detailData.prestasi} onViewBerkas={p.onViewBerkas} />,
    berkas_persyaratan: (p) => <TabBerkas berkas={p.detailData.berkas_persyaratan ?? p.detailData.berkas} onViewBerkas={p.onViewBerkas} onShowComparison={p.onShowComparison} />,
}

// ─── Main Export ───────────────────────────────────────────────

export default function DetailContent({ detailData, activeTab, logs = [] }) {
    const [viewerBerkas, setViewerBerkas] = useState(null)
    const [showComparison, setShowComparison] = useState(false)

    if (!detailData) return null

    const ActiveTab = TAB_MAP[activeTab]

    const tabProps = {
        detailData,
        logs,
        onViewBerkas: setViewerBerkas,
        onShowComparison: () => setShowComparison(true),
    }

    return (
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                {ActiveTab
                    ? <ActiveTab {...tabProps} />
                    : <EmptyState message="Tab tidak ditemukan" />
                }
            </div>

            {viewerBerkas && (
                <BerkasViewer
                    berkas={viewerBerkas}
                    onClose={() => setViewerBerkas(null)}
                />
            )}

            {showComparison && (
                <DocumentComparisonModal
                    documents={detailData.berkas_persyaratan || detailData.berkas || []}
                    onClose={() => setShowComparison(false)}
                />
            )}
        </div>
    )
}