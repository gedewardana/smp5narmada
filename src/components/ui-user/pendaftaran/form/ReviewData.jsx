'use client'

import React from 'react'
import Link from 'next/link'
import { 
    User, 
    UserRound, 
    UserRoundCheck, 
    Users, 
    CalendarDays, 
    Trophy, 
    Edit2, 
    Eye,
    CheckCircle2,
    Minus,
    IdCard,
    Baby,
    School,
    MapPin,
    HeartHandshake
} from 'lucide-react'

/**
 * ReviewData - Premium review component for all registration form data
 */
export default function ReviewData({ data }) {
    if (!data) return null

    // ─── Sub-components ───────────────────────────────────────────

    const DataRow = ({ label, value }) => (
        <div className="flex flex-col sm:flex-row sm:items-start justify-between py-2.5 border-b border-slate-50 last:border-0 gap-1 sm:gap-4">
            <dt className="text-[11px] font-black text-gray-400 uppercase tracking-widest shrink-0 sm:w-40 pt-0.5">{label}</dt>
            <dd className="text-sm text-gray-800 font-semibold text-left sm:text-right flex-1 break-words">{value || <span className="text-slate-300 font-normal">—</span>}</dd>
        </div>
    )

    const SectionCard = ({ title, icon: Icon, iconColor = 'text-blue-600', iconBg = 'bg-blue-50', editLink, children, accentColor = 'bg-blue-500' }) => (
        <div className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            {/* Accent Bar */}
            <div className={`absolute top-0 left-0 w-full h-1 ${accentColor}`} />

            {/* Section Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">{title}</h3>
                </div>

                <Link
                    href={editLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50/0 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                    <Edit2 className="w-3 h-3" />
                    Edit
                </Link>
            </div>

            {/* Card Content */}
            <dl className="px-6 py-4">
                {children}
            </dl>
        </div>
    )

    // ─── Render ────────────────────────────────────────────────────

    return (
        <div className="space-y-6">

            {/* A.1 Data Pribadi Utama */}
            <SectionCard
                title="Data Pribadi Utama"
                icon={IdCard}
                iconColor="text-blue-600"
                iconBg="bg-blue-50"
                accentColor="bg-blue-500"
                editLink="/user/dashboard/pendaftaran/identitas"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <DataRow label="Nama Lengkap" value={data.identitas?.nama_lengkap} />
                    <DataRow label="NISN" value={data.identitas?.nisn} />
                    <DataRow label="NIK" value={data.identitas?.nik} />
                    <DataRow label="NIS" value={data.identitas?.nis} />
                    <DataRow label="No. Reg. Akta" value={data.identitas?.no_reg_akta_lahir} />
                </div>
            </SectionCard>

            {/* A.2 Kelahiran & Karakteristik */}
            <SectionCard
                title="Kelahiran & Karakteristik"
                icon={Baby}
                iconColor="text-pink-600"
                iconBg="bg-pink-50"
                accentColor="bg-pink-500"
                editLink="/user/dashboard/pendaftaran/identitas"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <DataRow label="Tempat Lahir" value={data.identitas?.tempat_lahir} />
                    <DataRow label="Tanggal Lahir" value={data.identitas?.tanggal_lahir} />
                    <DataRow label="Jenis Kelamin" value={data.identitas?.jenis_kelamin} />
                    <DataRow label="Agama" value={data.identitas?.agama} />
                    <DataRow label="Kebutuhan Khusus" value={data.identitas?.kebutuhan_khusus} />
                </div>
            </SectionCard>

            {/* A.3 Sekolah Asal */}
            <SectionCard
                title="Pendidikan Sebelumnya"
                icon={School}
                iconColor="text-purple-600"
                iconBg="bg-purple-50"
                accentColor="bg-purple-500"
                editLink="/user/dashboard/pendaftaran/identitas"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <DataRow label="Sekolah Asal" value={data.identitas?.asal_sekolah} />
                    <DataRow label="NPSN Asal" value={data.identitas?.npsn_asal} />
                    <DataRow label="No. Seri Ijazah" value={data.identitas?.no_ijazah} />
                    <DataRow label="No. UN" value={data.identitas?.no_un} />
                    <DataRow label="No. SKHUN" value={data.identitas?.no_skhun} />
                    <DataRow label="Nilai SKHU" value={data.identitas?.nilai_skhu} />
                </div>
            </SectionCard>

            {/* A.4 Alamat & Kontak */}
            <SectionCard
                title="Alamat & Kontak"
                icon={MapPin}
                iconColor="text-teal-600"
                iconBg="bg-teal-50"
                accentColor="bg-teal-500"
                editLink="/user/dashboard/pendaftaran/identitas"
            >
                <DataRow label="Alamat Jalan" value={data.identitas?.alamat} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mt-2 border-t border-slate-50 pt-2">
                    <DataRow label="RT / RW" value={`${data.identitas?.rt || '-'} / ${data.identitas?.rw || '-'}`} />
                    <DataRow label="Dusun" value={data.identitas?.dusun} />
                    <DataRow label="Kelurahan" value={data.identitas?.wilayah?.kelurahan} />
                    <DataRow label="Kecamatan" value={data.identitas?.wilayah?.kecamatan} />
                    <DataRow label="Kabupaten" value={data.identitas?.wilayah?.kabupaten} />
                    <DataRow label="Provinsi" value={data.identitas?.wilayah?.provinsi} />
                    <DataRow label="Kode Pos" value={data.identitas?.kode_pos} />
                    <DataRow label="Jenis Tinggal" value={data.identitas?.jenis_tinggal} />
                    <DataRow label="Transportasi" value={data.identitas?.transportasi} />
                    <DataRow label="No. Telepon" value={data.identitas?.telp_rumah} />
                    <DataRow label="Email" value={data.identitas?.email} />
                </div>
            </SectionCard>

            {/* A.5 Keluarga & Bantuan */}
            <SectionCard
                title="Data Keluarga & Bantuan"
                icon={HeartHandshake}
                iconColor="text-orange-600"
                iconBg="bg-orange-50"
                accentColor="bg-orange-500"
                editLink="/user/dashboard/pendaftaran/identitas"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <DataRow label="Anak Ke-" value={data.identitas?.anak_ke} />
                    <DataRow label="Sdr. Kandung" value={data.identitas?.saudara_kandung} />
                    <DataRow label="Sdr. Tiri" value={data.identitas?.saudara_tiri} />
                    <DataRow label="Sdr. Angkat" value={data.identitas?.saudara_angkat} />
                    <DataRow label="Penerima KIP" value={data.identitas?.penerima_kip ? 'Ya' : 'Tidak'} />
                    <DataRow label="Penerima KPS/PKH" value={data.identitas?.penerima_kps_pkh ? 'Ya' : 'Tidak'} />
                    {data.identitas?.penerima_kip && (
                        <>
                            <DataRow label="No. KIP" value={data.identitas?.no_kip} />
                            <DataRow label="Nama di KIP" value={data.identitas?.nama_di_kip} />
                        </>
                    )}
                    {data.identitas?.penerima_kps_pkh && (
                        <DataRow label="No. KKS" value={data.identitas?.no_kks} />
                    )}
                </div>
            </SectionCard>

            {/* B. Data Orang Tua (Grid 2 Kolom) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SectionCard
                    title="Data Ayah Kandung"
                    icon={UserRound}
                    iconColor="text-indigo-600"
                    iconBg="bg-indigo-50"
                    accentColor="bg-indigo-500"
                    editLink="/user/dashboard/pendaftaran/data-ayah"
                >
                    <DataRow label="Nama Ayah" value={data.ayah?.nama} />
                    <DataRow label="Pekerjaan" value={data.ayah?.pekerjaan} />
                    <DataRow label="Pendidikan" value={data.ayah?.pendidikan} />
                    <DataRow label="Penghasilan" value={data.ayah?.penghasilan} />
                    <DataRow label="Kebutuhan Khusus" value={data.ayah?.kebutuhan_khusus} />
                </SectionCard>

                <SectionCard
                    title="Data Ibu Kandung"
                    icon={UserRoundCheck}
                    iconColor="text-rose-500"
                    iconBg="bg-rose-50"
                    accentColor="bg-rose-500"
                    editLink="/user/dashboard/pendaftaran/data-ibu"
                >
                    <DataRow label="Nama Ibu" value={data.ibu?.nama} />
                    <DataRow label="Pekerjaan" value={data.ibu?.pekerjaan} />
                    <DataRow label="Pendidikan" value={data.ibu?.pendidikan} />
                    <DataRow label="Penghasilan" value={data.ibu?.penghasilan} />
                    <DataRow label="Kebutuhan Khusus" value={data.ibu?.kebutuhan_khusus} />
                </SectionCard>
            </div>

            {/* C. Data Wali */}
            <SectionCard
                title="Data Wali"
                icon={Users}
                iconColor="text-amber-600"
                iconBg="bg-amber-50"
                accentColor="bg-amber-500"
                editLink="/user/dashboard/pendaftaran/data-wali"
            >
                <DataRow label="Nama Wali" value={data.wali?.nama} />
                <DataRow label="Pekerjaan" value={data.wali?.pekerjaan} />
                <DataRow label="Pendidikan" value={data.wali?.pendidikan} />
                <DataRow label="Penghasilan" value={data.wali?.penghasilan} />
                <DataRow label="Kebutuhan Khusus" value={data.wali?.kebutuhan_khusus} />
            </SectionCard>

            {/* D. Data Periodik */}
            <SectionCard
                title="Data Periodik"
                icon={CalendarDays}
                iconColor="text-emerald-600"
                iconBg="bg-emerald-50"
                accentColor="bg-emerald-500"
                editLink="/user/dashboard/pendaftaran/data-periodik"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                    <DataRow label="Tinggi Badan" value={data.periodik?.tinggi_badan} />
                    <DataRow label="Berat Badan" value={data.periodik?.berat_badan} />
                    <DataRow label="Jarak ke Sekolah" value={data.periodik?.jarak_sekolah} />
                    <DataRow label="Waktu Tempuh" value={data.periodik?.waktu_tempuh} />
                    {/* <DataRow label="Jml. Saudara" value={data.periodik?.jumlah_saudara} /> */}
                </div>
            </SectionCard>

            {/* E. Data Prestasi */}
            <div className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400" />

                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Data Prestasi</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                            {data.prestasi?.length || 0} Prestasi
                        </span>
                        <Link
                            href="/user/dashboard/pendaftaran/data-prestasi"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                            <Edit2 className="w-3 h-3" />
                            Edit
                        </Link>
                    </div>
                </div>

                <div className="p-6">
                    {data.prestasi && data.prestasi.length > 0 ? (
                        <div className="space-y-3">
                            {data.prestasi.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100 transition-all hover:border-yellow-200 hover:bg-yellow-50/20">
                                    <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-600 font-black text-sm flex items-center justify-center shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-gray-900 truncate">{item.nama_prestasi}</p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.jenis_prestasi}</span>
                                            <span className="text-gray-200">·</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.tingkat_prestasi}</span>
                                            <span className="text-gray-200">·</span>
                                            <span className="text-[10px] font-bold text-gray-400">{item.tahun}</span>
                                            <span className="text-gray-200">·</span>
                                            <span className="text-[10px] font-bold text-gray-400">{item.penyelenggara_prestasi}</span>
                                        </div>
                                    </div>
                                    {item.bukti_prestasi ? (
                                        <a
                                            href={item.bukti_prestasi}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="Lihat Bukti Prestasi"
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shrink-0"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </a>
                                    ) : (
                                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-300 shrink-0">
                                            <Minus className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-slate-300" />
                            </div>
                            <p className="text-sm text-slate-400 font-medium">Tidak ada data prestasi yang dimasukkan</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

