'use client'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Particles from '../home/Particles'
import { ArrowLeft } from 'lucide-react'

export default function AuthLayout({ children, title, description, image = "/images/auth-illustration.png" }) {
    const router = useRouter()

    const handleClose = () => {
        router.push('/')
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 overflow-hidden">
            {/* Left Side: Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 pt-20 md:p-12 relative z-10 bg-white min-h-screen md:min-h-0">
                {/* Back Button */}
                <div className="absolute top-6 left-4 md:top-8 md:left-8">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={handleClose}
                                className="hover:bg-gray-100 p-2.5 rounded-full transition-colors duration-200 flex items-center justify-center group"
                                aria-label="Kembali"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Kembali</TooltipContent>
                    </Tooltip>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md mx-auto"
                >
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 md:mb-3 leading-tight">{title}</h1>
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed">{description}</p>
                    </div>

                    <div className="bg-white">
                        {children}
                    </div>
                </motion.div>
            </div>

            {/* Right Side: UI/UX Visual */}
            <div className="hidden md:flex md:w-1/2 relative bg-blue-600 items-center justify-center overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 opacity-30">
                    <Particles />
                </div>

                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[100px] opacity-30" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[100px] opacity-30" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-20 w-4/5 h-4/5 flex flex-col items-center justify-center text-white text-center p-8"
                >
                    <div className="relative w-full aspect-square max-w-md mb-12 drop-shadow-2xl">
                        <Image
                            src={image}
                            alt="Auth Illustration"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    <h2 className="text-3xl font-bold mb-4">SMP Negeri 5 Narmada</h2>
                    <p className="text-blue-100 text-lg max-w-md leading-relaxed">
                        Penerimaan Murid Baru (PMB)
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
