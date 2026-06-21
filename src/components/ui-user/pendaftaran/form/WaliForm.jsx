'use client'

import { useState, forwardRef, useImperativeHandle } from 'react'
import { FormInput, FormSection, FormGrid } from './FormComponents'
import { 
    User, 
    Calendar, 
    GraduationCap, 
    Briefcase, 
    Wallet,
    Stethoscope 
} from 'lucide-react'
import { useMultipleMaster } from '@/hooks/useMaster'
import { scrollToFirstError } from '@/utils/focusHelper'

import { waliSchema } from '@/utils/FormValidation'

const WaliForm = forwardRef(({ readOnly = false, formData, setFormData }, ref) => {

    const { masterData, isLoading: isMasterLoading } = useMultipleMaster([
        'pekerjaan', 'pendidikan', 'penghasilan_bulanan', 'kebutuhan_khusus'
    ])

    const [validationErrors, setValidationErrors] = useState({})

    const clearError = (fieldName) => {
        setValidationErrors(prev => {
            if (!prev[fieldName]) return prev
            const next = { ...prev }
            delete next[fieldName]
            return next
        })
    }

    useImperativeHandle(ref, () => ({
        validate: () => {
            const result = waliSchema.safeParse(formData)

            if (!result.success) {
                const errors = result.error.flatten().fieldErrors
                setValidationErrors(errors)
                scrollToFirstError(errors)
                return false
            }

            setValidationErrors({})
            return true
        }
    }))

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <fieldset disabled={readOnly} className={`space-y-0 transition-opacity ${readOnly ? 'opacity-60' : 'opacity-100'}`}>
            <FormSection 
                title="Informasi Wali" 
                description="Isi data wali jika peserta didik tinggal bersama wali (opsional). Kosongkan jika tinggal bersama orang tua." 
                icon={User}
            >
                <div className="mt-5">
                    <FormGrid cols={2}>
                        <FormInput
                            label="Nama Lengkap Wali"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            onErrorClear={clearError}
                            icon={User}
                            placeholder="Nama lengkap wali sesuai identitas"
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
                            name="pendidikan_wali" 
                            value={formData.pendidikan_wali} 
                            onChange={handleChange}
                            onErrorClear={clearError}
                            type="select" 
                            options={masterData?.pendidikan?.map((item) => ({ label: item.nama, value: item.id_pendidikan }))} 
                            icon={GraduationCap}
                            required
                            error={validationErrors.pendidikan_wali?.[0]}
                        />
                        <FormInput 
                            label="Pekerjaan" 
                            name="pekerjaan_wali" 
                            value={formData.pekerjaan_wali} 
                            onChange={handleChange}
                            onErrorClear={clearError}
                            type="select" 
                            options={masterData?.pekerjaan?.map((item) => ({ label: item.nama, value: item.id_pekerjaan }))} 
                            icon={Briefcase}
                            required
                            error={validationErrors.pekerjaan_wali?.[0]}
                        />
                        <FormInput 
                            label="Penghasilan Bulanan" 
                            name="penghasilan_bulanan_wali" 
                            value={formData.penghasilan_bulanan_wali} 
                            onChange={handleChange}
                            onErrorClear={clearError}
                            type="select" 
                            options={masterData?.penghasilan_bulanan?.map((item) => ({ label: item.rentang_penghasilan, value: item.id_penghasilan })) || []} 
                            icon={Wallet}
                            required
                            error={validationErrors.penghasilan_bulanan_wali?.[0]}
                        />
                        <FormInput 
                            label="Kebutuhan Khusus" 
                            name="kebutuhan_khusus_wali" 
                            value={formData.kebutuhan_khusus_wali} 
                            onChange={handleChange}
                            onErrorClear={clearError}
                            type="select" 
                            options={masterData?.kebutuhan_khusus?.map(item => ({ label: item.nama, value: item.id_kebutuhan })) || []} 
                            icon={Stethoscope}
                            required
                            error={validationErrors.kebutuhan_khusus_wali?.[0]}
                        />
                    </FormGrid>
                </div>
            </FormSection>
        </fieldset>
    )
})

export default WaliForm