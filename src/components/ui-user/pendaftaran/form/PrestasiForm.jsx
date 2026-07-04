'use client'

import { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import { FormInput, FormSection, FormGrid } from './FormComponents'
import { Button } from '@/components/ui/button'
import { prestasiSchema } from '@/utils/FormValidation'
import { useForm } from '@/hooks/useForm'
import { useAuth } from '@/hooks/useAuth'
import { usePendaftaranID } from '@/hooks/usePendaftaranID'
import PrestasiList from './PrestasiList'
import {
    Trophy,
    Medal,
    Type,
    Calendar,
    Building2,
    Upload,
    FileText,
    X,
    Eye,
    Plus,
    Save,
    Trash2
} from 'lucide-react'
import { scrollToFirstError } from '@/utils/focusHelper'

const EMPTY_PRESTASI = {
    jenis_prestasi: '',
    tingkat_prestasi: '',
    nama_prestasi: '',
    tahun_prestasi: '',
    penyelenggara: '',
    bukti_prestasi: null,
}

/**
 * Memotong nama file panjang, menjaga ekstensi tetap terlihat
 * Contoh: "sertifikat-olimpiade-sains-nasional-2024.pdf" → "sertifikat-olimpiade...2024.pdf"
 */
const truncateFileName = (name, maxLength = 5) => {
    if (!name || name.length <= maxLength) return name
    const lastDot = name.lastIndexOf('.')
    const ext = lastDot !== -1 ? name.slice(lastDot) : ''
    const base = lastDot !== -1 ? name.slice(0, lastDot) : name
    const keepStart = Math.max(maxLength - ext.length - 3, 8)
    return `${base.slice(0, keepStart)}...${ext}`
}

function PrestasiForm({ onListChange, readOnly = false }) {
    const { user } = useAuth()
    const { submitForm, isLoading: isSaving } = useForm()
    const idPendaftaran = user?.id_pendaftaran
    const { data: existingData, mutate } = usePendaftaranID(idPendaftaran)
    
    const [validationErrors, setValidationErrors] = useState({})
    const [prestasiList, setPrestasiList] = useState([])
    const [editingIndex, setEditingIndex] = useState(null)
    const [prestasi, setPrestasi] = useState(EMPTY_PRESTASI)

    const clearError = (fieldName) => {
        setValidationErrors(prev => {
            if (!prev[fieldName]) return prev
            const next = { ...prev }
            delete next[fieldName]
            return next
        })
    }
    
    // Load data dari API
    useEffect(() => {
        if (existingData?.prestasi) {
            const mapped = existingData.prestasi.map(p => ({
                ...p,
                penyelenggara: p.penyelenggara_prestasi,
            }))
            setPrestasiList(mapped)
            onListChange?.(mapped.length)
        }
    }, [existingData])

    // Sync ke initialData saat edit
    useEffect(() => {
        if (editingIndex !== null && prestasiList[editingIndex]) {
            setPrestasi(prestasiList[editingIndex])
        } else {
            setPrestasi(EMPTY_PRESTASI)
        }
    }, [editingIndex])

    const handleChange = (e) => {
        const { name, value } = e.target
        setPrestasi(prev => ({ ...prev, [name]: value }))
        clearError(name)
    }

    const fileRef = useRef(null)
    const MAX_FILE_SIZE_MB = 2
    const handleFileChange = (e) => {
        const file = e.target.files[0] || null
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
            if (!allowedTypes.includes(file.type)) {
                if (fileRef.current) fileRef.current.value = ''
                Swal.fire({
                    icon: 'error',
                    title: 'Format Tidak Sesuai',
                    text: 'Hanya file JPG, PNG, atau PDF yang diperbolehkan.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#ef4444',
                    customClass: { popup: 'rounded-3xl' }
                })
                return
            }

            const sizeMB = file.size / 1024 / 1024
            if (sizeMB > MAX_FILE_SIZE_MB) {
                if (fileRef.current) fileRef.current.value = ''
                Swal.fire({
                    icon: 'error',
                    title: 'File Terlalu Besar',
                    text: `Ukuran file maksimal ${MAX_FILE_SIZE_MB} MB. File yang dipilih berukuran ${sizeMB.toFixed(2)} MB.`,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#ef4444',
                })
                return
            }

            // Hapus file lama di Supabase jika sedang edit dan menimpa file
            if (typeof prestasi.bukti_prestasi === 'string') {
                deleteBukti(prestasi.bukti_prestasi) // jalan di background
            }
        }
        setPrestasi(prev => ({ ...prev, bukti_prestasi: file }))
    }
    
    const handleRemoveFile = () => {
        // Hapus file lama di Supabase jika sedang edit dan file dihapus
        if (typeof prestasi.bukti_prestasi === 'string') {
            deleteBukti(prestasi.bukti_prestasi) // jalan di background
        }
        setPrestasi(prev => ({ ...prev, bukti_prestasi: null }))
        if (fileRef.current) fileRef.current.value = ''
    }

    // Upload file ke Supabase Storage via API route server-side (bypass RLS)
    const uploadBukti = async (file) => {
        if (!file || typeof file === 'string') return file ?? null
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/upload/bukti-prestasi', {
            method: 'POST',
            body: formData,
        })
        const result = await res.json()
        if (!result.success) throw new Error(result.message || 'Gagal upload file')
        return result.url
    }

    // Hapus file dari Supabase Storage
    const deleteBukti = async (fileUrl) => {
        if (!fileUrl || typeof fileUrl !== 'string') return;
        try {
            await fetch(`/api/upload/bukti-prestasi?url=${encodeURIComponent(fileUrl)}`, {
                method: 'DELETE',
            })
        } catch (err) {
            console.error("Gagal menghapus file:", err)
        }
    }


    // Simpan list ke API
    const saveToApi = async (newList) => {
        if (!idPendaftaran) {
            Swal.fire({ icon: 'error', title: 'Sesi Berakhir', text: 'ID Pendaftaran tidak ditemukan.' })
            return false
        }
        try {
            // Upload semua File object ke Supabase Storage terlebih dahulu
            const sanitizedList = await Promise.all(
                newList.map(async ({ bukti_prestasi, ...rest }) => ({
                    ...rest,
                    bukti_prestasi: await uploadBukti(bukti_prestasi),
                }))
            )
            const payload = {
                ...(existingData?.identitas || {}),
                prestasi: sanitizedList,
            }
            const result = await submitForm(idPendaftaran, payload)
            return !!result
        } catch (err) {
            console.error("Gagal menyimpan data prestasi:", err)
            return false
        }
    }

    const handleSubmit = async () => {
        const result = prestasiSchema.safeParse(prestasi)
        if (!result.success) {
            // Konversi Zod issues ke format { field: [message] }
            const errors = {}
            for (const issue of result.error.issues) {
                const field = issue.path[0]
                if (field) {
                    if (!errors[field]) errors[field] = []
                    errors[field].push(issue.message)
                }
            }
            setValidationErrors(errors)
            scrollToFirstError(errors)
            return
        }
        setValidationErrors({})

        let newList
        if (editingIndex !== null) {
            newList = prestasiList.map((item, i) => i === editingIndex ? prestasi : item)
        } else {
            newList = [...prestasiList, prestasi]
        }

        Swal.fire({
            title: 'Menyimpan Data...',
            text: 'Mohon tunggu sebentar',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        })

        const success = await saveToApi(newList)
        if (success) {
            await mutate() // useEffect akan update prestasiList dari data server (URL Supabase)
            onListChange?.(newList.length)
            
            Swal.fire({
                icon: 'success',
                title: editingIndex !== null ? 'Diperbarui' : 'Ditambahkan',
                text: editingIndex !== null ? 'Data prestasi berhasil diperbarui.' : 'Data prestasi berhasil ditambahkan.',
                timer: 1500,
                showConfirmButton: false,
                customClass: {
                    popup: 'rounded-3xl'
                }
            })

            setEditingIndex(null)
            setPrestasi(EMPTY_PRESTASI)
        }
    }

    const handleEditClick = (index) => {
        setEditingIndex(index)
    }

    const handleCancelEdit = () => {
        setEditingIndex(null)
        setPrestasi(EMPTY_PRESTASI)
    }

    const handleDelete = async (index) => {
        const result = await Swal.fire({
            title: 'Hapus Prestasi?',
            text: "Data prestasi akan dihapus permanen.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            customClass: {
                popup: 'rounded-3xl',
                confirmButton: 'rounded-xl px-6 py-2.5 font-bold',
                cancelButton: 'rounded-xl px-6 py-2.5 font-bold'
            }
        })

        if (result.isConfirmed) {
            Swal.fire({
                title: 'Menghapus Data...',
                text: 'Mohon tunggu sebentar',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })

            const itemToDelete = prestasiList[index]
            if (itemToDelete?.bukti_prestasi && typeof itemToDelete.bukti_prestasi === 'string') {
                await deleteBukti(itemToDelete.bukti_prestasi)
            }

            const newList = prestasiList.filter((_, i) => i !== index)
            const success = await saveToApi(newList)
            if (success) {
                await mutate() // ambil data terbaru dari server
                onListChange?.(newList.length)
                if (editingIndex === index) {
                    setEditingIndex(null)
                    setPrestasi(EMPTY_PRESTASI)
                }
                Swal.fire({ icon: 'success', title: 'Dihapus', text: 'Data prestasi berhasil dihapus', timer: 1500, showConfirmButton: false })
            }
        }
    }

    const isEditing = editingIndex !== null

    return (
        <fieldset disabled={readOnly} className={`space-y-0 transition-opacity ${readOnly ? 'opacity-60' : 'opacity-100'}`}>
            <FormSection
                title={isEditing ? "Edit Data Prestasi" : "Tambah Prestasi"}
                description={isEditing ? "Ubah detail prestasi yang telah dipilih" : "Tambahkan prestasi maksimal 3 item terbaik"}
                icon={Trophy}
                className={isEditing ? "border-2 border-amber-200 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-amber-50/30" : ""}
            >
                <FormGrid cols={2}>
                    <FormInput
                        label="Jenis Prestasi"
                        name="jenis_prestasi"
                        value={prestasi.jenis_prestasi}
                        onChange={handleChange}
                        type="select"
                        options={['Akademik', 'Olahraga', 'Seni', 'Keagamaan', 'Lainnya']}
                        icon={Medal}
                       error={validationErrors.jenis_prestasi?.[0]} 
                        required
                    />
                    <FormInput
                        label="Tingkat"
                        name="tingkat_prestasi"
                        value={prestasi.tingkat_prestasi}
                        onChange={handleChange}
                        type="select"
                        options={['Sekolah', 'Kecamatan', 'Kabupaten/Kota', 'Provinsi', 'Nasional', 'Internasional']}
                        icon={Trophy}
                        required
                        error={validationErrors.tingkat_prestasi?.[0]} 
                    />
                </FormGrid>

                <div className="mt-5">
                    <FormGrid cols={1}>
                        <FormInput
                            label="Nama Prestasi"
                            name="nama_prestasi"
                            value={prestasi.nama_prestasi}
                            onChange={handleChange}
                            icon={Type}
                            placeholder="Contoh: Juara 1 Olimpiade Sains"
                            required
                            error={validationErrors.nama_prestasi?.[0]} 
                        />
                    </FormGrid>
                </div>

                <div className="mt-5">
                    <FormGrid cols={2}>
                        <FormInput
                            label="Tahun"
                            name="tahun_prestasi"
                            value={prestasi.tahun_prestasi}
                            onChange={handleChange}
                            type="number"
                            icon={Calendar}
                            placeholder="2024"
                            required
                            error={validationErrors.tahun_prestasi?.[0]} 
                        />
                        <FormInput
                            label="Penyelenggara"
                            name="penyelenggara"
                            value={prestasi.penyelenggara}
                            onChange={handleChange}
                            icon={Building2}
                            placeholder="Instansi / Organisasi"
                        />
                    </FormGrid>
                </div>

                {/* File Upload */}
                <div className="mt-6">
                    <label className="block text-[11px] font-extrabold text-gray-500 mb-2 uppercase tracking-widest ml-1">
                        Bukti Sertifikat / Piagam <span className="text-gray-400 font-normal lowercase italic">(Optional · JPG/PDF/PNG)</span>
                    </label>

                    {prestasi.bukti_prestasi ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-blue-200 rounded-2xl shadow-sm animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p
                                        className="text-sm font-bold text-red-500 pr-4 truncate"
                                        title={prestasi.bukti_prestasi.name ?? prestasi.bukti_prestasi}
                                    >
                                        {truncateFileName(
                                            prestasi.bukti_prestasi?.name
                                                ?? prestasi.bukti_prestasi?.split('/').pop()
                                                ?? 'File'
                                        )}
                                    </p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                                        {(prestasi.bukti_prestasi.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-end w-full sm:w-auto gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 mt-3 sm:mt-0">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (typeof prestasi.bukti_prestasi === 'string') {
                                            window.open(prestasi.bukti_prestasi, '_blank')
                                        } else {
                                            const url = URL.createObjectURL(prestasi.bukti_prestasi)
                                            window.open(url, '_blank')
                                        }
                                    }}
                                    className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-all active:scale-90"
                                    title="Lihat File"
                                >
                                    <Eye className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="p-2.5 rounded-xl hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-all active:scale-90"
                                    title="Hapus"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="w-full group relative flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 cursor-pointer overflow-hidden"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-500 mb-3 border border-gray-100">
                                <Upload className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-gray-700 group-hover:text-blue-700 transition-colors">Klik untuk Unggah</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Maksimal 2MB</p>
                            </div>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </button>
                    )}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className={`h-11 px-8 rounded-xl font-bold transition-all active:scale-95 shadow-md w-full sm:w-auto ${isEditing ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}
                    >
                        {isSaving ? 'Menyimpan...' : isEditing ? <><Save className="w-4 h-4 mr-2 shrink-0" />Simpan</> : <><Plus className="w-4 h-4 mr-2 shrink-0" />Tambah</>}
                    </Button>

                    {isEditing && (
                        <Button
                            type="button"
                            onClick={handleCancelEdit}
                            variant="outline"
                            className="h-11 px-8 rounded-xl font-bold border-gray-200 text-gray-500 hover:bg-gray-50 active:scale-95 w-full sm:w-auto"
                        >
                            Batal
                        </Button>
                    )}
                </div>

                {/* Pembatas Visual */}
                <div className="my-8 border-t border-gray-200"></div>

                {/* Daftar Prestasi */}
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                    📋 Daftar Prestasi ({prestasiList.length})
                </h3>
                <PrestasiList
                    data={prestasiList}
                    onDelete={handleDelete}
                    onEdit={handleEditClick}
                    isEditing={isEditing}
                />
            </FormSection>
        </fieldset>
    )
}

export default PrestasiForm