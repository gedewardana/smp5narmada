import { useState } from 'react'
import toast from 'react-hot-toast'

/**
 * Custom hook terpisah khusus untuk menghandle operasi UPDATE pengumuman
 * (memisahkan urusan Fetching HTTP dan loading UI dari kerumitan Komponen Visual)
 */
export function useUpdateSeleksi() {
    const [isUpdating, setIsUpdating] = useState(false)
    const [error, setError] = useState(null)

    const updateSeleksi = async (payload) => {
        setIsUpdating(true)
        setError(null)
        try {
            const res = await fetch('/api/admin/updatepengumuman', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const result = await res.json()

            if (!res.ok || !result.success) {
                throw new Error(result.message || 'Gagal menyimpan status seleksi pengumuman.')
            }

            toast.success('Status seleksi berhasil diperbarui!')
            return result;
        } catch (err) {
            toast.error(err.message || 'Terjadi kesalahan sistem')
            setError(err.message)
            throw err
        } finally {
            setIsUpdating(false)
        }
    }

    const updateSeleksiMassal = async (payload) => {
        setIsUpdating(true)
        setError(null)
        try {
            const res = await fetch('/api/admin/bulkactionpengumuman', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const result = await res.json()

            if (!res.ok || !result.success) {
                throw new Error(result.message || result.error || 'Gagal melakukan update massal pengumuman.')
            }

            toast.success('Pengumuman massal berhasil dirilis!')
            return result;
        } catch (err) {
            toast.error(err.message || 'Terjadi kesalahan sistem')
            setError(err.message)
            throw err
        } finally {
            setIsUpdating(false)
        }
    }

    return {
        updateSeleksi,
        updateSeleksiMassal,
        isUpdating,
        error
    }
}
