'use client'

import { FormInput, FormGrid } from './FormComponents'
import { MapPin } from 'lucide-react'
import { useWilayah } from '@/hooks/useWilayah'

/**
 * Cascading Dropdown untuk Wilayah Indonesia
 * Urutan: Provinsi → Kabupaten → Kecamatan → Kelurahan
 */
function WilayahDropdown({ initialData, onChange, disabled = false, errors = {} }) {
    // Panggil hooks kustom untuk clean code
    const { data: provinsiList } = useWilayah('provinsi')
    const { data: kabupatenList } = useWilayah('kabupaten', initialData?.id_provinsi)
    const { data: kecamatanList } = useWilayah('kecamatan', initialData?.id_kabupaten)
    const { data: kelurahanList } = useWilayah('kelurahan', initialData?.id_kecamatan)

    const handleFieldChange = (name, value) => {
        const id = value ? parseInt(value) : null
        let newData = { ...initialData, [name]: id }
        let kodePos = undefined;

        if (name === 'id_provinsi') {
            newData = { ...newData, id_kabupaten: null, id_kecamatan: null, id_kelurahan: null, id_dusun: null }
        } else if (name === 'id_kabupaten') {
            newData = { ...newData, id_kecamatan: null, id_kelurahan: null}
        } else if (name === 'id_kecamatan') {
            newData = { ...newData, id_kelurahan: null}
        } else if (name === 'id_kelurahan') {
            const selected = kelurahanList?.find(k => k.id_kelurahan === id)
            if (selected) {
                kodePos = selected.kode_pos
            }
        }

        onChange(newData, kodePos)
    }

    return (
        <FormGrid cols={2}>
            <FormInput 
                label="Provinsi" 
                name="id_provinsi" 
                value={initialData?.id_provinsi || ''} 
                onChange={(e) => handleFieldChange('id_provinsi', e.target.value)} 
                type="select" 
                options={provinsiList?.map(p => ({ label: p.nama_provinsi, value: p.id_provinsi })) || []}
                icon={MapPin}
                required 
                disabled={disabled}
                error={errors.id_provinsi?.[0]}
            />

            <FormInput 
                label="Kabupaten/Kota" 
                name="id_kabupaten" 
                value={initialData?.id_kabupaten || ''} 
                onChange={(e) => handleFieldChange('id_kabupaten', e.target.value)} 
                type="select" 
                options={kabupatenList?.map(k => ({ label: k.nama_kabupaten, value: k.id_kabupaten })) || []}
                icon={MapPin}
                required 
                helpText="Aktif setelah memilih provinsi"
                className={!initialData?.id_provinsi ? 'opacity-50' : ''}
                disabled={disabled || !initialData?.id_provinsi}
                error={errors.id_kabupaten?.[0]}
            />

            <FormInput 
                label="Kecamatan" 
                name="id_kecamatan" 
                value={initialData?.id_kecamatan || ''} 
                onChange={(e) => handleFieldChange('id_kecamatan', e.target.value)} 
                type="select" 
                options={kecamatanList?.map(k => ({ label: k.nama_kecamatan, value: k.id_kecamatan })) || []}
                icon={MapPin}
                required 
                helpText="Aktif setelah memilih kabupaten"
                className={!initialData?.id_kabupaten ? 'opacity-50' : ''}
                disabled={disabled || !initialData?.id_kabupaten}
                error={errors.id_kecamatan?.[0]}
            />

            <FormInput 
                label="Kelurahan" 
                name="id_kelurahan" 
                value={initialData?.id_kelurahan || ''} 
                onChange={(e) => handleFieldChange('id_kelurahan', e.target.value)} 
                type="select" 
                options={kelurahanList?.map(k => ({ label: k.kelurahan_desa, value: k.id_kelurahan })) || []}
                icon={MapPin}
                required 
                helpText="Aktif setelah memilih kecamatan"
                className={!initialData?.id_kecamatan ? 'opacity-50' : ''}
                disabled={disabled || !initialData?.id_kecamatan}
                error={errors.id_kelurahan?.[0]}
            />

        </FormGrid>
    )
}

export default WilayahDropdown
