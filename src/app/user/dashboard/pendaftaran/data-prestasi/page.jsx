'use client'
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import FormWrapper from "@/components/ui-user/pendaftaran/FormWrapper"
import PrestasiForm from "@/components/ui-user/pendaftaran/form/PrestasiForm"
import NavigationButtons from "@/components/ui-user/pendaftaran/form/NavigationButtons"
import StepQuestion from "@/components/ui-user/pendaftaran/StepQuestion"
import { useAuth } from "@/hooks/useAuth"
import { usePendaftaranID } from "@/hooks/usePendaftaranID"
import { mutate } from "swr"

export default function DataPrestasiPage() {
    const router = useRouter()
    const { user } = useAuth()
    const idPendaftaran = user?.id_pendaftaran
    const { data: existingData } = usePendaftaranID(idPendaftaran)
    const [showForm, setShowForm] = useState(false)
    const [listCount, setListCount] = useState(0)

    useEffect(() => {
        if (existingData?.prestasi && existingData.prestasi.length > 0) {
            setShowForm(true)
        }
    }, [existingData])

    const handleYes = () => setShowForm(true)

    const handleNo = async () => {
        if (idPendaftaran) {
            try {
                await fetch('/api/pendaftaran/skip', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_pendaftaran: idPendaftaran, step_key: 'data-prestasi' })
                });
                mutate(`/api/pendaftaran/${idPendaftaran}`);
            } catch (error) {
                console.error('Failed to skip step', error);
            }
        }
        router.push('/user/dashboard/pendaftaran/persyaratan')
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {!showForm ? (
                <FormWrapper title="Data Prestasi" description="">
                    <StepQuestion
                        question="Apakah peserta memiliki prestasi yang ingin diisi?"
                        onYes={handleYes}
                        onNo={handleNo}
                        prevLink="/user/dashboard/pendaftaran/data-periodik"
                    />
                </FormWrapper>
            ) : (
                <FormWrapper
                    title="Data Prestasi"
                    description="Tambahkan prestasi yang pernah diraih (akademik maupun non-akademik)"
                >
                    <PrestasiForm onListChange={setListCount} />

                    <NavigationButtons
                        prevLink="/user/dashboard/pendaftaran/data-periodik"
                        nextLink="/user/dashboard/pendaftaran/persyaratan"
                        isFirstStep={false}
                        isLastStep={false}
                        showSaveButton={false}
                        alwaysEnableNext={listCount > 0}
                    />
                </FormWrapper>
            )}
        </div>
    )
}
