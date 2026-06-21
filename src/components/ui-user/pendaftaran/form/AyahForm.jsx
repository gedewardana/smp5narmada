'use client'

import { useState, useImperativeHandle, forwardRef } from 'react'
import { FormInput, FormSection, FormGrid } from './FormComponents'
import { User, Calendar, GraduationCap, Briefcase, Wallet, Stethoscope } from 'lucide-react'
import { useMultipleMaster } from '@/hooks/useMaster'
import { ayahSchema } from '@/utils/FormValidation'
import { scrollToFirstError } from '@/utils/focusHelper'

const AyahForm = forwardRef(function AyahForm({ onSaveStatusChange, readOnly = false, formData, setFormData }, ref) {
    const [isSaved, setIsSaved] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})

    const { masterData, isLoading: isMasterLoading } = useMultipleMaster([
        'pekerjaan', 'pendidikan', 'penghasilan_bulanan', 'kebutuhan_khusus'
    ])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const clearError = (fieldName) => {
        setValidationErrors(prev => {
            if (!prev[fieldName]) return prev
            const next = { ...prev }
            delete next[fieldName]
            return next
        })
    }

    const validateForm = () => {
        const result = ayahSchema.safeParse(formData)

        if (!result.success) {
            const fieldErrors = Object.fromEntries(
                Object.entries(result.error.flatten().fieldErrors)
                    .filter(([, v]) => v !== undefined && v !== null)
            )
            setValidationErrors(fieldErrors)
            scrollToFirstError(fieldErrors)
            return false
        }

        setValidationErrors({})
        return true
    }

    useImperativeHandle(ref, () => ({
        validate: () => validateForm(),
        getFormData: () => formData,
        setSaved: (val) => {
            setIsSaved(val)
            onSaveStatusChange?.(val)
        },
        isSaved,
    }))

    return (
        <form className="space-y-4">
            <fieldset disabled={readOnly || isMasterLoading} className={`space-y-0 transition-opacity ${(readOnly || isMasterLoading) ? 'opacity-60' : 'opacity-100'}`}>
                {Object.keys(validationErrors).length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div>
                        <div>
                            <span className="font-bold">Mohon periksa kembali isian Anda.</span>
                            <ul className="mt-1 ml-4 list-disc text-xs space-y-1">
                                {Object.values(validationErrors).filter(Boolean).slice(0, 3).map((errs, i) => (
                                    <li key={i}>{Array.isArray(errs) ? errs[0] : errs}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                
                <FormSection
                    title="Informasi Ayah Kandung"
                    description="Lengkapi data identitas dan pekerjaan ayah"
                    icon={User}
                >
                    <div className="mt-5">
                        <FormGrid cols={2}>
                            <FormInput
                                label="Nama Lengkap Ayah"
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                onErrorClear={clearError}
                                icon={User}
                                placeholder="Nama lengkap sesuai KK"
                                required
                                error={validationErrors.nama?.[0]}
                            />
                            <FormInput
                                label="Tahun Lahir"
                                name="tahun_lahir"
                                value={formData.tahun_lahir}
                                onChange={handleChange}
                                onErrorClear={clearError}
                                type="number"
                                icon={Calendar}
                                required
                                placeholder="Contoh: 1980"
                                error={validationErrors.tahun_lahir?.[0]}
                            />
                            <FormInput
                                label="Pendidikan Terakhir"
                                name="pendidikan_ayah"
                                value={formData.pendidikan_ayah}
                                onChange={handleChange}
                                onErrorClear={clearError}
                                type="select"
                                options={masterData?.pendidikan?.map((item) => ({ label: item.nama, value: item.id_pendidikan }))}
                                icon={GraduationCap}
                                required
                                error={validationErrors.pendidikan_ayah?.[0]}
                            />
                            <FormInput
                                label="Pekerjaan"
                                name="pekerjaan_ayah"
                                value={formData.pekerjaan_ayah}
                                onChange={handleChange}
                                onErrorClear={clearError}
                                type="select"
                                options={masterData?.pekerjaan?.map((item) => ({ label: item.nama, value: item.id_pekerjaan }))}
                                icon={Briefcase}
                                required
                                error={validationErrors.pekerjaan_ayah?.[0]}
                            />
                            <FormInput
                                label="Penghasilan Bulanan"
                                name="penghasilan_bulanan_ayah"
                                value={formData.penghasilan_bulanan_ayah}
                                onChange={handleChange}
                                onErrorClear={clearError}
                                type="select"
                                options={masterData?.penghasilan_bulanan?.map((item) => ({ label: item.rentang_penghasilan, value: item.id_penghasilan })) || []}
                                icon={Wallet}
                                required
                                error={validationErrors.penghasilan_bulanan_ayah?.[0]}
                            />
                            <FormInput
                                label="Kebutuhan Khusus"
                                name="kebutuhan_khusus_ayah"
                                value={formData.kebutuhan_khusus_ayah}
                                onChange={handleChange}
                                onErrorClear={clearError}
                                type="select"
                                options={masterData.kebutuhan_khusus?.map(item => ({ label: item.nama, value: item.id_kebutuhan })) || []}
                                icon={Stethoscope}
                                error={validationErrors.kebutuhan_khusus_ayah?.[0]}
                            required
                            />
                        </FormGrid>
                    </div>
                </FormSection>
            </fieldset>
        </form>
    )
})

export default AyahForm