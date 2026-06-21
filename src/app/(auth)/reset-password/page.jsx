// Page Reset Password - URL: /reset-password?token=...
import AuthLayout from '@/components/auth-form/AuthLayout'
import ResetPasswordForm from '@/components/auth-form/ResetPasswordForm'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

export default function ResetPasswordPage() {
    return (
        <AuthLayout
            title="Reset Password"
            description="Silakan masukkan kata sandi baru Anda"
            image="/images/reset-password-illustration.png"
        >
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center p-8">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-2" />
                    <p className="text-gray-500">Menyiapkan halaman...</p>
                </div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </AuthLayout>
    )
}
