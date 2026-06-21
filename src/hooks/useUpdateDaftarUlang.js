import { useState } from 'react'
import toast from 'react-hot-toast'

export function useUpdateDaftarUlang() {
    const [isUpdating, setIsUpdating] = useState(false)
    const [error, setError] = useState(null)

    const updateStatus = async (payload) => {
        setIsUpdating(true)
        setError(null)
        try {
            const res = await fetch('/api/admin/updatedaftarulang', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const result = await res.json()

            if (!res.ok || !result.success) {
                throw new Error(result.message || 'Gagal menyimpan status daftar ulang.')
            }

            toast.success('Status berhasil diperbarui!')
            return result;
        } catch (err) {
            setError(err.message)
            toast.error(err.message)
            throw err
        } finally {
            setIsUpdating(false)
        }
    }

    return {
        updateStatus,
        isUpdating,
        error
    }
}
