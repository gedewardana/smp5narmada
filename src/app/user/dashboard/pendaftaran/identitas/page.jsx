'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import FormWrapper from "@/components/ui-user/pendaftaran/FormWrapper"
import IdentitasForm from "@/components/ui-user/pendaftaran/form/IdentitasForm"
import NavigationButtons from '@/components/ui-user/pendaftaran/form/NavigationButtons'
import { useForm } from '@/hooks/useForm'
import { useAuth } from '@/hooks/useAuth'
import { usePendaftaranID } from '@/hooks/usePendaftaranID'
import Swal from 'sweetalert2'

export default function IdentitasPage() {
    const formRef = useRef()
    const { user } = useAuth()
    const { submitForm, isLoading: isSaving } = useForm()
    const [isSaved, setIsSaved] = useState(false)

    const idPendaftaran = user?.id_pendaftaran

    // 1. Fetch data pendaftaran yang sudah ada dari database
    const { data: existingData, isLoading: isFetching, mutate } = usePendaftaranID(idPendaftaran)

    // State formData diangkat ke level Page (Lift State Up)
    const [formData, setFormData] = useState({
        // Data Pribadi — WAJIB (NOT NULL di DB)
        nisn: '',
        nis: '',
        nik: '',
        nama_lengkap: '',
        id_jenis_kelamin: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        id_agama: '',
        no_reg_akta_lahir: '',
        id_kebutuhan_khusus: '',

        // Data Sekolah Asal — WAJIB
        id_sekolah: '',
        npsn_asal: '',
        no_ijazah: '',
        no_skhun: '',
        nilai_skhu: '',
        no_un: '',

        // Data Keluarga
        anak_ke: '',
        saudara_kandung: '',
        saudara_tiri: '',
        saudara_angkat: '',

        // Kontak
        id_jenis_tinggal: '',
        id_transportasi: '',
        email_pribadi: '',
        telp_rumah: '',
        

        // Alamat Lengkap — WAJIB
        alamat_tempat_tinggal: '',
        rt: '',
        rw: '',
        id_kelurahan: null,
        dusun: '',
        kode_pos: '',

        // Wilayah cascade
        id_provinsi: null,
        id_kabupaten: null,
        id_kecamatan: null,

        // Bantuan
        no_kks: '',
        penerima_kps_pkh: false,
        penerima_kip: false,
        nama_di_kip: '',
        no_kip: '',
    })

    const [hasData, setHasData] = useState(false)

    // 2. Masukkan data dari API ke dalam form secara otomatis
    useEffect(() => {
        // console.log("ID Pendaftaran dari Session:", idPendaftaran);
        // console.log("Data dari Database:", existingData);

        if (existingData?.identitas) {
            setFormData(prev => ({
                ...prev,
                ...existingData.identitas,
                // Pastikan ID wilayah tetap terjaga untuk dropdown cascade
                id_provinsi: existingData.identitas.id_provinsi,
                id_kabupaten: existingData.identitas.id_kabupaten,
                id_kecamatan: existingData.identitas.id_kecamatan,
                id_kelurahan: existingData.identitas.id_kelurahan,
            }))
            setIsSaved(true) // Otomatis kunci form jika sudah ada datanya
            setHasData(true)
        }
    }, [existingData])

    const handleSave = async () => {
        if (!formRef.current) return

        if (isSaved) {
            setIsSaved(false)
            return
        }

        const isValid = formRef.current.validate()
        if (!isValid) return

        try {
            if (!idPendaftaran) {
                Swal.fire({
                    icon: 'error',
                    title: 'Sesi Berakhir',
                    text: 'ID Pendaftaran tidak ditemukan. Silakan login kembali.',
                });
                return;
            }

            Swal.fire({
                title: 'Menyimpan Data...',
                text: 'Mohon tunggu sebentar',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })

            const success = await submitForm(idPendaftaran, formData)

            if (success) {
                await mutate() // Update cache SWR agar StepGuard tahu form ini sudah diselesaikan
                setIsSaved(true)
                setHasData(true) // set untuk button batal
                
                Swal.fire({
                    icon: 'success',
                    title: 'Tersimpan!',
                    text: 'Data identitas berhasil disimpan.',
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-3xl' }
                })
            }
        } catch (error) {
            console.error("Gagal simpan identitas:", error)
        }
    }

    const handleCancel = () => {
        if (existingData?.identitas) {
            setFormData(prev => ({
                ...prev,
                ...existingData.identitas
            }))
        }
        setIsSaved(true)
    }

    // Deteksi apakah ada perubahan data dibanding data asli di database
    const hasChanges = useMemo(() => {
        if (!existingData?.identitas) return true; // Jika data baru, anggap ada perubahan
        
        // Bandingkan field-field utama (Anda bisa menambah listnya jika perlu)
        const fieldsToCompare = Object.keys(formData).filter(key => key !== 'npsn_asal'); // Abaikan field temporer
        
        return fieldsToCompare.some(key => {
            const val1 = formData[key] ?? '';
            const val2 = existingData.identitas[key] ?? '';
            return String(val1) !== String(val2);
        });
    }, [formData, existingData]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Tampilkan loading spinner jika sedang mengambil data awal */}
            {isFetching ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
            ) : (
                <FormWrapper
                    title="Data Identitas Peserta Didik"
                    description="Lengkapi data pribadi calon peserta didik dengan benar sesuai dokumen resmi (Akta Kelahiran & KK)."
                    showWarning={true}
                >
                    <IdentitasForm
                        ref={formRef} // baca error
                        formData={formData}
                        setFormData={setFormData}
                        onSaveStatusChange={setIsSaved}
                        readOnly={isSaved}
                    />

                    <NavigationButtons
                        prevLink={null}
                        nextLink="/user/dashboard/pendaftaran/data-ayah"
                        onSave={handleSave}
                        onCancel={handleCancel}
                        isFirstStep={true}
                        isLastStep={false}
                        mode={isSaved ? 'view' : 'input'}
                        alwaysEnableNext={false}
                        saveDisabled={isSaving || (!isSaved && !hasChanges)} // Gunakan saveDisabled
                        isUpdate={hasData}
                    />
                </FormWrapper>
            )}
        </div>
    )
}
