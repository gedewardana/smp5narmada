'use client'

import { Button } from '@/components/ui/button'
import { X, CheckCircle2, AlertCircle, MessageSquare, Loader2, User, FileText } from 'lucide-react'
import { useVerification, VERIFICATION_ACTIONS } from '@/hooks/useVerification'

// ─── Config ───────────────────────────────────────────────────────────────────

const ACTIONS_UI_META = {
    verifikasi: { icon: CheckCircle2, desc: 'Data lengkap' },
    perbaikan:  { icon: AlertCircle,  desc: 'Perlu diperbaiki' },
    tolak:      { icon: X,            desc: 'Tidak memenuhi syarat' },
}

const COLOR_MAP = {
    emerald: {
        card:    'bg-emerald-50 border-emerald-500 text-emerald-700',
        iconBg:  'bg-emerald-100',
        icon:    'text-emerald-600',
        hint:    'bg-emerald-50 border-emerald-200 text-emerald-800',
        btn:     'bg-emerald-600 hover:bg-emerald-700',
    },
    amber: {
        card:    'bg-amber-50 border-amber-500 text-amber-700',
        iconBg:  'bg-amber-100',
        icon:    'text-amber-600',
        hint:    'bg-amber-50 border-amber-200 text-amber-800',
        btn:     'bg-amber-600 hover:bg-amber-700',
    },
    rose: {
        card:    'bg-rose-50 border-rose-500 text-rose-700',
        iconBg:  'bg-rose-100',
        icon:    'text-rose-600',
        hint:    'bg-rose-50 border-rose-200 text-rose-800',
        btn:     'bg-rose-600 hover:bg-rose-700',
    },
}

const cx = (...c) => c.filter(Boolean).join(' ')


export default function ModalVerifikasi({ pendaftaran, onClose, onSubmit }) {
  if (!pendaftaran) return null

  const {
    action, note, loading, error, actionConfig,
    selectAction, updateNote, submit, isValid, hasChanges // hasChanges untuk mencegah submit jika tidak ada perubahan
  } = useVerification(pendaftaran, onClose, onSubmit)

  const isEditMode = pendaftaran.status_verifikasi !== 'MENUNGGU_VERIFIKASI' && pendaftaran.status_verifikasi !== 'BELUM_DIVERIFIKASI';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {isEditMode ? 'Edit Verifikasi' : 'Verifikasi'}
            </h2>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                {pendaftaran.nomor_pendaftaran}
              </span>
              <User className="w-3 h-3" />{pendaftaran.identitas_peserta_didik?.nama_lengkap || pendaftaran.nama_lengkap}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Actions */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Pilih Aksi</label>
              {Object.entries(VERIFICATION_ACTIONS).map(([id, data]) => {
                const meta = ACTIONS_UI_META[id]
                const Icon = meta.icon
                const active = action === id
                return (
                  <button
                    key={id}
                    onClick={() => selectAction(id)}
                    className={cx(
                      'w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                      active ? COLOR_MAP[data.color].card : 'bg-white border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className={cx('p-1.5 rounded-lg', active ? COLOR_MAP[data.color].iconBg : 'bg-gray-100')}>
                      <Icon className={cx('w-5 h-5', active ? COLOR_MAP[data.color].icon : 'text-gray-400')} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{data.label}</h3>
                      <p className="text-xs opacity-80">{meta.desc}</p>
                    </div>
                    {active && <CheckCircle2 className="w-5 h-5" />}
                  </button>
                )
              })}
            </div>

            {/* Note */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-2">
                Catatan {actionConfig?.requiresNote && <span className="text-rose-500">*</span>}
              </label>

              {!action ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                  Pilih aksi terlebih dahulu
                </div>
              ) : (
                <>
                  <div className={cx(
                    'p-2.5 rounded-lg border text-xs mb-2 flex items-start gap-2',
                    COLOR_MAP[actionConfig.color].hint
                  )}>
                    <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {actionConfig.requiresNote
                      ? 'Jelaskan detail/alasan untuk keputusan ini'
                      : 'Catatan bersifat opsional'}
                  </div>

                  <textarea
                    value={note}
                    onChange={e => updateNote(e.target.value)}
                    rows={6}
                    className={cx(
                      'w-full flex-1 p-3 text-sm border rounded-lg resize-none focus:ring-2 focus:border-transparent',
                      error ? 'border-rose-300 bg-rose-50' : 'border-gray-300 focus:ring-blue-200'
                    )}
                    placeholder="Tulis catatan di sini..."
                  />

                  <div className="flex justify-between mt-1 text-xs">
                    {error && <span className="text-rose-600">{error}</span>}
                    <span className="text-gray-400 ml-auto">{note.length}/1000</span>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 py-4 bg-gray-50 border-t rounded-b-xl">
          <Button onClick={onClose} variant="outline" size="sm" disabled={loading}>
            Batal
          </Button>
          <Button
            onClick={submit}
            disabled={!isValid || !hasChanges || loading} // hasChanges untuk mencegah submit jika tidak ada perubahan
            size="sm"
            className={cx(
              'text-white transition-colors',
              actionConfig ? COLOR_MAP[actionConfig.color].btn : 'bg-gray-400 cursor-not-allowed'
            )}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Memproses...</>
            ) : (
              'Simpan Verifikasi'
            )}
          </Button>
        </div>

      </div>
    </div>
  )
}