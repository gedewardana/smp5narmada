import Link from 'next/link'
import { ArrowLeft, IdCard } from 'lucide-react'
import ButtonReasuble from '@/components/buttonreasuble/ButtonReasuble'

const STATUS_CONFIG = {
    MENUNGGU_VERIFIKASI: {
        border: 'border-blue-300',
        bg: 'bg-blue-50',
        accent: 'bg-blue-600',
        iconBg: 'bg-blue-100',
        textAccent: 'text-blue-700',
        badgeBg: 'bg-blue-100 text-blue-700',
        icon: (
            <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
        ),
        badge: '⏳ Menunggu Verifikasi',
        title: 'Tahap seleksi administrasi',
        description: 'Data pendaftaran Anda sedang diperiksa oleh panitia. Proses ini membutuhkan 1–3 hari kerja. Anda akan mendapat notifikasi setelah verifikasi selesai.',
        checklist: [
            '✓ Data pendaftaran telah diterima',
            '⏳ Verifikasi oleh panitia sedang berlangsung',
        ],
        actions: (
            <ButtonReasuble
                href="/user/dashboard"
                variant='primary'
                size='sm'
            >
                <ArrowLeft className="w-5 h-5" />
                Kembali Ke Dashboard
            </ButtonReasuble>
        ),
    },

    DIVERIFIKASI: {
        border: 'border-green-400',
        bg: 'bg-green-50',
        accent: 'bg-green-600',
        iconBg: 'bg-green-100',
        textAccent: 'text-green-700',
        badgeBg: 'bg-green-100 text-green-700',
        icon: (
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        badge: '✅ Lolos Seleksi Administrasi',
        title: 'Selamat! Anda Lolos Seleksi Administrasi',
        description: 'Data pendaftaran Anda telah diverifikasi dan dinyatakan lengkap serta memenuhi persyaratan.',
        checklist: [
            '✓ Data pendaftaran — Lengkap',
            '✓ Verifikasi administrasi — Lolos',
        ],
        nextSteps: [
            {
                step: '1',
                icon: '🪪',
                title: 'Download atau Cetak Kartu Pendaftaran',
                desc: 'Simpan sebagai bukti telah mendaftar. Kartu mungkin diperlukan saat pengumuman atau daftar ulang.',
                link: { href: '/user/dashboard/pendaftaran/kartu/preview', label: 'Lihat Kartu Pendaftaran →' },
            },
            {
                step: '2',
                icon: '📅',
                title: 'Tunggu Pengumuman penerimaan',
                desc: null, // diisi dari prop tanggalPengumuman
                link: null,
            },
        ],
        actions: null,
    },

    PERLU_PERBAIKAN: {
        border: 'border-yellow-400',
        bg: 'bg-yellow-50',
        accent: 'bg-yellow-500',
        iconBg: 'bg-yellow-100',
        textAccent: 'text-yellow-700',
        badgeBg: 'bg-yellow-100 text-yellow-800',
        icon: (
            <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        ),
        badge: '⚠️ Perlu Perbaikan',
        title: 'Data Anda Perlu Diperbaiki',
        description: 'Terdapat catatan dari panitia yang perlu Anda tindaklanjuti. Silakan perbaiki data pendaftaran sesuai catatan di bawah ini, lalu submit ulang.',
        checklist: null,
        actions: (
            <div className="flex flex-wrap gap-3">
                <ButtonReasuble
                    href="/user/dashboard/pendaftaran/ringkasan-data"
                    variant='secondary'
                    size='sm'
                >
                    ✏️ Perbaiki Sekarang
                </ButtonReasuble>
                <ButtonReasuble
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant='outline'
                    size='sm'
                >
                    💬 Hubungi Panitia
                </ButtonReasuble>
            </div>
        ),
    },


}



export default function StatusVerifikasi({
    status = 'MENUNGGU_VERIFIKASI',
    catatan = null,
    tanggalPengumuman = '22 Februari 2026',
    detailCard = null,   // JSX — render dari parent (page.jsx)
    tanggalVerifikasi = null,
}) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.MENUNGGU_VERIFIKASI

    return (
        <div className={`rounded-xl border-2 ${cfg.border} ${cfg.bg} overflow-hidden shadow-sm mb-6`}>
            {/* Accent top bar */}
            <div className={`h-1.5 ${cfg.accent}`} />

            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-6">

                    {/* Icon */}
                    <div className={`w-16 h-16 ${cfg.iconBg} rounded-full flex items-center justify-center shrink-0`}>
                        {cfg.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Badge */}
                        <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${cfg.badgeBg} mb-3`}>
                            {cfg.badge}
                        </span>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{cfg.title}</h2>

                        {/* Description */}
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{cfg.description}</p>

                        {/* Checklist (untuk MENUNGGU & LOLOS) */}
                        {cfg.checklist && (
                            <ul className={`text-sm ${cfg.textAccent} space-y-1 mb-4`}>
                                {cfg.checklist.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}



                        {/* Catatan Panitia (untuk PERLU_PERBAIKAN) */}
                        {catatan && (
                            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    💬 Catatan Panitia
                                </p>
                                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                                    {catatan}
                                </p>
                            </div>
                        )}



                        {/* Tanggal submit */}
                        {/* {tanggalSubmit && (
                            <p className="text-xs text-gray-400 mb-4">
                                Disubmit pada:{' '}
                                {new Date(tanggalSubmit).toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'long', year: 'numeric',
                                })}
                            </p>
                        )} */}

                        {/* Tanggal verifikasi */}
                        {tanggalVerifikasi && (
                            <p className="text-xs text-gray-400 mb-4">
                                Diverifikasi pada:{' '}
                                {new Date(tanggalVerifikasi).toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'long', year: 'numeric',
                                })}
                            </p>
                        )}

                        {/* Action buttons */}
                        <div>{cfg.actions}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}