'use client'
import { Loader2, Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerSchema } from "@/utils/regisvalidation" // Import skema validasi
import { useUser } from "@/hooks/useUser"

export default function RegisterForm() {
    const router = useRouter()
    const { registerUser, isLoading } = useUser()

    // state show password
    const [show, setShow] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    // state error
    const [errors, setErrors] = useState({})

    // state form register
    const [form, setForm] = useState({
        nama_lengkap: '',
        email: '',
        password: '',
        konfirmasi_password: '', // uncomment this to ensure state exists
    })

    // handle change input
    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

        // hapus error field saat user ngetik
        setErrors(prev => ({
            ...prev,
            [e.target.name]: ''
        }))
    }

    // cls untuk input biasa & konfirmasi password
    const inputCls = (name) => {
        return (
            `h-10 w-full px-4 py-2 rounded-lg text-sm border border-gray-300 transition-all
        ${errors[name] ? 'border-red-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`
        )
    }

    const handleRegister = async (e) => {
        e.preventDefault()

        // --- THE BEST PRACTICE VALIDATION ---
        // 1. Validasi di Client-side dulu sebelum membebani server
        const parseResult = registerSchema.safeParse(form)

        if (!parseResult.success) {
            // 2. Tampilkan semua error bersamaan
            const newErrors = {}
            parseResult.error.issues.forEach(err => {
                const field = err.path[0]
                // Hanya ambil pesan error pertama per kolom
                if (!newErrors[field]) newErrors[field] = err.message
            })
            setErrors(newErrors)

            // 3. Auto-focus ke input pertama yang bermasalah (Sangat disarankan)
            const firstErrorField = Object.keys(newErrors)[0]
            if (firstErrorField) {
                const errorElement = document.querySelector(`input[name="${firstErrorField}"]`)
                if (errorElement) errorElement.focus()
            }
            return // Hentikan kirim ke backend
        }
        // ------------------------------------
        // Panggil custom hook untuk logika API
        await registerUser(form, setErrors, () => {
            window.location.href = "/login"
        })
    }

    return (
        <div className="space-y-2">
            {/* Nama Lengkap */}
            <div>
                <label className=" block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap

                </label>
                <input
                    type="text"
                    name="nama_lengkap"
                    value={form.nama_lengkap}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                    className={inputCls('nama_lengkap')}
                    required
                />
                <p className="text-red-500 text-xs mt-1">
                    {errors.nama_lengkap}
                </p>
            </div>

            {/* Email */}
            <div>
                <label className=" block text-sm font-medium text-gray-700 mb-1 ">
                    Email

                </label>

                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className={inputCls('email')}
                    required
                />
                <p className="text-red-500 text-xs mt-1">
                    {errors.email}
                </p>
            </div>

            {/* Password */}
            <div className="relative">
                <label className=" block text-sm font-medium text-gray-700 mb-1">
                    Password

                </label>

                <input
                    type={show ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimal 6 karakter"
                    className={`${inputCls('password')} pr-10`}
                    required
                />
                <p className="text-red-500 text-xs mt-1">
                    {errors.password}
                </p>

                {/* Eye Button */}
                {form.password && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 pt-6"
                    >
                        {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>

            {/* Konfirmasi Password */}
            <div className="relative">
                <label className=" block text-sm font-medium text-gray-700 mb-1">
                    Konfirmasi Password

                </label>
                <input
                    type={showConfirm ? "text" : "password"}
                    name="konfirmasi_password"
                    value={form.konfirmasi_password}
                    onChange={handleChange}
                    placeholder="Ulangi password"
                    className={inputCls('konfirmasi_password')}
                    required
                />
                <p className="text-red-500 text-xs mt-1 h-4">
                    {errors.konfirmasi_password}
                </p>

                {form.konfirmasi_password && (
                    <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 pt-1"
                    >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>

            {/* Button Daftar */}
            <button
                type="button"
                disabled={isLoading}
                onClick={handleRegister}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                <span>{isLoading ? "Mendaftarkan..." : "Daftar"}</span>
            </button>

            {/* Link ke Login */}
            <p className="text-center text-sm text-gray-600">
                Sudah punya akun?{' '}
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Masuk di sini
                </a>
            </p>
        </div>
    )
}