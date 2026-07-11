'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import FormWrapper from '@/components/ui-user/pendaftaran/FormWrapper'
import NavigationButtons from '@/components/ui-user/pendaftaran/form/NavigationButtons'
import BerkasUploadList from '@/components/ui-user/pendaftaran/persyaratan/BerkasUploadList'
import { useAuth } from '@/hooks/useAuth'
import { usePendaftaranID } from '@/hooks/usePendaftaranID'
import { useForm } from '@/hooks/useForm'

export default function PersyaratanPage() {
    const router = useRouter()
    const { user } = useAuth()
    const idPendaftaran = user?.id_pendaftaran

    const { data: existingData, isLoading: isFetching, mutate } = usePendaftaranID(idPendaftaran)
    const { submitPersyaratan, isLoading: isSaving } = useForm()

    const [uploadedFiles, setUploadedFiles] = useState([])

    // Sync state dengan data dari database saat load
    useEffect(() => {
        if (existingData?.berkas_persyaratan) {
            setUploadedFiles(existingData.berkas_persyaratan)
        }
    }, [existingData])

    // Upload file ke server via endpoint yang sama dengan prestasi
    const uploadBukti = async (file) => {
        if (!file) return null
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/upload/persyaratan', {
            method: 'POST',
            body: formData,
        })
        const result = await res.json()
        if (!result.success) throw new Error(result.message || 'Gagal upload file')
        return result.url
    }

    // Hapus file dari Supabase Storage
    const deleteBerkas = async (fileUrl) => {
        if (!fileUrl || typeof fileUrl !== 'string') return;
        try {
            await fetch(`/api/upload/persyaratan?url=${encodeURIComponent(fileUrl)}`, {
                method: 'DELETE',
            })
        } catch (err) {
            console.error("Gagal menghapus file persyaratan:", err)
        }
    }

    const handleFileSelect = async (jenisBerkas, file) => {
        if (!idPendaftaran) {
            Swal.fire('Error', 'Sesi pendaftaran tidak valid.', 'error')
            return
        }

        // Validasi file
        const maxSize = 2 * 1024 * 1024 // 2MB
        if (file.size > maxSize) {
            Swal.fire('File Terlalu Besar', 'Ukuran file maksimal 2MB!', 'warning')
            return
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
        if (!allowedTypes.includes(file.type)) {
            Swal.fire('Format Salah', 'Format file harus JPG, PNG, atau PDF!', 'warning')
            return
        }

        try {
            Swal.fire({
                title: 'Mengunggah File...',
                text: 'Mohon tunggu',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            })

            // 1. Upload ke Storage
            const pathUrl = await uploadBukti(file)

            // Hapus file lama jika sedang melakukan replace (timpa file)
            const oldFile = uploadedFiles.find(f => f.jenis_berkas === jenisBerkas)
            if (oldFile?.path_file && typeof oldFile.path_file === 'string') {
                await deleteBerkas(oldFile.path_file)
            }

            // 2. Buat objek berkas baru (sesuaikan dengan schema)
            const newFile = {
                jenis_berkas: jenisBerkas,
                nama_file: file.name,
                path_file: pathUrl,
                mandatory: true,
                status_upload: 'UPLOADED'
            }

            // 3. Masukkan ke dalam list sementara
            const filtered = uploadedFiles.filter(f => f.jenis_berkas !== jenisBerkas)
            const newList = [...filtered, newFile]

            // 4. Save ke Database via API
            await submitPersyaratan(idPendaftaran, newList)
            await mutate() // Update cache SWR (ini akan memicu useEffect untuk update setUploadedFiles)

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Berhasil Diunggah',
                text: file.name,
                showConfirmButton: false,
                timer: 2500,
                customClass: { popup: 'rounded-3xl' }
            })
        } catch (error) {
            console.error("Upload error:", error)
            Swal.fire('Gagal', error.message || 'Terjadi kesalahan saat mengunggah berkas.', 'error')
        }
    }

    const handleDelete = async (jenisBerkas) => {
        const result = await Swal.fire({
            title: 'Yakin hapus?',
            text: 'Berkas ini akan dihapus permanen dari pendaftaran.',
            icon: 'warning',
            showCancelButton: true
        })

        if (result.isConfirmed) {
            try {
                Swal.fire({ title: 'Menghapus...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })

                // Hapus file fisik di Supabase
                const itemToDelete = uploadedFiles.find(f => f.jenis_berkas === jenisBerkas)
                if (itemToDelete?.path_file && typeof itemToDelete.path_file === 'string') {
                    await deleteBerkas(itemToDelete.path_file)
                }

                // Gunakan jenis_berkas sebagai identifier yang lebih aman
                const newList = uploadedFiles.filter(f => f.jenis_berkas !== jenisBerkas)

                await submitPersyaratan(idPendaftaran, newList)
                await mutate() // Update cache SWR (ini akan memicu useEffect)

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Berkas Dihapus',
                    showConfirmButton: false,
                    timer: 2500,
                    customClass: { popup: 'rounded-3xl' }
                })
            } catch (error) {
                console.error("Delete error:", error)
                Swal.fire('Gagal', error.message || 'Gagal menghapus berkas.', 'error')
            }
        }
    }

    // Konfirmasi sebelum lanjut ke ringkasan
    const handleNext = async () => {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Konfirmasi Berkas',
            html: `
                <p class="text-gray-600">Pastikan semua dokumen yang diunggah sudah <strong>benar, jelas, dan terbaca</strong>.</p>
            `,
            showCancelButton: true,
            confirmButtonText: '✅ Ya, sudah benar',
            cancelButtonText: '🔍 Cek kembali',
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#6b7280',
            reverseButtons: true,
        })

        if (result.isConfirmed) {
            router.push('/user/dashboard/pendaftaran/review-data')
        }
    }

    // Cek apakah semua berkas mandatory sudah diupload
    const mandatoryTypes = ['AKTA', 'KK', 'SKL']
    const uploadedMandatory = uploadedFiles.filter(f => mandatoryTypes.includes(f.jenis_berkas))
    const allMandatoryUploaded = uploadedMandatory.length === mandatoryTypes.length

    if (isFetching && uploadedFiles.length === 0) {
        return <div className="flex justify-center p-12"><div className="animate-pulse w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" /></div>
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">

            <FormWrapper
                showWarning={true}
                title="Upload Berkas Persyaratan"
                description="Upload semua berkas yang diperlukan untuk proses pendaftaran"
            >
                {/* Info Alert - Professional */}
                <div className="flex items-start gap-4 p-5 bg-blue-50/50 border border-blue-100 rounded-2xl mb-8">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight mb-2">Petunjuk Upload Berkas</h4>
                        <ul className="space-y-1">
                            {[
                                'Format file: JPG, PNG, atau PDF',
                                'Ukuran maksimal: 2MB per file',
                                'Pastikan file jelas, tidak buram, dan mudah dibaca',
                                'Berkas dengan tanda (*) merupakan berkas wajib'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-xs text-blue-700 font-medium">
                                    <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>



                {/* Upload List */}
                <BerkasUploadList
                    uploadedFiles={uploadedFiles}
                    onFileSelect={handleFileSelect}
                    onDelete={handleDelete}
                    disabled={isSaving}
                />

                {/* Completion Status - Inline, clean */}
                {!allMandatoryUploaded && (
                    <div className="mt-6 flex items-center gap-3 p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
                        <p className="text-xs text-amber-700 font-bold">
                            {uploadedMandatory.length} dari {mandatoryTypes.length} berkas wajib terunggah — selesaikan sebelum melanjutkan
                        </p>
                    </div>
                )}


                {/* Navigation — Selanjutnya aktif hanya kalau semua berkas wajib sudah terupload */}
                <NavigationButtons
                    prevLink="/user/dashboard/pendaftaran/data-prestasi"
                    nextLink="/user/dashboard/pendaftaran/review-data"
                    onNext={handleNext}
                    isFirstStep={false}
                    isLastStep={false}
                    showSaveButton={false}
                    alwaysEnableNext={allMandatoryUploaded}
                />
            </FormWrapper>
        </div>
    )
}

