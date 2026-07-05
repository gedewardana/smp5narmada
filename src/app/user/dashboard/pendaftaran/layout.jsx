'use client'

import StepIndicator from '@/components/ui-user/pendaftaran/StepIndicator'
import { motion, AnimatePresence } from 'framer-motion'
import RegistrationInfoBanner from '@/components/ui-user/pendaftaran/RegistrationInfoBanner'
import { usePathname } from 'next/navigation'
import StepGuard from '@/components/ui-user/pendaftaran/StepGuard'

export default function PendaftaranLayout({ children }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <div className="max-w-6xl mx-auto px-2 sm:px-4 pt-4">



                {/* Information Layer */}
                <RegistrationInfoBanner />

                {/* Main Glassmorphism Container */}
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]">

                    {/* Sticky-ready Header Section */}
                    <div className="bg-gray-50/30 backdrop-blur-md border-b border-gray-100/80">
                        <StepIndicator />
                    </div>

                    {/* Content Transition Wrapper */}
                    <AnimatePresence mode="wait">
                        <motion.main
                            key={pathname} // Re-animate saat path berubah
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className="p-4 sm:p-8 md:p-12 lg:p-16"
                        >
                            <div className="max-w-4xl mx-auto">
                                <StepGuard>
                                    {children}
                                </StepGuard>
                            </div>
                        </motion.main>
                    </AnimatePresence>

                    {/* Minimalist Footer */}
                    <footer className="bg-gray-50/20 px-8 py-5 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                            Portal PMB • SMPN 5 Narmada
                        </p>
                        {/* <div className="flex gap-6">
                            <span className="text-[10px] text-gray-400 font-medium hover:text-blue-500 cursor-help transition-colors">Panduan</span>
                            <span className="text-[10px] text-gray-400 font-medium hover:text-blue-500 cursor-help transition-colors">Privasi</span>
                        </div> */}
                    </footer>
                </div>

                <p className="mt-8 text-center text-sm text-gray-400">
                    Butuh bantuan teknis?{" "}
                    <a
                        href="https://wa.me/6283156934647?text=Halo%20Admin,%20saya%20membutuhkan%20bantuan%20pendaftaran."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-bold hover:underline underline-offset-4"
                    >
                        Hubungi Admin
                    </a>
                </p>

            </div>


        </div>
    )
}