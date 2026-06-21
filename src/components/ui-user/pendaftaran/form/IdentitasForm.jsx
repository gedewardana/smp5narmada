'use client'

import { useState, useImperativeHandle, forwardRef } from 'react'
import { FormInput, FormSection, FormGrid } from './FormComponents'
import WilayahDropdown from './WilayahDropdown'
import { useMultipleMaster } from '@/hooks/useMaster'
import { identitasSchema } from '@/utils/FormValidation'
import { scrollToFirstError } from '@/utils/focusHelper'

import {
    User,
    IdCard,
    Baby,
    Church,
    School,
    Hash,
    GraduationCap,
    Users,
    Phone,
    Mail,
    FileText,
    CreditCard,
    MapPin,
    Stethoscope
} from 'lucide-react'


const IdentitasForm = forwardRef(function IdentitasForm({ onSaveStatusChange, readOnly = false, formData, setFormData }, ref) {
    const [isSaved, setIsSaved] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})

    // Ambil data referensi dinamis dari server
    const { masterData, isLoading: isMasterLoading } = useMultipleMaster([
        'jenis_kelamin', 'agama', 'kebutuhan_khusus', 'sekolah_asal', 'jenis_tinggal', 'transportasi'
    ])

    

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }

            // Auto-fill NPSN jika user memilih Asal Sekolah
            if (name === 'id_sekolah') {
                const selectedSekolah = masterData.sekolah_asal?.find(s => String(s.id_sekolah) === String(value));
                newData.npsn_asal = selectedSekolah?.npsn || '';
            }

            return newData;
        })
    }

    // Hapus error satu field (dipanggil dari FormInput via onErrorClear)
    const clearError = (fieldName) => {
        setValidationErrors(prev => {
            if (!prev[fieldName]) return prev
            const next = { ...prev }
            delete next[fieldName]
            return next
        })
    }

    const handleWilayahChange = (wilayahData, kodePos) => {
        setFormData(prev => ({
            ...prev,
            // Simpan ID wilayah ke root formData agar sesuai Zod schema
            id_provinsi: wilayahData.id_provinsi,
            id_kabupaten: wilayahData.id_kabupaten,
            id_kecamatan: wilayahData.id_kecamatan,
            id_kelurahan: wilayahData.id_kelurahan,   // <-- sesuai Zod & DB (NOT NULL)
            ...(kodePos !== undefined && { kode_pos: kodePos || '' })
        }))
        if (validationErrors.id_kelurahan) setValidationErrors(prev => ({ ...prev, id_kelurahan: undefined }));
    }

    // Fungsi Validasi Client-Side
    const validateForm = () => {
        const result = identitasSchema.safeParse(formData)

        if (!result.success) {
            // Normalisasi: filter entry yang undefined agar tidak crash saat render
            const fieldErrors = Object.fromEntries(
                Object.entries(result.error.flatten().fieldErrors)
                    .filter(([, v]) => v !== undefined && v !== null)
            )
            setValidationErrors(fieldErrors)

            // Auto-focus ke field pertama yang error dengan menggunakan utility yang kita buat
            scrollToFirstError(fieldErrors)
            return false
        }

        setValidationErrors({})
        return true
    }

    // Ekspos fungsi ke parent (page.jsx) via ref
    useImperativeHandle(ref, () => ({
        /** Validasi form, tampilkan error jika gagal. Return true/false */
        validate: () => validateForm(),

        /** Ambil data form bersih untuk dikirim ke API */
        getFormData: () => formData,

        /** Toggle mode saved/edit dari luar */
        setSaved: (val) => {
            setIsSaved(val)
            onSaveStatusChange?.(val)
        },

        isSaved,
    }))

    return (
        <form className="space-y-4">
            <fieldset disabled={readOnly || isMasterLoading} className={`space-y-0 transition-opacity ${(readOnly || isMasterLoading) ? 'opacity-60' : 'opacity-100'}`}>

                {Object.keys(validationErrors).length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div>
                        <div>
                            <span className="font-bold">Mohon periksa kembali isian Anda.</span>
                            <ul className="mt-1 ml-4 list-disc text-xs space-y-1">
                                {Object.values(validationErrors).filter(Boolean).slice(0, 3).map((errs, i) => (
                                    <li key={i}>{Array.isArray(errs) ? errs[0] : errs}</li>
                                ))}
                                {Object.keys(validationErrors).length > 3 && (
                                    <li>...dan {Object.keys(validationErrors).length - 3} lainnya</li>
                                )}
                            </ul>
                        </div>
                    </div>
                )}

                {/* SECTION 1: Data Pribadi Utama */}
                <FormSection title="Data Pribadi Utama" description="Informasi identitas dasar calon peserta didik" icon={IdCard}>
                    <FormGrid cols={1}>
                        <FormInput
                            label="Nama Lengkap"
                            name="nama_lengkap"
                            value={formData.nama_lengkap}
                            onChange={handleChange}
                            onErrorClear={clearError}
                            icon={User}
                            placeholder="Nama sesuai akta kelahiran"
                            required
                            error={validationErrors.nama_lengkap?.[0]}
                        />
                    </FormGrid>
                    <div className="mt-5">
                        <FormGrid cols={2}>
                            <FormInput type='number' label="NISN" name="nisn" value={formData.nisn} onChange={handleChange} onErrorClear={clearError} icon={Hash} required placeholder="10 digit nomor NISN" error={validationErrors.nisn?.[0]} />
                            <FormInput type='number' label="NIK" name="nik" value={formData.nik} onChange={handleChange} onErrorClear={clearError} icon={IdCard} required placeholder="16 digit sesuai KK" error={validationErrors.nik?.[0]} />
                            <FormInput type='number' label="NIS" name="nis" value={formData.nis} onChange={handleChange} onErrorClear={clearError} icon={Hash} placeholder="Nomor induk siswa" error={validationErrors.nis?.[0]} required />
                            <FormInput label="No. Registrasi Akta" name="no_reg_akta_lahir" value={formData.no_reg_akta_lahir} onChange={handleChange} onErrorClear={clearError} icon={FileText} placeholder="Contoh: 1234/AB/2010" error={validationErrors.no_reg_akta_lahir?.[0]} required />
                        </FormGrid>
                    </div>
                </FormSection>

                {/* SECTION 2: Kelahiran & Karakteristik */}
                <FormSection title="Kelahiran & Karakteristik" description="Detail kelahiran dan informasi kesehatan" icon={Baby}>
                    <FormGrid cols={2}>
                        <FormInput label="Tempat Lahir" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} onErrorClear={clearError} icon={MapPin} required placeholder="Kota/Kabupaten" error={validationErrors.tempat_lahir?.[0]} />
                        <FormInput label="Tanggal Lahir" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} onErrorClear={clearError} type="date" required error={validationErrors.tanggal_lahir?.[0]} />
                        <FormInput
                            label="Jenis Kelamin"
                            name="id_jenis_kelamin"
                            value={formData.id_jenis_kelamin}
                            onChange={handleChange}
                            onErrorClear={clearError}
                            type="select"
                            options={masterData.jenis_kelamin?.map(item => ({ label: item.nama, value: item.id_jenis_kelamin })) || []}
                            icon={User}
                            required
                            error={validationErrors.id_jenis_kelamin?.[0]}
                        />
                        <FormInput
                            label="Agama"
                            name="id_agama"
                            value={formData.id_agama}
                            onChange={handleChange}
                            onErrorClear={clearError}
                            type="select"
                            options={masterData.agama?.map(item => ({ label: item.nama, value: item.id_agama })) || []}
                            icon={Church}
                            required
                            error={validationErrors.id_agama?.[0]}
                        />
                        <FormInput
                            label="Kebutuhan Khusus"
                            name="id_kebutuhan_khusus"
                            value={formData.id_kebutuhan_khusus}
                            onChange={handleChange}
                            onErrorClear={clearError}
                            type="select"
                            options={masterData.kebutuhan_khusus?.map(item => ({ label: item.nama, value: item.id_kebutuhan })) || []}
                            icon={Stethoscope}
                            required
                            error={validationErrors.id_kebutuhan_khusus?.[0]}
                        />
                    </FormGrid>
                </FormSection>

                {/* SECTION 3: Sekolah Asal */}
                <FormSection title="Pendidikan Sebelumnya" description="Informasi mengenai sekolah asal peserta didik" icon={School}>
                    <FormGrid cols={2}>
                        <FormInput
                            label="Nama Sekolah Asal"
                            name="id_sekolah"
                            value={formData.id_sekolah}
                            onChange={handleChange}
                            onErrorClear={clearError}
                            icon={School}
                            required
                            type="select"
                            options={masterData.sekolah_asal?.map(item => ({ label: item.nama_sekolah, value: item.id_sekolah })) || []}
                            error={validationErrors.id_sekolah?.[0]}
                        />
                        <FormInput label="NPSN Sekolah Asal" name="npsn_asal" value={formData.npsn_asal} onChange={handleChange} icon={Hash} placeholder="6 digit NPSN" required helpText="Otomatis terisi saat memilih sekolah asal"/>
                        <FormInput label="No. Seri Ijazah" name="no_ijazah" value={formData.no_ijazah} onChange={handleChange} icon={GraduationCap} placeholder="Nomor seri ijazah kelulusan" />
                        <FormInput label="No. UN" name="no_un" value={formData.no_un} onChange={handleChange} onErrorClear={clearError} icon={Hash} placeholder="Nomor ujian nasional" error={validationErrors.no_un?.[0]} required />
                        <FormInput label="No. SKHUN" name="no_skhun" value={formData.no_skhun} onChange={handleChange} onErrorClear={clearError} icon={FileText} placeholder="Nomor SKHUN" error={validationErrors.no_skhun?.[0]} required />
                        <FormInput label="Nilai SKHU" name="nilai_skhu" value={formData.nilai_skhu} onChange={handleChange} onErrorClear={clearError} type="number" icon={FileText} placeholder="Contoh: 85.50" error={validationErrors.nilai_skhu?.[0]} required />
                    </FormGrid>
                </FormSection>

                {/* SECTION 4: Alamat & Kontak */}
                <FormSection title="Alamat & Kontak" description="Informasi domisili dan nomor yang dapat dihubungi" icon={MapPin}>
                    <div className="mb-6">
                        <FormInput label="Alamat Jalan" name="alamat_tempat_tinggal" value={formData.alamat_tempat_tinggal} onChange={handleChange} onErrorClear={clearError} icon={MapPin} required placeholder="Jl. Pendidikan No. 12" error={validationErrors.alamat_tempat_tinggal?.[0]} />
                    </div>
                    <FormGrid cols={2}>
                        <FormInput label="RT" name="rt" value={formData.rt} onChange={handleChange} icon={MapPin} placeholder="00" />
                        <FormInput label="RW" name="rw" value={formData.rw} onChange={handleChange} icon={MapPin} placeholder="00" />
                    </FormGrid>

                    <div className="my-6">
                        <WilayahDropdown
                            initialData={{
                                id_provinsi: formData.id_provinsi,
                                id_kabupaten: formData.id_kabupaten,
                                id_kecamatan: formData.id_kecamatan,
                                id_kelurahan: formData.id_kelurahan,
                            }}
                            onChange={handleWilayahChange}
                            disabled={readOnly}
                            errors={validationErrors}
                        />
                    </div>
                    <div className="mb-6" >
                        <FormGrid cols={2}>
                            <FormInput label="Kode Pos" name="kode_pos" value={formData.kode_pos} onChange={handleChange} icon={MapPin} placeholder="83xxx" helpText="Otomatis terisi saat memilih kelurahan" />
                            <FormInput
                                label="Dusun"
                                name="dusun"
                                value={formData.dusun}
                                onChange={handleChange}
                                onErrorClear={clearError}
                                icon={MapPin}
                                required
                                placeholder="Nama dusun"
                                error={validationErrors.dusun?.[0]}
                            />
                        </FormGrid>

                    </div>

                    <FormGrid cols={2}>
                        <FormInput
                            label="Jenis Tinggal"
                            name="id_jenis_tinggal"
                            value={formData.id_jenis_tinggal}
                            onChange={handleChange}
                            onErrorClear={clearError}
                            type="select"
                            options={masterData.jenis_tinggal?.map(item => ({ label: item.nama, value: item.id_jenis_tinggal })) || []}
                            icon={Church}
                            required
                            error={validationErrors.id_jenis_tinggal?.[0]}
                        />
                        <FormInput
                            label="Transportasi"
                            name="id_transportasi"
                            value={formData.id_transportasi}
                            onChange={handleChange}
                            onErrorClear={clearError}
                            type="select"
                            options={masterData.transportasi?.map(item => ({ label: item.nama || item.nama_transportasi || `Transportasi ${item.id_transportasi}`, value: item.id_transportasi })) || []}
                            icon={MapPin}
                            required
                            error={validationErrors.id_transportasi?.[0]}
                        />
                        <FormInput label="No. Telepon Rumah" name="telp_rumah" value={formData.telp_rumah} onChange={handleChange} icon={Phone} placeholder="021xxxxxx" error={validationErrors.telp_rumah?.[0]} />
                        <FormInput label="Email Pribadi" name="email_pribadi" value={formData.email_pribadi} onChange={handleChange} onErrorClear={clearError} type="email" icon={Mail} placeholder="email@example.com" error={validationErrors.email_pribadi?.[0]} />
                    </FormGrid>
                </FormSection>

                {/* SECTION 5: Keluarga & Bantuan */}
                <FormSection title="Data Keluarga & Bantuan" description="Informasi susunan keluarga dan program pemerintah" icon={Users}>
                    <FormGrid cols={4}>
                        <FormInput label="Anak Ke-" name="anak_ke" value={formData.anak_ke} onChange={handleChange} onErrorClear={clearError} type="number" placeholder="0" error={validationErrors.anak_ke?.[0]} required />
                        <FormInput label="Sdr. Kandung" name="saudara_kandung" value={formData.saudara_kandung} onChange={handleChange} type="number" placeholder="0" />
                        <FormInput label="Sdr. Tiri" name="saudara_tiri" value={formData.saudara_tiri} onChange={handleChange} type="number" placeholder="0" />
                        <FormInput label="Sdr. Angkat" name="saudara_angkat" value={formData.saudara_angkat} onChange={handleChange} type="number" placeholder="0" />
                    </FormGrid>

                    <div className="mt-8">
                        <FormGrid cols={2}>
                            <FormInput
                                label="Penerima KIP"
                                name="penerima_kip"
                                value={formData.penerima_kip}
                                onChange={handleChange}
                                type="select"
                                options={[{ label: 'Tidak', value: false }, { label: 'Ya', value: true }]}
                                icon={CreditCard}
                            />
                            <FormInput
                                label="Penerima KPS/PKH"
                                name="penerima_kps_pkh"
                                value={formData.penerima_kps_pkh}
                                onChange={handleChange}
                                type="select"
                                options={[{ label: 'Tidak', value: false }, { label: 'Ya', value: true }]}
                                icon={CreditCard}
                            />
                        </FormGrid>
                    </div>

                    {(formData.penerima_kip === true || formData.penerima_kip === 'true' || formData.penerima_kps_pkh === true || formData.penerima_kps_pkh === 'true') && (
                        <div className="mt-5 pt-5 border-t border-dashed border-gray-200">
                            <FormGrid cols={2}>
                                {(formData.penerima_kip === true || formData.penerima_kip === 'true') && (
                                    <>
                                        <FormInput label="No. KIP" name="no_kip" value={formData.no_kip} onChange={handleChange} onErrorClear={clearError} icon={Hash} placeholder="Nomor kartu KIP" required error={validationErrors.no_kip?.[0]} />
                                        <FormInput label="Nama di KIP" name="nama_di_kip" value={formData.nama_di_kip} onChange={handleChange} onErrorClear={clearError} icon={User} placeholder="Nama sesuai kartu" required error={validationErrors.nama_di_kip?.[0]} />
                                    </>
                                )}
                                {(formData.penerima_kps_pkh === true || formData.penerima_kps_pkh === 'true') && (
                                    <FormInput label="No. KKS (KPS/PKH)" name="no_kks" value={formData.no_kks} onChange={handleChange} onErrorClear={clearError} icon={Hash} placeholder="Nomor kartu KKS" required error={validationErrors.no_kks?.[0]} />
                                )}
                            </FormGrid>
                        </div>
                    )}
                </FormSection>
            </fieldset>
        </form>
    )
})

export default IdentitasForm