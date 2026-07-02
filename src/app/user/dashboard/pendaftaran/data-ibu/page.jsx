'use client'
import { useState, useRef, useEffect, useMemo } from "react"
import Swal from "sweetalert2"
import { useRouter } from 'next/navigation'
import FormWrapper from "@/components/ui-user/pendaftaran/FormWrapper"
import OrangTuaForm from "@/components/ui-user/pendaftaran/form/IbuForm"
import NavigationButtons from "@/components/ui-user/pendaftaran/form/NavigationButtons"
import StepQuestion from "@/components/ui-user/pendaftaran/StepQuestion"
import { usePendaftaranID } from "@/hooks/usePendaftaranID"
import { useAuth } from "@/hooks/useAuth"
import { useForm } from "@/hooks/useForm"

export default function DataIbuPage() {
    const router = useRouter()
    const formRef = useRef()
    const { user } = useAuth()
    const { submitForm, isLoading: isSaving } = useForm()

    const [isSaved, setIsSaved] = useState(false)
    const [showForm, setShowForm] = useState(false) // Awalnya tampilkan pertanyaan
    const [hasData, setHasData] = useState(false)

    const idPendaftaran = user?.id_pendaftaran

    const { data: existingData, isLoading: isFetching, mutate } = usePendaftaranID(idPendaftaran)

    const [formData, setFormData] = useState({
        nama: '',
        tahun_lahir: '',
        pendidikan_ibu: '',
        pekerjaan_ibu: '',
        penghasilan_bulanan_ibu: '',
        kebutuhan_khusus_ibu: '',
    })

    // Masukkan data dari API ke dalam form
    useEffect(() => {
        if (existingData?.ibu) {
            setFormData({
                nama: existingData.ibu.nama || '',
                tahun_lahir: existingData.ibu.tahun_lahir || '',
                pendidikan_ibu: existingData.ibu.pendidikan_ibu || '',
                pekerjaan_ibu: existingData.ibu.pekerjaan_ibu || '',
                penghasilan_bulanan_ibu: existingData.ibu.penghasilan_bulanan_ibu || '',
                kebutuhan_khusus_ibu: existingData.ibu.kebutuhan_khusus_ibu || '',
            })
            setIsSaved(true)
            setShowForm(true)
            setHasData(true)
        }
    }, [existingData])

    // Pengecekan perubahan data
    const hasChanges = useMemo(() => {
        if (!existingData?.ibu) return true;
        
        return Object.keys(formData).some(key => {
            const val1 = formData[key] ?? '';
            const val2 = existingData.ibu[key] ?? '';
            return String(val1) !== String(val2);
        });
    }, [formData, existingData]);

    const handleMainButton = async () => {
        if (isSaved) {
            setIsSaved(false)
            return
        }

        const isValid = formRef.current?.validate()
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

            // Backend validation (fullPendaftaranSchema) requires complete identitas data
            const payload = {
                ...(existingData?.identitas || {}),
                ibu: formData
            };

            const success = await submitForm(idPendaftaran, payload)

            if (success) {
                await mutate()
                setIsSaved(true)
                setHasData(true)

                Swal.fire({
                    icon: 'success',
                    title: 'Tersimpan!',
                    text: 'Data ibu kandung berhasil disimpan.',
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-3xl' }
                })
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menyimpan',
                text: error.message || 'Terjadi kesalahan saat menyimpan data',
            })
        }
    }

    const handleCancel = () => {
        if (existingData?.ibu) {
            setFormData({
                nama: existingData.ibu.nama || '',
                tahun_lahir: existingData.ibu.tahun_lahir || '',
                pendidikan_ibu: existingData.ibu.pendidikan_ibu || '',
                pekerjaan_ibu: existingData.ibu.pekerjaan_ibu || '',
                penghasilan_bulanan_ibu: existingData.ibu.penghasilan_bulanan_ibu || '',
                kebutuhan_khusus_ibu: existingData.ibu.kebutuhan_khusus_ibu || '',
            })
        }
        setIsSaved(true)
    }

    const handleYes = () => setShowForm(true)
    const handleNo = async () => {
        try {
            await fetch('/api/pendaftaran/skip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_pendaftaran: idPendaftaran, step_key: 'data-ibu' })
            });
            await mutate();
        } catch (error) {
            console.error('Failed to skip step', error);
        }
        router.push('/user/dashboard/pendaftaran/data-wali')
    }

    if (isFetching) {
        return <div className="flex justify-center items-center h-64">Memuat data...</div>
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {!showForm ? (
                <FormWrapper title="Data Ibu Kandung" description="">
                    <StepQuestion
                        question="Apakah peserta memiliki data Ibu yang ingin diisi?"
                        onYes={handleYes}
                        onNo={handleNo}
                        prevLink="/user/dashboard/pendaftaran/data-ayah"
                    />
                </FormWrapper>
            ) : (
                <FormWrapper
                    showWarning={true}
                    title="Data Ibu Kandung"
                    description="Lengkapi data ibu kandung peserta didik"
                >
                    <OrangTuaForm 
                        ref={formRef}
                        readOnly={isSaved} 
                        formData={formData}
                        setFormData={setFormData}
                    />

                    <NavigationButtons
                        prevLink="/user/dashboard/pendaftaran/data-ayah"
                        nextLink="/user/dashboard/pendaftaran/data-wali"
                        onSave={handleMainButton}
                        onCancel={handleCancel}
                        isFirstStep={false}
                        isLastStep={false}
                        mode={isSaved ? 'view' : 'input'}
                        alwaysEnableNext={false}
                        saveDisabled={isSaving || (!isSaved && !hasChanges)}
                        isUpdate={hasData}
                    />
                </FormWrapper>
            )}
        </div>
    )
}
