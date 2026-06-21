import { GraduationCap, Facebook, Instagram, Youtube, Twitter } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    // { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    // { icon: Twitter, href: '#', label: 'Twitter' },
  ]

  const quickLinks = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Informasi PMB', href: '#informasi' },
    { name: 'Jadwal', href: '#jadwal' },
    { name: 'Persyaratan', href: '#persyaratan' },
    { name: 'FAQ', href: '#faq' },
  ]

  const resources = [
    // { name: 'Buku Panduan', href: '#' },
    { name: 'Formulir Offline', href: '#' },
    // { name: 'Survei Zonasi', href: '#' },
    { name: 'Cek Hasil Seleksi', href: '/login' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10  rounded-xl flex items-center justify-center">
                <img src="/logo.png" alt="logo" className="w-10 h-10  " />
              </div>
              <div>
                <p className="text-sm text-gray-400">SMP Negeri 5</p>
                <p className="font-bold">Narmada</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Sekolah unggulan di Lombok Barat yang berkomitmen mencetak generasi berkarakter, berprestasi, dan siap menghadapi tantangan global.
            </p>
            {/* <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div> */}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Menu Utama</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-lg mb-6">Unduhan</h4>
            <ul className="space-y-3">
              {resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-6">Media Sosial</h4>
            <p className="text-gray-400 text-sm mb-4">
              Dapatkan informasi terbaru seputar PMB dan kegiatan sekolah.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} SMP Negeri 5 Narmada. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  )
}