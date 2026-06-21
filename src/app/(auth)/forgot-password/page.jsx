// Page Lupa Password - URL: /forgot-password
import AuthLayout from '@/components/auth-form/AuthLayout'
import ForgotPasswordForm from '@/components/auth-form/ForgotPasswordForm'

export default function ForgotPasswordPage() {
    return (
        <AuthLayout
            title="Lupa Password"
            description="Masukkan email Anda untuk memulihkan kata sandi"
            image="/images/forgot-password-illustration.png"
        >
            <ForgotPasswordForm />
        </AuthLayout>
    )
}
