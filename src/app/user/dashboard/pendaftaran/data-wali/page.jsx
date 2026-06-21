'use client'
import { useState, useRef, useEffect, useMemo } from "react"
import Swal from "sweetalert2"
import { useRouter } from 'next/navigation'
import FormWrapper from "@/components/ui-user/pendaftaran/FormWrapper"
import WaliForm from "@/components/ui-user/pendaftaran/form/WaliForm"
import NavigationButtons from "@/components/ui-user/pendaftaran/form/NavigationButtons"
import StepQuestion from "@/components/ui-user/pendaftaran/StepQuestion"
import { usePendaftaranID } from "@/hooks/usePendaftaranID"
import { useAuth } from "@/hooks/useAuth"
import { useForm } from "@/hooks/useForm"

export default function DataWaliPage() {
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
        pendidikan_wali: '',
        pekerjaan_wali: '',
        penghasilan_bulanan_wali: '',
        kebutuhan_khusus_wali: '',
    })

    // Masukkan data dari API ke dalam form
    useEffect(() => {
        if (existingData?.wali) {
            setFormData({
                nama: existingData.wali.nama || '',
                tahun_lahir: existingData.wali.tahun_lahir || '',
                pendidikan_wali: existingData.wali.pendidikan_wali || '',
                pekerjaan_wali: existingData.wali.pekerjaan_wali || '',
                penghasilan_bulanan_wali: existingData.wali.penghasilan_bulanan_wali || '',
                kebutuhan_khusus_wali: existingData.wali.kebutuhan_khusus_wali || '',
            })
            setIsSaved(true)
            setShowForm(true)
            setHasData(true)
        }
    }, [existingData])

    // Pengecekan perubahan data
    const hasChanges = useMemo(() => {
        if (!existingData?.wali) return true;
        
        return Object.keys(formData).some(key => {
            const val1 = formData[key] ?? '';
            const val2 = existingData.wali[key] ?? '';
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

            // Backend validation (fullPendaftaranSchema) requires complete identitas data
            const payload = {
                ...(existingData?.identitas || {}),
                wali: formData
            };

            const success = await submitForm(idPendaftaran, payload)

            if (success) {
                await mutate()
                setIsSaved(true)
                setHasData(true)
            }
        } catch (error) {
            console.error("Gagal simpan data wali:", error)
        }
    }

    const handleCancel = () => {
        if (existingData?.wali) {
            setFormData({
                nama: existingData.wali.nama || '',
                tahun_lahir: existingData.wali.tahun_lahir || '',
                pendidikan_wali: existingData.wali.pendidikan_wali || '',
                pekerjaan_wali: existingData.wali.pekerjaan_wali || '',
                penghasilan_bulanan_wali: existingData.wali.penghasilan_bulanan_wali || '',
                kebutuhan_khusus_wali: existingData.wali.kebutuhan_khusus_wali || '',
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
                body: JSON.stringify({ id_pendaftaran: idPendaftaran, step_key: 'data-wali' })
            });
            mutate();
        } catch (error) {
            console.error('Failed to skip step', error);
        }
        router.push('/user/dashboard/pendaftaran/data-periodik')
    }

    if (isFetching) {
        return <div className="flex justify-center items-center h-64">Memuat data...</div>
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {!showForm ? (
                <FormWrapper title="Data Wali" description="">
                    <StepQuestion
                        question="Apakah peserta memiliki data Wali yang ingin diisi?"
                        onYes={handleYes}
                        onNo={handleNo}
                        prevLink="/user/dashboard/pendaftaran/data-ibu"
                    />
                </FormWrapper>
            ) : (
                <FormWrapper
                    showWarning={true}
                    title="Data Wali"
                    description="Isi data wali jika peserta didik tinggal bersama wali (opsional)"
                >
                    <WaliForm 
                        ref={formRef}
                        readOnly={isSaved} 
                        formData={formData}
                        setFormData={setFormData}
                    />

                    <NavigationButtons
                        prevLink="/user/dashboard/pendaftaran/data-ibu"
                        nextLink="/user/dashboard/pendaftaran/data-periodik"
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
