'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import Swal from "sweetalert2"
import { useRouter } from 'next/navigation'
import FormWrapper from "@/components/ui-user/pendaftaran/FormWrapper"
// import StepIndicator from "@/components/ui-user/pendaftaran/StepIndicator"
import OrangTuaForm from "@/components/ui-user/pendaftaran/form/AyahForm"
import NavigationButtons from "@/components/ui-user/pendaftaran/form/NavigationButtons"
import StepQuestion from "@/components/ui-user/pendaftaran/StepQuestion"
// import Header from "@/components/ui-user/pendaftaran/Header"

import { useForm } from '@/hooks/useForm'
import { useAuth } from '@/hooks/useAuth'
import { usePendaftaranID } from '@/hooks/usePendaftaranID'

export default function DataAyahPage() {
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
        pendidikan_ayah: '',
        pekerjaan_ayah: '',
        penghasilan_bulanan_ayah: '',
        kebutuhan_khusus_ayah: '',
    })

    // Masukkan data dari API ke dalam form
    useEffect(() => {
        if (existingData?.ayah) {
            setFormData(prev => ({
                ...prev,
                ...existingData.ayah,
                pendidikan_ayah: existingData.ayah.pendidikan_ayah || existingData.ayah.id_pendidikan || '',
                pekerjaan_ayah: existingData.ayah.pekerjaan_ayah || existingData.ayah.id_pekerjaan || '',
                penghasilan_bulanan_ayah: existingData.ayah.penghasilan_bulanan_ayah || existingData.ayah.id_penghasilan || '',
                kebutuhan_khusus_ayah: existingData.ayah.kebutuhan_khusus_ayah || existingData.ayah.id_kebutuhan || '',
            }))
            setIsSaved(true)
            setHasData(true)
            setShowForm(true) // Langsung tampilkan form jika data ayah sudah ada
        }
    }, [existingData])

    // Deteksi perubahan data
    const hasChanges = useMemo(() => {
        if (!existingData?.ayah) return true;
        
        const fieldsToCompare = Object.keys(formData);
        
        return fieldsToCompare.some(key => {
            const val1 = formData[key] ?? '';
            let val2 = existingData.ayah[key] ?? '';
            if (key === 'pendidikan_ayah' && !val2) val2 = existingData.ayah.id_pendidikan ?? '';
            if (key === 'pekerjaan_ayah' && !val2) val2 = existingData.ayah.id_pekerjaan ?? '';
            if (key === 'penghasilan_bulanan_ayah' && !val2) val2 = existingData.ayah.id_penghasilan ?? '';
            if (key === 'kebutuhan_khusus_ayah' && !val2) val2 = existingData.ayah.id_kebutuhan ?? '';

            return String(val1) !== String(val2);
        });
    }, [formData, existingData]);

    const handleMainButton = async () => {
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

            // Backend validation (fullPendaftaranSchema) requires complete identitas data
            const payload = {
                ...(existingData?.identitas || {}),
                ayah: formData
            };

            const success = await submitForm(idPendaftaran, payload)

            if (success) {
                await mutate()
                setIsSaved(true)
                setHasData(true)

                Swal.fire({
                    icon: 'success',
                    title: 'Tersimpan!',
                    text: 'Data ayah kandung berhasil disimpan.',
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-3xl' }
                })
            }
        } catch (error) {
            console.error("Gagal simpan data ayah:", error)
        }
    }

    const handleCancel = () => {
        if (existingData?.ayah) {
            setFormData(prev => ({
                ...prev,
                ...existingData.ayah,
                pendidikan_ayah: existingData.ayah.pendidikan_ayah || existingData.ayah.id_pendidikan || '',
                pekerjaan_ayah: existingData.ayah.pekerjaan_ayah || existingData.ayah.id_pekerjaan || '',
                penghasilan_bulanan_ayah: existingData.ayah.penghasilan_bulanan_ayah || existingData.ayah.id_penghasilan || '',
                kebutuhan_khusus_ayah: existingData.ayah.kebutuhan_khusus_ayah || existingData.ayah.id_kebutuhan || '',
            }))
        }
        setIsSaved(true)
    }

    // Jawab Ya → tampilkan form
    const handleYes = () => setShowForm(true)

    // Jawab Tidak → tandai sebagai skipped, lanjut ke step berikutnya
    const handleNo = async () => {
        try {
            await fetch('/api/pendaftaran/skip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_pendaftaran: idPendaftaran, step_key: 'data-ayah' })
            });
            mutate();
        } catch (error) {
            console.error('Failed to skip step', error);
        }
        router.push('/user/dashboard/pendaftaran/data-ibu')
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isFetching ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
            ) : !showForm ? (
                <FormWrapper title="Data Ayah Kandung" >
                    <StepQuestion
                        question="Apakah peserta memiliki data Ayah yang ingin diisi?"
                        onYes={handleYes}
                        onNo={handleNo}
                        prevLink="/user/dashboard/pendaftaran/identitas"
                    />
                </FormWrapper>
            ) : (
                <FormWrapper
                    showWarning={true}
                    title="Data Ayah Kandung"
                    description="Lengkapi data ayah kandung peserta didik"
                >
                    <OrangTuaForm 
                        ref={formRef}
                        formData={formData}
                        setFormData={setFormData}
                        onSaveStatusChange={setIsSaved}
                        readOnly={isSaved} 
                    />

                    <NavigationButtons
                        prevLink="/user/dashboard/pendaftaran/identitas"
                        nextLink="/user/dashboard/pendaftaran/data-ibu"
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