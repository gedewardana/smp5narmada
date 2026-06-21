'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Calendar, Users, Info, Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { jadwalSchema } from '@/utils/jadwalvalidation'

// ─── Helper: format ISO date → YYYY-MM-DD untuk <input type="date"> ───
const toDateInput = (val) => {
    if (!val) return ''
    const d = new Date(val)
    if (isNaN(d.getTime())) return ''
    return d.toISOString().split('T')[0]
}

const INITIAL_FORM = {
    tahun_ajaran: '',
    daya_tampung_murid: '',
    status_jadwal: 'BELUM_DIBUKA',   // default sesuai skema Prisma
    pendaftaran_mulai: '',
    pendaftaran_selesai: '',
    pengumuman: '',
    pendaftaran_ulang_mulai: '',
    pendaftaran_ulang_selesai: '',
    masa_pengenalan_mulai: '',
    masa_pengenalan_selesai: '',
    mode_pendaftaran: 'ONLINE',       // default sesuai skema Prisma
    mode_pengumuman: 'ONLINE',        // default sesuai skema Prisma
    mode_pengenalan: 'OFFLINE',       // default sesuai skema Prisma
    mode_pendaftaran_ulang: 'OFFLINE',// default sesuai skema Prisma
}

const DATE_KEYS = [
    'pendaftaran_mulai',
    'pendaftaran_selesai',
    'pengumuman',
    'pendaftaran_ulang_mulai',
    'pendaftaran_ulang_selesai',
    'masa_pengenalan_mulai',
    'masa_pengenalan_selesai',
]

function FormModalJadwal({ selectedJadwal, onClose, onSubmit }) {
    const [formData, setFormData] = useState(() => {
        if (!selectedJadwal) return INITIAL_FORM

        // Normalisasi tanggal ISO → YYYY-MM-DD saat edit
        const normalized = { ...INITIAL_FORM, ...selectedJadwal }
        DATE_KEYS.forEach((key) => {
            normalized[key] = toDateInput(selectedJadwal[key])
        })
        return normalized
    })

    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    // Auto-hitung status_jadwal berdasarkan tanggal hari ini vs rentang pendaftaran
    useEffect(() => {
        const { pendaftaran_mulai, pendaftaran_selesai } = formData
        if (!pendaftaran_mulai || !pendaftaran_selesai) return

        const now = new Date()
        now.setHours(0, 0, 0, 0)

        // new Date('2026-05-23') diparse sebagai UTC midnight → di UTC+8 jadi jam 08:00 pagi lokal
        // Akibatnya now (00:00 lokal) < start (08:00 lokal) → selalu BELUM_DIBUKA ❌
        // Solusi: parse YYYY-MM-DD secara manual sebagai waktu LOKAL ✅
        const parseLocal = (str) => {
            const [y, m, d] = str.split('-').map(Number)
            return new Date(y, m - 1, d) // local midnight ✅
        }
        const start = parseLocal(pendaftaran_mulai)
        const end = parseLocal(pendaftaran_selesai)
        end.setHours(23, 59, 59, 999)

        let computed
        if (now < start) computed = 'BELUM_DIBUKA'
        else if (now > end) computed = 'DITUTUP'
        else computed = 'DIBUKA'

        setFormData((prev) => ({ ...prev, status_jadwal: computed }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.pendaftaran_mulai, formData.pendaftaran_selesai])

    const handleSubmit = async (e) => {
        e.preventDefault()

        // 1. Client-side Validation using Zod
        const parseResult = jadwalSchema.safeParse(formData)
        if (!parseResult.success) {
            const newErrors = {}
            parseResult.error.issues.forEach(err => {
                const field = err.path[0]
                if (!newErrors[field]) newErrors[field] = err.message
            })
            setErrors(newErrors)

            // Auto-focus ke elem pertama yang error
            const firstErrorField = Object.keys(newErrors)[0]
            if (firstErrorField) {
                const errorElement = document.querySelector(`[name="${firstErrorField}"]`)
                if (errorElement) errorElement.focus()
                toast.error(newErrors[firstErrorField])
            }
            return
        }

        const isEdit = !!selectedJadwal?.id_jadwal
        setLoading(true)
        setErrors({})

        try {
            await onSubmit(formData)
            toast.success(`Jadwal PMB berhasil ${isEdit ? 'diperbarui' : 'disimpan'}.`)
            onClose()
        } catch (err) {
            // Tangkap error validasi dari server (field-level)
            if (err?.errors) {
                setErrors(err.errors)
                const firstError = Object.values(err.errors)[0]
                if (firstError) toast.error(firstError)
                return
            }
            toast.error(err?.message || 'Gagal terhubung ke server.')
        } finally {
            setLoading(false)
        }
    }

    // Reusable UI 

    const inputCls = (name) =>
        `h-9 text-sm border transition-all
        ${errors[name] ? 'border-red-400 focus-visible:ring-red-300' : 'border-gray-200'}`

    const selectCls = (name) =>
        `w-full h-9 px-3 rounded-md border text-sm bg-white
         focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
        ${errors[name] ? 'border-red-400 ring-1 ring-red-300' : 'border-gray-200'}`

    const FieldLabel = ({ children }) => (
        <label className="text-xs font-medium text-gray-500 flex items-center gap-0.5">
            {children} <span className="text-red-400">*</span>
        </label>
    )

    // const FieldError = ({ name }) =>
    //     errors[name] ? <p className="text-[10px] text-red-400 leading-tight">{errors[name]}</p> : null

    const DateField = ({ label, name }) => (
        <div className="space-y-1">
            <FieldLabel>{label}</FieldLabel>
            {/* <FieldError name={name} /> */}
            <Input name={name} type="date" value={formData[name]} onChange={handleChange} className={inputCls(name)} />

        </div>
    )

    const ModeSelect = ({ name }) => (
        <div className="space-y-1">
            <FieldLabel>Mode</FieldLabel>
            {/* <FieldError name={name} /> */}
            <select name={name} value={formData[name]} onChange={handleChange} className={selectCls(name)}>
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
            </select>

        </div>
    )

    const SectionCard = ({ label, children }) => (
        <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
            {children}
        </div>
    )

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-full">

                {/* Header (Fixed) */}
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-slate-50 rounded-t-xl shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-800 leading-tight">
                                {selectedJadwal ? 'Edit Jadwal PMB' : 'Atur Jadwal PMB'}
                            </h2>
                            <p className="text-[11px] text-gray-400">
                                Sesuaikan periode pelaksanaan pendaftaran murid baru.{' '}
                                <span className="text-red-400">* Wajib diisi</span>
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} disabled={loading} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600 disabled:opacity-50">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form className="flex flex-col flex-1 min-h-0">
                    
                    {/* Body (Scrollable) */}
                    <div className="p-5 space-y-4 overflow-y-auto">

                        {/* Informasi Umum */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-semibold text-blue-600 flex items-center gap-1.5 border-b border-blue-50 pb-1.5">
                                <Info className="w-3.5 h-3.5" /> Informasi Umum
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <FieldLabel>Tahun Ajaran</FieldLabel>
                                    <Input
                                        name="tahun_ajaran"
                                        placeholder="2024/2025"
                                        value={formData.tahun_ajaran}
                                        onChange={handleChange}
                                        className={inputCls('tahun_ajaran')}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <FieldLabel>Daya Tampung</FieldLabel>
                                    <div className="relative">
                                        <Users className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5 z-10" />
                                        <Input
                                            name="daya_tampung_murid"
                                            type="number"
                                            min={1}
                                            placeholder="0"
                                            value={formData.daya_tampung_murid}
                                            onChange={handleChange}
                                            className={`${inputCls('daya_tampung_murid')} pl-8`}
                                        />
                                    </div>
                                </div>

                                {/* Status — otomatis dihitung dari tanggal pendaftaran */}
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        Status Jadwal
                                        <span className="text-[10px] text-blue-500 font-normal italic ml-1">· otomatis</span>
                                    </label>
                                    <select
                                        name="status_jadwal"
                                        value={formData.status_jadwal}
                                        onChange={handleChange}
                                        disabled={!!(formData.pendaftaran_mulai && formData.pendaftaran_selesai)}
                                        className={`${selectCls('status_jadwal')} disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed`}
                                    >
                                        <option value="BELUM_DIBUKA">Belum Dibuka</option>
                                        <option value="DIBUKA">Dibuka</option>
                                        <option value="DITUTUP">Ditutup</option>
                                    </select>
                                    {formData.pendaftaran_mulai && formData.pendaftaran_selesai && (
                                        <p className="text-[10px] text-blue-400 leading-tight">
                                            Dihitung otomatis dari rentang tanggal pendaftaran
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Periode Pelaksanaan */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-semibold text-blue-600 flex items-center gap-1.5 border-b border-blue-50 pb-1.5">
                                <Calendar className="w-3.5 h-3.5" /> Periode Pelaksanaan
                            </h3>

                            {/* Row 1: Pendaftaran + Pengumuman */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-2">

                                <SectionCard label="Tahap Pendaftaran">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <DateField label="Mulai" name="pendaftaran_mulai" />
                                        <DateField label="Selesai" name="pendaftaran_selesai" />
                                        <ModeSelect name="mode_pendaftaran" />
                                    </div>
                                </SectionCard>

                                <SectionCard label="Pengumuman Hasil">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <DateField label="Tanggal" name="pengumuman" />
                                        <ModeSelect name="mode_pengumuman" />
                                    </div>
                                </SectionCard>
                            </div>

                            {/* Row 2: Daftar Ulang + Pengenalan */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-2">
                                <SectionCard label="Daftar Ulang">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <DateField label="Mulai" name="pendaftaran_ulang_mulai" />
                                        <DateField label="Selesai" name="pendaftaran_ulang_selesai" />
                                        <ModeSelect name="mode_pendaftaran_ulang" />
                                    </div>
                                </SectionCard>
                                <SectionCard label="Masa Pengenalan Lingkungan">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <DateField label="Mulai" name="masa_pengenalan_mulai" />
                                        <DateField label="Selesai" name="masa_pengenalan_selesai" />
                                        <ModeSelect name="mode_pengenalan" />
                                    </div>
                                </SectionCard>
                            </div>
                        </div>
                    </div>

                    {/* Footer (Fixed) */}
                    <div className="flex items-center justify-end gap-2 border-t border-gray-100 p-4 bg-slate-50 rounded-b-xl shrink-0">
                        <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
                            Batal
                        </Button>
                        <Button type="submit" size="sm" disabled={loading} onClick={handleSubmit}>
                            {loading
                                ? <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />Menyimpan...</>
                                : <><Save className="w-3.5 h-3.5 mr-1" />Simpan</>
                            }
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default FormModalJadwal