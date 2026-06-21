'use client'
import React, { useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import StatusBadge from './StatusBadge'
import {
    User,
    Users,
    Home,
    Award,
    FileText,
    FileCheck,
    Briefcase
} from 'lucide-react'

function Header({ detailData, activeTab, setActiveTab, onVerify, readOnly = false }) {
    const router = useRouter()


    const navigation = useMemo(() => [
        {
            id: 'dokumen_persyaratan',
            label: 'Dokumen Persyaratan',
            icon: FileText,
            children: [
                { id: 'berkas_persyaratan', label: 'Persyaratan', icon: FileCheck },
            ]
        },
        {
            id: 'catatan',
            label: 'Catatan',
            icon: FileText
        }
    ], [])

    // Find active parent based on activeTab
    const activeParent = useMemo(() => {
        return navigation.find(parent =>
            parent.id === activeTab ||
            parent.children?.some(child => child.id === activeTab)
        )
    }, [activeTab, navigation])

    const handleMainTabClick = (parent) => {
        if (parent.children && parent.children.length > 0) {
            setActiveTab(parent.children[0].id)
        } else {
            setActiveTab(parent.id)
        }
    }

    const handleClose = () => {
        router.push(readOnly ? '/ketuapanitia/dashboard/monitoring-daftar-ulang' : '/panitia/dashboard/verifikasi-daftar-ulang')
    }

    if (!detailData) return null

    return (
        <div className="flex-shrink-0 bg-white z-10 shadow-sm border-b border-gray-200">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleClose}
                        className="p-2 -ml-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors group"
                        title="Kembali"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5 transformer group-hover:-translate-x-1 transition-transform"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Detail Daftar Ulang</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {detailData.nomor_pendaftaran} - {detailData.identitas.nama_lengkap}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <StatusBadge status={detailData.status_daftar_ulang} />
                    {!readOnly && onVerify && (
                        <button
                            onClick={onVerify}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-medium transition-all shadow-sm shadow-blue-200"
                        >
                            <FileCheck className="w-4 h-4" />
                            Verifikasi
                        </button>
                    )}
                </div>
            </div>

            {/* Level 1 Tabs (Main Categories) */}
            <div className="flex gap-6 px-6 pt-2">
                {navigation.map((parent) => {
                    const isActive = activeParent?.id === parent.id
                    const ParentIcon = parent.icon

                    return (
                        <button
                            key={parent.id}
                            onClick={() => handleMainTabClick(parent)}
                            className={`
                                flex items-center gap-2 pb-3 px-1 text-sm font-semibold transition-colors relative
                                ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}
                            `}
                        >
                            <ParentIcon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                            {parent.label}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Level 2 Tabs (Sub-menus) - Only if parent has children */}
            {activeParent?.children && (
                <div className="bg-gray-50 px-6 py-2 border-t border-gray-100 flex gap-2 overflow-x-auto">
                    {activeParent.children.map((child) => {
                        const isActive = activeTab === child.id
                        const ChildIcon = child.icon

                        return (
                            <button
                                key={child.id}
                                onClick={() => setActiveTab(child.id)}
                                className={`
                                    flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap
                                    ${isActive
                                        ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200'
                                        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                    }
                                `}
                            >
                                <ChildIcon className="w-3.5 h-3.5" />
                                {child.label}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Header