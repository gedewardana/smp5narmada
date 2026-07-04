'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import RingkasanData from '@/components/ui-user/pendaftaran/form/ReviewData'
import FormWrapper from "@/components/ui-user/pendaftaran/FormWrapper"
import NavigationButtons from "@/components/ui-user/pendaftaran/form/NavigationButtons"
import { FormCheckbox } from '@/components/ui-user/pendaftaran/form/FormComponents'
import Swal from 'sweetalert2'
import { useAuth } from '@/hooks/useAuth'
import { usePendaftaranID } from '@/hooks/usePendaftaranID'
import { useSubmitPendaftaran } from '@/hooks/useSubmitPendaftaran'
import { CheckCircle } from 'lucide-react'


function RingkasanDataPage() {
    const router = useRouter()
    const { user } = useAuth()
    const idPendaftaran = user?.id_pendaftaran
    const { data: realData, isLoading } = usePendaftaranID(idPendaftaran)
    const { submitForm, isSubmitting } = useSubmitPendaftaran()

    // controler
    const [isSaved, setIsSaved] = useState(false)
    const [isAgreed, setIsAgreed] = useState(false)   // Checkbox pernyataan setting 

    const handleSubmit = async () => {
        if (isSaved) {
            setIsSaved(false)
            return
        }

        // Tahap 1 — Konfirmasi
        const result = await Swal.fire({
            title: 'Apakah data pendaftaran sudah benar?',
            text: 'Pastikan semua data yang diisi sudah sesuai dengan dokumen resmi.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '✅ Sudah Benar, Kirim',
            cancelButtonText: '🔍 Cek Kembali',
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#6b7280',
            reverseButtons: true,
        })

        if (!result.isConfirmed) return

        // Tahap 2 — Eksekusi submit ke API
        try {
            Swal.fire({
                title: 'Mengirim pendaftaran...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            })

            await submitForm(idPendaftaran)

            await Swal.fire({
                icon: 'success',
                title: 'Pendaftaran Berhasil! 🎉',
                text: 'Data pendaftaran Anda telah berhasil dikirim. Tunggu verifikasi panitia.',
                confirmButtonText: 'Lihat Status',
                confirmButtonColor: '#16a34a',
            })

            // Redirect ke dashboard pendaftaran untuk melihat status
            router.push("/user/dashboard/pendaftaran")
            // window.location.href

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal Submit',
                text: err.message || 'Terjadi kesalahan saat mengirim pendaftaran.',
                confirmButtonColor: '#dc2626',
            })
        }
    }

    if (isLoading) {
        return <div className="flex justify-center p-12"><div className="animate-pulse w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" /></div>
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <FormWrapper
                title="Review Data Pendaftaran"
                description="Pastikan data lengkap dan benar sesuai dokumen resmi"
                showWarning={false}
            >
                <RingkasanData data={realData} readOnly={isSaved} />

                {/* Checkbox Pernyataan */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
                    <h4 className="font-bold text-gray-800 mb-4">Pernyataan Validitas Data</h4>
                    <div className="flex flex-col gap-3">
                        <FormCheckbox
                            label="Saya bertanggung jawab secara hukum terhadap kebenaran data yang tercantum."
                            checked={isAgreed}
                            onChange={(e) => setIsAgreed(e.target.checked)}
                        />
                    </div>
                    <p className="text-xs text-amber-600 mt-3 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Centang pernyataan di atas untuk mengaktifkan tombol Submit.
                    </p>
                </div>
                {/* Template Tanda Tangan */}
                {/* <div className='flex flex-col ml-[500px] -mt-8'>
                    <TemplateTTD readOnly={isSaved} />
                </div> */}
                <NavigationButtons
                    prevLink="/user/dashboard/pendaftaran/persyaratan"
                    onSave={handleSubmit}
                    isFirstStep={false}
                    isLastStep={true}
                    mode={isSaved ? 'view' : 'input'}
                    showSaveButton={false}
                    submitFinall={!isAgreed || isSubmitting} // disabled saat belum centang atau sedang submit
                />
            </FormWrapper>



        </div>
    )
}

export default RingkasanDataPage