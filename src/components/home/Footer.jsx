import React from 'react'
import { Separator } from '../ui/separator'
import { Facebook, Instagram, Youtube } from 'lucide-react'

function Footer() {

    const navLinks = [
        { name: 'Beranda', href: '/' },
        // { name: 'PMB', href: '#pmb' },
        // { name: 'Program', href: '#program' },
        // { name: 'Galeri', href: '#galeri' },
        // { name: 'Kontak', href: '#kontak' },
        { name: 'Profil Sekolah', href: '/profile' },
    ]
    return (
        <div>
            <footer className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-4 lg:px-8 ">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-6">

                                <div>
                                    <h3 className="font-bold text-lg">SMP NEGERI 5</h3>
                                    <p className="text-sm text-gray-400">NARMADA</p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Mencetak generasi cerdas, berkarakter, dan berprestasi untuk
                                masa depan bangsa yang gemilang.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Tautan Cepat</h4>
                            <ul className="space-y-2">
                                {navLinks.map((link) => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* <div>
                            <h4 className="font-semibold mb-4">Program</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Program Akademik</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Ekstrakurikuler</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Pengembangan Karakter</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Prestasi & Kompetisi</a></li>
                            </ul>
                        </div> */}

                        <div>
                            <h4 className="font-semibold mb-4">Kontak</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>Jl. Suranadi 2, Suranadi</li>
                                <li>Kec. Narmada, Lombok Barat</li>
                                <li>NTB 83371</li>
                                <li>smpn5narmada@gmail.com</li>
                            </ul>
                        </div>
                    </div>

                    <Separator className="bg-gray-800 mb-8" />

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            © 2024 SMP Negeri 5 Narmada. Hak Cipta Dilindungi.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer