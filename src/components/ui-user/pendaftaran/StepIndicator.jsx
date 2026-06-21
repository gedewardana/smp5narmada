'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { usePendaftaranID } from '@/hooks/usePendaftaranID'
import {
    User,
    UserRound,
    UserRoundCheck,
    Users,
    CalendarDays,
    Trophy,
    FileCheck,
    ClipboardList,
    ArrowUp,
    CheckCircle2,
    Check
} from "lucide-react";

export default function StepIndicator() {
    const pathname = usePathname()
    const containerRef = useRef(null)
    const scrollContainerRef = useRef(null)
    const activeGroupRef = useRef(null)
    const [hoveredStep, setHoveredStep] = useState(null)
    const [isFloating, setIsFloating] = useState(false)

    // Ambil data pendaftaran untuk menentukan step yang sudah selesai
    const { user } = useAuth()
    const { data: pendaftaranData } = usePendaftaranID(user?.id_pendaftaran)

    // Definisi semua langkah dengan pengelompokan (Kategori)
    const allSteps = useMemo(() => [
        {
            id: 1,
            key: 'identitas',
            name: 'Identitas',
            shortName: 'Identitas',
            path: '/user/dashboard/pendaftaran/identitas',
            icon: <User className="w-full h-full" />,
            category: 'formulir',
            categoryLabel: 'FORMULIR PENDAFTARAN'
        },
        {
            id: 2,
            key: 'data-ayah',
            name: 'Data Ayah',
            shortName: 'Ayah',
            path: '/user/dashboard/pendaftaran/data-ayah',
            icon: <UserRound className="w-full h-full" />,
            category: 'formulir',
            categoryLabel: 'FORMULIR PENDAFTARAN'
        },
        {
            id: 3,
            key: 'data-ibu',
            name: 'Data Ibu',
            shortName: 'Ibu',
            path: '/user/dashboard/pendaftaran/data-ibu',
            icon: <UserRoundCheck className="w-full h-full" />,
            category: 'formulir',
            categoryLabel: 'FORMULIR PENDAFTARAN'
        },
        {
            id: 4,
            key: 'data-wali',
            name: 'Data Wali',
            shortName: 'Wali',
            path: '/user/dashboard/pendaftaran/data-wali',
            icon: <Users className="w-full h-full" />,
            category: 'formulir',
            categoryLabel: 'FORMULIR PENDAFTARAN'
        },
        {
            id: 5,
            key: 'data-periodik',
            name: 'Data Periodik',
            shortName: 'Periodik',
            path: '/user/dashboard/pendaftaran/data-periodik',
            icon: <CalendarDays className="w-full h-full" />,
            category: 'formulir',
            categoryLabel: 'FORMULIR PENDAFTARAN'
        },
        {
            id: 6,
            key: 'data-prestasi',
            name: 'Prestasi',
            shortName: 'Prestasi',
            path: '/user/dashboard/pendaftaran/data-prestasi',
            icon: <Trophy className="w-full h-full" />,
            category: 'formulir',
            categoryLabel: 'FORMULIR PENDAFTARAN'
        },
        {
            id: 7,
            key: 'persyaratan',
            name: 'Persyaratan',
            shortName: 'Persyaratan',
            path: '/user/dashboard/pendaftaran/persyaratan',
            icon: <FileCheck className="w-full h-full" />,
            category: 'berkas',
            categoryLabel: 'PERSYARATAN BERKAS'
        },
        {
            id: 8,
            key: 'review-data',
            name: 'Review Data',
            shortName: 'Review',
            path: '/user/dashboard/pendaftaran/review-data',
            icon: <ClipboardList className="w-full h-full" />,
            category: 'review',
            categoryLabel: 'REVIEW & FINALISASI'
        }
    ], [])

    // Tentukan step yang sudah selesai berdasarkan data DB
    const completedKeys = useMemo(() => {
        if (!pendaftaranData) return new Set()
        const keys = new Set()
        if (pendaftaranData.identitas)         keys.add('identitas')
        if (pendaftaranData.ayah)              keys.add('data-ayah')
        if (pendaftaranData.ibu)               keys.add('data-ibu')
        if (pendaftaranData.wali)              keys.add('data-wali')
        if (pendaftaranData.periodik)          keys.add('data-periodik')
        if (pendaftaranData.prestasi?.length)  keys.add('data-prestasi')
        if (pendaftaranData.berkas_persyaratan?.some(b => b.status_upload === 'UPLOADED')) keys.add('persyaratan')
        if (pendaftaranData.status_pendaftaran === 'SUBMITTED') keys.add('review-data')

        return keys
    }, [pendaftaranData])

    // Set untuk step yang diskip
    const skippedKeys = useMemo(() => {
        if (!pendaftaranData?.skipped_steps) return new Set()
        return new Set(pendaftaranData.skipped_steps)
    }, [pendaftaranData])

    // Deteksi Scroll untuk Floating Badge
    useEffect(() => {
        const scrollContainer = document.querySelector('main');
        const handleScroll = () => {
            if (containerRef.current && scrollContainer) {
                const rect = containerRef.current.getBoundingClientRect()
                setIsFloating(rect.bottom < 50)
            }
        }
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll)
        }
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll)
            }
        }
    }, [])

    // Auto-scroll ke grup yang sedang aktif pada tampilan mobile (horizontal scroll)
    useEffect(() => {
        if (scrollContainerRef.current && activeGroupRef.current) {
            // Kita ingin posisi scroll membuat item aktif sedikit ke tengah
            const container = scrollContainerRef.current
            const activeEl = activeGroupRef.current
            // Simple center calculation
            const scrollLeft = activeEl.offsetLeft - (container.offsetWidth / 2) + (activeEl.offsetWidth / 2)
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
        }
    }, [pathname])

    const activeStepIndex = useMemo(() => {
        // 1. Cek apakah user sedang berada di halaman spesifik (URL cocok)
        const idx = allSteps.findIndex(step => pathname.includes(step.path))
        if (idx !== -1) return idx;

        // 2. Jika user di dashboard root, auto-deteksi step terakhir yang harus diisi
        const firstIncompleteIdx = allSteps.findIndex(step => 
            !completedKeys.has(step.key) && !skippedKeys.has(step.key)
        );
        return firstIncompleteIdx !== -1 ? firstIncompleteIdx : 0;
    }, [pathname, allSteps, completedKeys, skippedKeys])

    const activeStep = allSteps[activeStepIndex]

    const scrollToTop = () => {
        const scrollContainer = document.querySelector('main');
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Mengelompokkan langkah-langkah berdasarkan kategori untuk rendering UI
    const groupedSteps = useMemo(() => {
        const isSubmitted = pendaftaranData?.status_pendaftaran === 'SUBMITTED'
        const groups = {
            formulir: { label: 'FORMULIR PENDAFTARAN', steps: [], active: false, index: 1 },
            berkas: { label: 'BERKAS', steps: [], active: false, index: 2 },
            review: { label: 'FINAL', steps: [], active: false, index: 3 }
        }
        allSteps.forEach((step, index) => {
            groups[step.category].steps.push({ ...step, index })
            // Hanya tandai active jika belum submit
            if (!isSubmitted && index === activeStepIndex) {
                groups[step.category].active = true
            }
        })
        return Object.values(groups)
    }, [allSteps, activeStepIndex, pendaftaranData])

    return (
        <div ref={containerRef} className="relative select-none">
            {/* 1. Main Premium RoadMap Container - NOW FLAT FOR INTEGRATION */}
            <div className="p-4 md:p-8 transition-all duration-700">
                
                {/* Horizontal scroll container on mobile, Flex row on desktop */}
                <div 
                    ref={scrollContainerRef}
                    className="flex flex-nowrap lg:flex-row items-start gap-6 lg:gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 lg:pb-0"
                >
                    {groupedSteps.map((group, groupIdx) => (
                        <div 
                            key={groupIdx} 
                            ref={group.active ? activeGroupRef : null}
                            className={`flex flex-col shrink-0 w-[90vw] sm:w-[60vw] lg:w-auto lg:flex-1 relative px-2 lg:px-4 snap-center transition-all duration-700 ${group.active ? 'opacity-100' : 'opacity-40 grayscale-[0.2]'}`}
                        >
                            {/* Group Header - Editorial Style */}
                            <div className="mb-10">
                                <div className="flex items-center gap-4 mb-2">
                                    <span className={`text-[11px] font-black w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-500 ${group.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400 font-bold'}`}>
                                        {group.index}
                                    </span>
                                    <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-500 ${group.active ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {group.label}
                                    </h3>
                                </div>
                                <div className={`h-0.5 w-full rounded-full transition-all duration-1000 origin-left ${group.active ? 'bg-blue-600 transform scale-x-100' : 'bg-slate-100 transform scale-x-50'}`} />
                            </div>

                            {/* Steps Icons Cluster */}
                            <div className="flex items-center gap-3 lg:justify-between xl:justify-start lg:gap-8 relative z-10">
                                {group.steps.map((step, sIdx) => {
                                    const index = step.index
                                    const isSubmitted = pendaftaranData?.status_pendaftaran === 'SUBMITTED'
                                    const isActive = !isSubmitted && index === activeStepIndex
                                    const isSkipped = skippedKeys.has(step.key)
                                    const isCompleted = completedKeys.has(step.key)
                                    const isMissed = index < activeStepIndex && !isCompleted && !isSkipped
                                    const isHovered = hoveredStep === index

                                    return (
                                        <div key={step.id} className="relative group/step">
                                            <motion.div
                                                whileHover={{ y: -4 }}
                                                className="relative flex flex-col items-center"
                                                onMouseEnter={() => setHoveredStep(index)}
                                                onMouseLeave={() => setHoveredStep(null)}
                                            >
                                                {/* Premium Step Component */}
                                                <div className={`
                                                    relative w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 cursor-pointer border-2
                                                    ${isActive
                                                        ? 'bg-blue-600 text-white border-blue-400 shadow-[0_10px_25px_rgba(37,99,235,0.4)] scale-110 z-20'
                                                        : isCompleted
                                                            ? 'bg-emerald-500 text-white border-emerald-300 shadow-lg shadow-emerald-100'
                                                            : isSkipped
                                                                ? 'bg-slate-50 text-slate-400 border-slate-300 border-dashed shadow-sm'
                                                                : isMissed
                                                                    ? 'bg-rose-500 text-white border-rose-300 shadow-lg shadow-rose-100'
                                                                    : 'bg-white border-slate-100 text-slate-300 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50'
                                                    }
                                                `}>
                                                    {isCompleted ? (
                                                        <Check className="w-5 h-5 stroke-[3px] animate-in zoom-in duration-300" />
                                                    ) : isSkipped ? (
                                                        <div className="w-3 h-0.5 rounded-full bg-slate-400 animate-in zoom-in duration-300" />
                                                    ) : (
                                                        <div className="w-5 h-5 flex items-center justify-center">
                                                            {isActive ? (
                                                                <span className="text-sm font-black italic tracking-tighter">0{index + 1}</span>
                                                            ) : (
                                                                <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40 group-hover:scale-150 transition-transform" />
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Active Glow Ring */}
                                                    {isActive && (
                                                        <div className="absolute inset-0 rounded-2xl bg-blue-400/30 animate-ping -z-10" />
                                                    )}
                                                </div>

                                                {/* Step Name - Hidden on small, Editorial on large */}
                                                <span className={`
                                                    mt-4 text-[9px] font-black text-center leading-tight hidden lg:block uppercase tracking-widest transition-all duration-300
                                                    ${isActive ? 'text-blue-600 translate-y-0 opacity-100' : 'text-slate-400 translate-y-1 opacity-60'}
                                                `}>
                                                    {step.shortName}
                                                </span>
                                            </motion.div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
           
        </div>
    )
}


