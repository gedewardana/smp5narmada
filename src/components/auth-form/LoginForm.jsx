'use client'
import { Loader2, Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/utils/loginvalidation"

// UI FORM untuk halaman Login
export default function LoginForm() {
    const { login } = useAuth()
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)

    // State untuk menampung input
    const [values, setValues] = useState({
        email: "",
        password: ""
    })

    // State untuk menampung error
    const [errors, setErrors] = useState({})

    // cls untuk input biasa & konfirmasi password
    const inputCls = (name) => {
        return (
            `h-10 w-full px-4 py-2 rounded-lg text-sm border border-gray-300 transition-all
        ${errors[name] ? 'border-red-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`
        )
    }

    const handleChange = (e) => {
        setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))

        // hapus error field saat user ngetik
        setErrors(prev => ({
            ...prev,
            [e.target.name]: ''
        }))
    }

    // State untuk menampung loading
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e) => {
        // mencegah halaman reload
        e.preventDefault()

        // validasi input
        const result = loginSchema.safeParse(values)
        if (!result.success) {


            const fieldErrors = {}


            result.error.issues.forEach((err) => {
                const field = err.path[0]

                // hanya ambil error pertama per field
                if (!fieldErrors[field]) fieldErrors[field] = err.message
            })

            setErrors(fieldErrors)

            const firstErrorField = Object.keys(fieldErrors)[0]
            if (firstErrorField) {
                const errorElement = document.querySelector(`input[name="${firstErrorField}"]`)
                if (errorElement) errorElement.focus()
            }
            return
        }


        setIsLoading(true)
        try {
            await login(values.email, values.password) // ← panggil login dari useAuth
            toast.success("Login berhasil!")
            // router.push sudah dihandle di dalam login() pada AuthContext
        } catch (error) {
            toast.error(error.message || "Terjadi kesalahan")
        } finally {
            setIsLoading(false)
        }
    }

    return (

        <div className="space-y-2">
            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email

                </label>
                <input

                    type="email"
                    name="email"
                    value={values.email}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        placeholder="Masukkan password"
                        className={`${inputCls('password')} pr-10`}
                        required
                    />
                    {values.password && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    )}
                </div>
                <p className="text-red-500 text-xs mt-1">
                    {errors.password}
                </p>
                <div className="text-right mt-2">
                    <a
                        href="/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Lupa Password?
                    </a>
                </div>
            </div>
            {/* Button Login */}
            <button
                type="submit"
                disabled={isLoading}
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
                {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                <span>{isLoading ? "Masuk..." : "Masuk"}</span>
            </button>

            {/* Link ke Register */}
            <p className="text-center text-sm text-gray-600">
                Belum punya akun?{' '}
                <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Daftar di sini
                </a>
            </p>
        </div>

    )
}
