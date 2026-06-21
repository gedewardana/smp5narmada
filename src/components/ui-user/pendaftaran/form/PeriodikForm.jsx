'use client'

import { useState, useImperativeHandle, forwardRef } from 'react'
import { FormInput, FormSection, FormGrid } from './FormComponents'
import { 
    Stethoscope, 
    Activity, 
    MapPin, 
    Clock 
} from 'lucide-react'
import { scrollToFirstError } from '@/utils/focusHelper'
import { periodikSchema } from '@/utils/FormValidation'

const PeriodikForm = forwardRef(function PeriodikForm({ onSaveStatusChange, readOnly = false, formData, setFormData }, ref) {
    const [isSaved, setIsSaved] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})

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
        const result = periodikSchema.safeParse(formData)

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
            <fieldset disabled={readOnly} className={`space-y-0 transition-opacity ${readOnly ? 'opacity-60' : 'opacity-100'}`}>
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
                
                {/* SECTION: Kesehatan */}
                <FormSection 
                    title="Kesehatan Fisik" 
                    description="Informasi mengenai postur tubuh peserta didik" 
                    icon={Stethoscope}
                >
                    <div className="mt-5">
                        <FormGrid cols={2}>
                            <FormInput 
                                label="Tinggi Badan" 
                                name="tinggi_badan" 
                                value={formData.tinggi_badan} 
                                onChange={handleChange} 
                                onErrorClear={clearError}
                                type="number" 
                                icon={Activity} 
                                placeholder="cm" 
                                helpText="Contoh: 165"
                                required 
                                error={validationErrors.tinggi_badan?.[0]}
                            />
                            <FormInput 
                                label="Berat Badan" 
                                name="berat_badan" 
                                value={formData.berat_badan} 
                                onChange={handleChange} 
                                onErrorClear={clearError}
                                type="number" 
                                icon={Activity} 
                                placeholder="Contoh : 60 kg" 
                                helpText="Contoh: 55"
                                required 
                                error={validationErrors.berat_badan?.[0]}
                            />
                        </FormGrid>
                    </div>
                </FormSection>

                {/* SECTION: Transportasi */}
                <FormSection 
                    title="Transportasi & Jarak" 
                    description="Informasi mengenai jarak tempuh ke sekolah" 
                    icon={MapPin}
                >
                    <div className="mt-5">
                        <FormGrid cols={2}>
                            <FormInput 
                                label="Jarak ke Sekolah" 
                                name="jarak_tempat_tinggal_kesekolah" 
                                value={formData.jarak_tempat_tinggal_kesekolah} 
                                onChange={handleChange} 
                                onErrorClear={clearError}
                                type="number" 
                                icon={MapPin} 
                                placeholder="Contoh : 500 meter" 
                                helpText="Isi dengan angka (dalam meter)"
                                required 
                                error={validationErrors.jarak_tempat_tinggal_kesekolah?.[0]}
                            />
                            <FormInput 
                                label="Waktu Tempuh" 
                                name="waktu_tempuh_berangkat_sekolah" 
                                value={formData.waktu_tempuh_berangkat_sekolah} 
                                onChange={handleChange} 
                                onErrorClear={clearError}
                                type="number" 
                                icon={Clock} 
                                placeholder="Contoh : 30 menit"
                                helpText="Perkiraan waktu perjalanan"
                                required 
                                error={validationErrors.waktu_tempuh_berangkat_sekolah?.[0]}
                            />
                        </FormGrid>
                    </div>
                </FormSection>

            </fieldset>
        </form>
    )
})

export default PeriodikForm