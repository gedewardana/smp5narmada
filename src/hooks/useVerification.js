// hooks/useVerification.js
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'

export const VERIFICATION_ACTIONS = {
  verifikasi: { label: 'Diverifikasi', color: 'emerald', requiresNote: false, dbStatus: 'VERIFIKASI' },
  perbaikan: { label: 'Minta Perbaikan', color: 'amber', requiresNote: true, dbStatus: 'PERLU_PERBAIKAN' },
  tolak: { label: 'Ditolak', color: 'rose', requiresNote: true, dbStatus: 'TOLAK' }
}

export function useVerification(pendaftaran, onClose, onSubmit) {
  const router = useRouter()
  const { data: session } = useSession()

  // 1. Inisialisasi state action berdasarkan status pendaftaran
  const getInitialAction = () => {
    if (!pendaftaran) return ''
    const status = pendaftaran.status_verifikasi
    if (status === 'VERIFIKASI') return 'verifikasi'
    if (status === 'PERLU_PERBAIKAN') return 'perbaikan'
    if (status === 'TOLAK') return 'tolak'
    return ''
  }

  // 2. State untuk menyimpan aksi yang dipilih, catatan, loading, dan error
  const [action, setAction] = useState(getInitialAction)
  const [note, setNote] = useState(pendaftaran?.catatan || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 3. Fungsi untuk memilih aksi
  const selectAction = useCallback((id) => {
    setAction(id)
    setError('')
  }, [])

  // 4. Fungsi untuk update catatan
  const updateNote = useCallback((value) => {
    setNote(value.slice(0, 1000))
    setError('')
  }, [])

  // 5. Fungsi untuk validasi
  const validate = useCallback(() => {
    if (!action) return 'Pilih aksi verifikasi terlebih dahulu'
    if (VERIFICATION_ACTIONS[action].requiresNote && !note.trim()) {
      return 'Catatan wajib diisi untuk aksi ini'
    }
    return null
  }, [action, note])

  const submit = useCallback(async () => {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      toast.error(validationError)
      return
    }

    if (!session?.user?.id_pengguna) {
      toast.error('Sesi tidak valid, login ulang')
      return;
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/verification/${pendaftaran.id_pendaftaran}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status_verifikasi: VERIFICATION_ACTIONS[action].dbStatus,
          catatan: note.trim() || undefined,
          diverifikasi_oleh: session.user.id_pengguna
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal melakukan verifikasi');
      }

      onSubmit?.({
        action,
        catatan: note.trim(),
        pendaftaranId: pendaftaran.id_pendaftaran,
        timestamp: Date.now(),
        data: data
      })

      const nama = pendaftaran.identitas_peserta_didik?.nama_lengkap || pendaftaran.nama_lengkap || 'Pendaftar';
      toast.success(`${nama} — ${VERIFICATION_ACTIONS[action].label}`)

      onClose()

      // router.refresh() dapat diandalkan setelah data action supaya data state di tabel/list update
      router.refresh()
    } catch (err) {
      setError(err.message || 'Verifikasi gagal')
      toast.error(err.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }, [action, note, pendaftaran, onSubmit, onClose, router, validate, session])

  return {
    // State
    action,
    note,
    loading,
    error,
    actionConfig: VERIFICATION_ACTIONS[action],

    // Actions
    selectAction,
    updateNote,
    submit,
    isValid: action && (!VERIFICATION_ACTIONS[action]?.requiresNote || note.trim()),
    hasChanges: action !== getInitialAction() || note.trim() !== (pendaftaran?.catatan || '').trim() // hasChanges untuk mencegah submit jika tidak ada perubahan
  }
}