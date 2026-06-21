'use client'

import { useState, useEffect } from 'react'
import { Menu, X, GraduationCap } from 'lucide-react'
import Image from 'next/image'


export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'Beranda', href: '#beranda' },
        { name: 'Visi Misi', href: '#visimisi' },
        { name: 'Prestasi', href: '#prestasi' },
        { name: 'Jadwal', href: '#jadwal' },
        { name: 'Persyaratan', href: '#persyaratan' },
        // { name: 'Ekstrakurikuler', href: '#ekstrakurikuler' },
        { name: 'FAQ', href: '#faq' },
        { name: 'Kontak', href: '#kontak' },

    ]

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
                : 'bg-white lg:bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                            <Image src="/logo.png" alt="Hero" width={500} height={500} />
                        </div>
                        <div className="hidden sm:block">
                            {/* <p className="text-xs text-gray-500 font-medium">PMB 2026/2027</p> */}
                            <p className={`text-sm font-bold transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'
                                }`}>
                                SMP Negeri 5 Narmada
                            </p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium hover:text-blue-600 transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}
                            >
                                {link.name}
                            </a>
                        ))}

                          <a
                            href="/login"
                            className={`px-5 py-2.5 bg-white text-gray-900 text-sm font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-all hover:shadow-lg hover:shadow-blue-600/20 ${isScrolled ? 'border border-blue-600' : ''}`}
                        >
                            Login
                        </a>

                        <a
                            href="/register"
                            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-600/20"
                        >
                            Daftar
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100">
                    <div className="px-4 py-4 space-y-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block py-2 text-gray-600 hover:text-blue-600 font-medium"
                            >
                                {link.name}
                            </a>
                        ))}

                        <a
                            href="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block w-full text-center py-3 bg-white text-gray-900 font-semibold rounded-lg border border-blue-600 hover:bg-blue-600 hover:text-white transition-all hover:shadow-lg hover:shadow-blue-600/20"
                        >
                            Login
                        </a>

                        <a
                            href="/register"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block w-full text-center py-3 bg-blue-600 text-white font-semibold rounded-lg"
                        >
                            Daftar
                        </a>
                    </div>
                </div>
            )}
        </nav>
    )
}