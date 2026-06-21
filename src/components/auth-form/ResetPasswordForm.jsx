'use client'
import { Loader2, Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { resetPasswordSchema, formatZodError } from "@/utils/regisvalidation"

export default function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
        setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }


    // Cek token saat mount
    useEffect(() => {
        if (!token) {
            toast.error('Token tidak valid atau sudah kedaluwarsa')
            router.push('/forgot-password')
        }
    }, [token, router])

    const handleResetPassword = async (e) => {
        e.preventDefault()
        setErrors({})

        // Validasi menggunakan Zod
        const validation = resetPasswordSchema.safeParse(formData)
        
        if (!validation.success) {
            const formattedErrors = formatZodError(validation.error)
            setErrors(formattedErrors.errors)

            const firstErrorField = Object.keys(formattedErrors.errors)[0]
            if (firstErrorField) {
                const errorElement = document.querySelector(`input[name="${firstErrorField}"]`)
                if (errorElement) errorElement.focus()
            }

            return toast.error(formattedErrors.error)
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token, 
                    password: formData.password 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Gagal mereset password');
            }

            toast.success('Password berhasil diperbarui. Silakan login kembali.');
            router.push('/login');
        } catch (error) {
            toast.error(error.message || 'Terjadi kesalahan');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleResetPassword} className="space-y-4">
            {/* Password Baru */}
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Baru
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Konfirmasi Password */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konfirmasi Password Baru
                </label>
                <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Button Reset */}
            <button
                type="submit"
                disabled={isLoading || !token}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                <span>{isLoading ? "Memproses..." : "Reset Password"}</span>
            </button>

            {/* Link kembali ke Login */}
            <p className="text-center text-sm text-gray-600">
                Batal reset?{' '}
                <button type="button" onClick={() => router.push('/login')} className="text-blue-600 hover:text-blue-700 font-semibold">
                    Kembali ke Login
                </button>
            </p>
        </form>
    )
}
