'use client'
import { useState, useRef, useEffect, useMemo } from "react"
import FormWrapper from "@/components/ui-user/pendaftaran/FormWrapper"
import PeriodikForm from "@/components/ui-user/pendaftaran/form/PeriodikForm"
import NavigationButtons from "@/components/ui-user/pendaftaran/form/NavigationButtons"
import Swal from "sweetalert2"
import { useRouter } from 'next/navigation'
import { useForm } from '@/hooks/useForm'
import { useAuth } from '@/hooks/useAuth'
import { usePendaftaranID } from '@/hooks/usePendaftaranID'

export default function DataPeriodikPage() {
    const router = useRouter()
    const formRef = useRef()
    const { user } = useAuth()
    const { submitForm, isLoading: isSaving } = useForm()

    const [isSaved, setIsSaved] = useState(false)
    const [hasData, setHasData] = useState(false)

    const idPendaftaran = user?.id_pendaftaran

    const { data: existingData, isLoading: isFetching, mutate } = usePendaftaranID(idPendaftaran)

    const [formData, setFormData] = useState({
        tinggi_badan: '',
        berat_badan: '',
        jarak_tempat_tinggal_kesekolah: '',
        waktu_tempuh_berangkat_sekolah: '',
    })

    // Masukkan data dari API ke dalam form
    useEffect(() => {
        if (existingData?.periodik) {
            setFormData(prev => ({
                ...prev,
                ...existingData.periodik
            }))
            setIsSaved(true)
            setHasData(true)
        }
    }, [existingData])

    // Deteksi perubahan data
    const hasChanges = useMemo(() => {
        if (!existingData?.periodik) return true;
        
        const fieldsToCompare = Object.keys(formData);
        
        return fieldsToCompare.some(key => {
            const val1 = formData[key] ?? '';
            let val2 = existingData.periodik[key] ?? '';

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
                periodik: formData
            };

            const success = await submitForm(idPendaftaran, payload)

            if (success) {
                await mutate()
                setIsSaved(true)
                setHasData(true)
                
                Swal.fire({
                    icon: 'success',
                    title: 'Tersimpan!',
                    text: 'Data periodik berhasil disimpan.',
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-3xl' }
                })
            }
        } catch (error) {
            console.error("Gagal simpan data periodik:", error)
        }
    }

    const handleCancel = () => {
        if (existingData?.periodik) {
            setFormData(prev => ({
                ...prev,
                ...existingData.periodik
            }))
        }
        setIsSaved(true)
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isFetching ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
            ) : (
                <FormWrapper
                    showWarning={true}
                    title="Data Periodik"
                    description="Informasi kesehatan dan tempat tinggal peserta didik"
                >
                    <PeriodikForm 
                        ref={formRef}
                        formData={formData}
                        setFormData={setFormData}
                        onSaveStatusChange={setIsSaved}
                        readOnly={isSaved} 
                    />

                    <NavigationButtons
                        prevLink="/user/dashboard/pendaftaran/data-wali"
                        nextLink="/user/dashboard/pendaftaran/data-prestasi"
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
