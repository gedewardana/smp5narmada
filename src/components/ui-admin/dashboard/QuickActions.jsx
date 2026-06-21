import Link from 'next/link'
import { UserCheck, FileCheck, Megaphone, Calendar } from 'lucide-react'
import QuickActionsBadge from './QuickActionsBadge'

function QuickActions() {
    const actions = [
        {
            title: 'Verifikasi Pendaftaran',
            desc: 'Cek dan verifikasi data pendaftar baru',
            href: '/panitia/dashboard/verifikasi-pendaftaran',
            icon: UserCheck,
            color: 'bg-blue-500',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            count: '5 Baru',
            badgeType: 'info'
        },
        {
            title: 'Verifikasi Daftar Ulang',
            desc: 'Verifikasi berkas daftar ulang siswa diterima',
            href: '/panitia/dashboard/verifikasi-daftar-ulang',
            icon: FileCheck,
            color: 'bg-emerald-500',
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            count: '5 Baru',
            badgeType: 'info'
        },
        {
            title: 'Kelola Pengumuman',
            desc: 'Atur hasil seleksi dan pengumuman PMB',
            href: '/panitia/dashboard/kelolapengumuman',
            icon: Megaphone,
            color: 'bg-orange-500',
            bg: 'bg-orange-50',
            text: 'text-orange-600'
        },
        {
            title: 'Laporan Harian',
            desc: 'Lihat rekap pendaftar harian',
            href: '/panitia/dashboard/daftar-harian-pmb',
            icon: Calendar,
            color: 'bg-indigo-500',
            bg: 'bg-indigo-50',
            text: 'text-indigo-600'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {actions.map((action, idx) => (
                <Link
                    key={idx}
                    href={action.href}
                    className="flex flex-col p-4 bg-white border border-gray-100 rounded-xl hover:shadow-lg hover:border-blue-100 transition-all group relative"
                >
                    <QuickActionsBadge count={action.count} type={action.badgeType} />

                    <div className={`w-10 h-10 rounded-lg ${action.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <action.icon className={`w-5 h-5 ${action.text}`} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {action.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        {action.desc}
                    </p>
                </Link>
            ))}
        </div>
    )
}

export default QuickActions