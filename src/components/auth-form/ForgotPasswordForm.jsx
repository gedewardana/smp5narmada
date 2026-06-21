'use client'
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"

// UI FORM untuk halaman Lupa Password
export default function ForgotPasswordForm() {

    const router = useRouter()
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const handleForgotPassword = async (e) => {
        e.preventDefault()
        if (!email) return toast.error('Email wajib diisi')
        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengirim email');
            }

            toast.success(data.message || 'Link reset password telah dikirim ke email Anda');
        } catch (error) {
            toast.error(error.message || 'Terjadi kesalahan');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleForgotPassword} className="space-y-4">
            {/* Instruksi */}
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                <p className="text-sm text-gray-700">
                    Masukkan email Anda yang terdaftar. Kami akan mengirimkan link untuk reset password.
                </p>
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    placeholder="nama@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            {/* Button Kirim */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
                {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                <span>{isLoading ? "Loading..." : "Kirim Link Reset Password"}</span>
            </button>

            {/* Link kembali ke Login */}
            <p className="text-center text-sm text-gray-600">
                Ingat Kata Sandi Anda?{' '}
                <button onClick={() => router.push('/login')} className="text-blue-600 hover:text-blue-700 font-semibold">
                    Kembali ke Login
                </button>
            </p>
        </form>
    )
}
